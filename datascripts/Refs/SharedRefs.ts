import { AutoIdGenerator } from "../Base/Ids";
import { BaseSystem } from "wotlkdata/cell/BaseSystem";
import { Cell } from "wotlkdata/cell/Cell";
import { AttachedLootSet } from "../Loot/Loot";

function shouldClone(gen: AutoIdGenerator, holder: BaseSystem, cell: Cell<number,any>) {
    return !AutoIdGenerator.isCustom(gen, cell.get()) && BaseSystem.getUniqueRefs(holder);
}

export const SharedRefs = {
    getOrCreateLoot<T>(holder: BaseSystem, set: AttachedLootSet<T>) {
        let cell = AttachedLootSet.cell(set);
        let idgen = AttachedLootSet.idgen(set);

        if(cell.get()==0) {
            cell.set(idgen.id());
            return set;
        }

        if(shouldClone(idgen,holder,cell)) {
            set.makeUnique(true);
        }

        return set;
    },
}