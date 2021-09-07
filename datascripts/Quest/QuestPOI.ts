import { quest_poi_pointsRow } from "wotlkdata/sql/types/quest_poi_points";
import { quest_poiRow } from "wotlkdata/sql/types/quest_poi";
import { MainEntity } from "../Misc/Entity";
import { Quest, QuestRefReadOnly } from "./Quest";
import { MapRef } from "../Map/Map";
import { WorldMapArea, WorldMapAreaRef, WorldMapAreaRegistry } from "../Worldmap/WorldMapArea";
import { RefBase } from "../Refs/Ref";
import { SQL } from "wotlkdata"
import { DummyCell } from "wotlkdata/cell/cells/DummyCell";
import { PositionXYCell } from "../Misc/PositionCell";
import { MultiRowSystem } from "wotlkdata/cell/systems/MultiRowSystem";
import { Position } from "../Misc/Position";
import { gt, lt } from "wotlkdata/query/Relations";

export class QuestPOIPoint extends MainEntity<quest_poi_pointsRow> {
    get Quest() { return new QuestRefReadOnly(this, this.row.QuestID); }
    get POI() { return new QuestPOIRef(this,new DummyCell(this,0))}
    get Index() { return this.row.Idx2.get(); }
    get Position() {
        return new PositionXYCell(
              this
            , this.row.X
            , this.row.Y
        )
    }
}

export class QuestPOIPoints extends MultiRowSystem<QuestPOIPoint,QuestPOI> {
    protected getAllRows(): QuestPOIPoint[] {
        return SQL.quest_poi_points
            .filter({QuestID:this.owner.Index, Idx1: this.owner.Index})
            .map(x=>new QuestPOIPoint(x))
            .sort((a,b)=>a.Index > b.Index ? 1 : -1)
    }
    protected isDeleted(value: QuestPOIPoint): boolean {
        return value.row.isDeleted();
    }

    add(values: Position[]) {
        let rows = this.getAllRows();
        let lastIndex = rows.length === 0 ? 0 : (rows[rows.length-1].Index - 1)
        values.forEach((pos,i)=>{
            SQL.quest_poi_points.add(
                  this.owner.Quest.getRefID()
                , this.owner.Index
                , lastIndex+i
            )
            .X.set(pos.x)
            .Y.set(pos.y)
        });
        return this.owner;
    }
}

export class QuestPOI extends MainEntity<quest_poiRow> {
    get Quest() { return new QuestRefReadOnly(this, this.row.QuestID); }
    get Index() { return this.row.id.get(); }
    get ObjectiveIndex() { return this.wrap(this.row.ObjectiveIndex); }
    get Map() { return new MapRef(this, this.row.MapID); }
    get WorldMapArea() { 
        return new WorldMapAreaRef(this, this.row.WorldMapAreaId); 
    }
    get Floor() { return this.wrap(this.row.Floor); }
    get Priority() { return this.wrap(this.row.Priority); }
    // TODO: figure out the flags
    get Flags() { return this.wrap(this.row.Flags); }
    get Points() { return new QuestPOIPoints(this); }
}

export class QuestPOIRef extends RefBase<QuestPOIPoint,QuestPOI> {
    exists(): boolean {
        return true;
    }
    protected id(v: QuestPOI): number {
        return v.Index;
    }
    protected resolve(): QuestPOI {
        return new QuestPOI(SQL.quest_poi
            .find({
                QuestID:this.owner.row.QuestID.get(),
                id: this.owner.row.Idx1.get()
            }))
    }
}

export class QuestPOIs extends MultiRowSystem<QuestPOI,Quest> {
    protected getAllRows(): QuestPOI[] {
        return SQL.quest_poi.filter(
            {QuestID:this.owner.ID})
        .map(x=>new QuestPOI(x))
        .sort((a,b)=>a.Index>b.Index?1:-1)
    }

    add(objective: number, points: Position[], worldMapArea?: number) {
        if(points.length === 0) {
            throw new Error(`Quest POI must be made up of at least one point`)
        }

        points.forEach((v)=>{
            if(v.map!=points[0].map) {
                throw new Error(`Multiple maps in quest poi positions`)
            }
        });

        let map = points[0].map
        let area: WorldMapArea;

        if(!worldMapArea) {
            // Need to flip x/y for world map points
            let {x,y} = points
                .reduce(({x,y},c)=>({x:x+c.y,y:y+c.x}),{x:0,y:0})
            x /= points.length;
            y /= points.length;
            area = WorldMapAreaRegistry.filter({
                  MapID:map
                , LocLeft:gt(x)
                , LocRight:lt(x)
                , LocBottom:lt(y)
                , LocTop:gt(y)
            })
            .filter(x=>{
                return true;
            })
            .sort((a,b)=>{
                let {x:ax,y:ay} = a.Boundary.GetMiddle();
                let {x:bx,y:by} = b.Boundary.GetMiddle();
                let da = Math.sqrt(Math.pow(ax-x,2)+Math.pow(ay-y,2))
                let db = Math.sqrt(Math.pow(bx-x,2)+Math.pow(by-y,2))
                return da > db ? 1 : -1
            })[0]
            if(!area) {
                throw new Error(`No WorldMapArea found for coordinates, please specify one`)
            }
        } else {
            area = WorldMapAreaRegistry.load(worldMapArea);
        }

        let rows = this.getAllRows();

        new QuestPOI(SQL.quest_poi.add(
            this.owner.ID,rows.length === 0 
                ? 0 
                : (rows[rows.length-1].Index + 1)
        ))
            .ObjectiveIndex.set(objective)
            .Flags.set(3)
            .Floor.set(0)
            .Map.setRefID(map)
            .Points.add(points)

        return this.owner;
    }

    protected isDeleted(value: QuestPOI): boolean {
        return value.row.isDeleted();
    }
}