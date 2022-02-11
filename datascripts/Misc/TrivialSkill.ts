import { Cell } from "wowdata/wowdata/cell/cells/Cell";
import { CellSystem } from "wowdata/wowdata/cell/systems/CellSystem";

export class TrivialSkill<T> extends CellSystem<T> {
    lowCell: Cell<number,any>
    highCell: Cell<number,any>

    constructor(owner: T, lowCell: Cell<number,any>, highCell: Cell<number,any>) {
        super(owner);
        this.lowCell = lowCell;
        this.highCell = highCell;
    }

    get Low() { return this.ownerWrap(this.lowCell); }
    get High() { return this.ownerWrap(this.highCell); }

    set(low: number, high: number) {
        this.Low.set(low);
        this.High.set(high);
        return this.owner;
    }
}