import { Cell, CPrim } from "wowdata/wowdata/cell/cells/Cell";
import { MaskCell } from "wowdata/wowdata/cell/cells/MaskCell";
import { CellSystem } from "wowdata/wowdata/cell/systems/CellSystem";

export class IncludeExcludeMask<T,M extends MaskCell<T>> extends CellSystem<T> {
    readonly Include: M;
    readonly Exclude: M;

    constructor(owner: T,include: M, exclude: M) {
        super(owner);
        this.Include = include;
        this.Exclude = exclude;
    }
}

export class IncludeExclude<V extends CPrim,T> extends CellSystem<T> {
    readonly Include: Cell<V, T>;
    readonly Exclude: Cell<V, T>;

    constructor(owner: T,include: Cell<V, T>, exclude: Cell<V, T>) {
        super(owner);
        this.Include = include;
        this.Exclude = exclude;
    }
}