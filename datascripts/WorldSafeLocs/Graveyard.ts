import { makeMaskCell32 } from "wotlkdata/cell/cells/MaskCell";
import { MultiRowSystem } from "wotlkdata/cell/systems/MultiRowSystem";
import { SQL } from "wotlkdata/sql/SQLFiles";
import { graveyard_zoneRow } from "wotlkdata/sql/types/graveyard_zone";
import { Faction } from "../Faction/Faction";
import { MainEntity } from "../Misc/Entity";
import { FactionEnum } from "../Misc/FactionEnum";
import { Team } from "../Misc/TeamEnum";
import { WorldSafeLoc, WorldSafeLocRegistry } from "./WorldSafeLocs";

export class Graveyard extends MainEntity<graveyard_zoneRow> {

    get WorldSafeLoc() {
        return WorldSafeLocRegistry.readOnlyRef(this, this.row.ID)
    }

    get Area() {
        return WorldSafeLocRegistry.readOnlyRef(this, this.row.GhostZone);
    }

    get Faction() {
        return makeMaskCell32(Team,this, this.row.Faction)
    }
}

export class Graveyards extends MultiRowSystem<Graveyard,WorldSafeLoc> {
    protected getAllRows(): Graveyard[] {
        return SQL.graveyard_zone.filter({ID:this.owner.ID})
            .map(x=>new Graveyard(x))
    }
    protected isDeleted(value: Graveyard): boolean {
        return value.row.isDeleted();
    }

    add(area: number, faction: Team) {
        SQL.graveyard_zone.add(this.owner.ID,area)
            .Faction.set(faction)
            .Comment.set('tswow')
        return this.owner;
    }
}