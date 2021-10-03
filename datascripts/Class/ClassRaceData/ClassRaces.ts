import { DBC, SQL } from "wotlkdata";
import { MultiRowSystem } from "wotlkdata/cell/systems/MultiRowSystem";
import { CharBaseInfoRow } from "wotlkdata/dbc/types/CharBaseInfo";
import { MainEntity } from "../../Misc/Entity";
import { Ids } from "../../Misc/Ids";
import { RaceType, resolveRaceType } from "../../Race/RaceType";
import { Class, ClassRegistry } from "../Class";
import { DefaultClassRaces, getDefaultClass, getDefaultRace } from "../ClassDefaultRaces";
import { ClassRaceActions } from "./ClassRaceAction";
import { ClassRaceSpawn } from "./ClassRaceSpawn";
import { StartGearRef } from "./ClassRaceStartGear";
import { ClassRaceStats } from "./RaceClassStats";

export class ClassRacePair extends MainEntity<CharBaseInfoRow> {
    get Race() { return this.wrapReadOnly(this.row.RaceID); }
    get Class() { return ClassRegistry.readOnlyRef(this, this.row.ClassID); }
    get SpawnPosition() { return new ClassRaceSpawn(this); }
    get Stats() { return new ClassRaceStats(this); }
    get Outfits() {
        return new StartGearRef(this, this.Class.get(), this.Race.get());
    }
    get Actions() {
        return new ClassRaceActions(this, this.Class.get(),this.Race.get());
    }
}

export class ClassRaces extends MultiRowSystem<ClassRacePair,Class> {
    protected getAllRows(): ClassRacePair[] {
        return DBC.CharBaseInfo.filter({ClassID:this.owner.ID})
            .map(x=>new ClassRacePair(x))
    }
    protected isDeleted(value: ClassRacePair): boolean {
        return value.row.isDeleted();
    }

    delete(races: RaceType|RaceType[]) {
        if(!Array.isArray(races)) {
            races = [races];
        }
        races.forEach(x=>{
            DBC.CharBaseInfo.find({ClassID:this.owner.ID,RaceID:resolveRaceType(x)})
                .delete();
        })
        return this.owner;
    }

    add(races: RaceType|RaceType[]) {
        if(!Array.isArray(races)) {
            races = [races];
        }
        // Is base class
        for(let raceType of races) {
            const raceid = resolveRaceType(raceType);

            if(this.owner.ID <= 11) {
                let found = false;
                for(const {race,cls} of Object.values(DefaultClassRaces)) {
                    if(race==raceid && cls == this.owner.ID) {
                        found = true;
                        break;
                    }
                }
                if(found) {
                    continue;
                }
            }

            const {race: oldRace,cls} = getDefaultRace(raceid,this.owner.BaseClass);

            SQL.player_levelstats
                .filter({class: cls, race: oldRace})
                .forEach(x=>x.clone(raceid,this.owner.ID,x.level.get()));

            DBC.CharStartOutfit
                .filter({ClassID: cls, RaceID: oldRace})
                .forEach(x=>x.clone(Ids.CharStartOutfit.id())
                    .ClassID.set(this.owner.ID)
                    .RaceID.set(raceid))

            // By default, the classes should come from here.
            const defaultClass = getDefaultClass(raceid);
            SQL.playercreateinfo.find({race: raceid, class: defaultClass})
                .clone(raceid, this.owner.ID)

            DBC.CharBaseInfo.add(raceid,this.owner.ID);
        }
        return this.owner;
    }
};