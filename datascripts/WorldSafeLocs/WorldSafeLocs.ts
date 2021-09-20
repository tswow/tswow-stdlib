import { DBC } from "wotlkdata";
import { Cell } from "wotlkdata/cell/cells/Cell";
import { WorldSafelocsQuery, WorldSafelocsRow } from "wotlkdata/dbc/types/WorldSafelocs";
import { Table } from "wotlkdata/table/Table";
import { MainEntity } from "../Misc/Entity";
import { DynamicIDGenerator, Ids } from "../Misc/Ids";
import { PositionMapXYZCell } from "../Misc/PositionCell";
import { RefDynamic } from "../Refs/Ref";
import { RegistryDynamic } from "../Refs/Registry";

export class WorldSafeLoc extends MainEntity<WorldSafelocsRow> {
    get ID() { return this.row.ID.get(); }
    get Position() { return new PositionMapXYZCell(this, this.row.Continent, this.row.LocX, this.row.LocY, this.row.LocZ); }
    get Name() { return this.wrapLoc(this.row.AreaName); }
}


export class WorldSafeLocRef<T> extends RefDynamic<T,WorldSafeLoc>
{
    setSimple(obj: {map: number, x: number, y: number, z: number}) {
        this.cell.set(WorldSafeLocRegistry.createSimple(obj).ID);
        return this.owner;
    }
}

export class WorldSafeLocsRegistryClass
    extends RegistryDynamic<WorldSafeLoc,WorldSafelocsRow,WorldSafelocsQuery>
{
    ref<T>(owner: T, value: Cell<number,any>): WorldSafeLocRef<T> {
        return new WorldSafeLocRef(owner,value,this);
    }

    protected Table(): Table<any, WorldSafelocsQuery, WorldSafelocsRow> & { add: (id: number) => WorldSafelocsRow; } {
        return DBC.WorldSafelocs
    }
    protected ids(): DynamicIDGenerator {
        return Ids.WorldSafelocs
    }
    Clear(entity: WorldSafeLoc): void {
        entity
            .Name.clear()
            .Position.setSpread(0,0,0,0)
    }
    protected Clone(entity: WorldSafeLoc, parent: WorldSafeLoc): void {
        entity.Name.set(parent.Name.objectify())
        entity.Position.setSpread(
              parent.Position.X.get()
            , parent.Position.Y.get()
            , parent.Position.Z.get()
            , parent.Position.Map.get()
        )
    }
    protected Entity(r: WorldSafelocsRow): WorldSafeLoc {
        return new WorldSafeLoc(r);
    }
    protected FindByID(id: number): WorldSafelocsRow {
        return DBC.WorldSafelocs.findById(id);
    }
    protected EmptyQuery(): WorldSafelocsQuery {
        return {}
    }
    protected ID(e: WorldSafeLoc): number {
        return e.ID
    }

    createSimple(obj: {map: number, x: number, y: number, z: number}) {
        return this.create().Position.set(obj);
    }
}

export const WorldSafeLocRegistry = new WorldSafeLocsRegistryClass();