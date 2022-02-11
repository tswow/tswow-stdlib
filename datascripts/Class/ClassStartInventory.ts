import { makeMask, MaskCon } from "wowdata/wowdata/cell/cells/MaskCell";
import { CellSystem } from "wowdata/wowdata/cell/systems/CellSystem";
import { SQL } from "wowdata/wowdata/sql/SQLFiles";
import { RaceMask } from "../Race/RaceType";
import { Class } from "./Class";

export class ClassStartInventory extends CellSystem<Class> {
    add(items: number, amount: number, races?: MaskCon<keyof typeof RaceMask>) {
        SQL.playercreateinfo_item.add(makeMask(RaceMask,races), this.owner.ID, items)
            .amount.set(amount)
        return this.owner;
    }
}

