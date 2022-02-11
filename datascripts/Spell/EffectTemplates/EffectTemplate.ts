import { CPrim } from "wowdata/wowdata/cell/cells/Cell";
import { CellArray, CellIndexWrapper } from "wowdata/wowdata/cell/cells/CellArray";
import { EnumCellTransform } from "wowdata/wowdata/cell/cells/EnumCell";
import { Objects } from "wowdata/wowdata/cell/serialization/ObjectIteration";
import { Transient } from "wowdata/wowdata/cell/serialization/Transient";
import { CellSystem } from "wowdata/wowdata/cell/systems/CellSystem";
import { SelfRef } from "../../Refs/Ref";
import { SpellEffect } from "../SpellEffect";
import { SpellTargetPosition } from "../SpellTargetPosition";

export class EffectTemplate extends CellSystem<SpellEffect> {
    protected w<T extends CPrim>(arr: CellArray<T,any>): CellIndexWrapper<T,this> {
        return this.wrapIndex(arr, this.index);
    }
    @Transient
    protected get row() { return this.owner.row; }
    @Transient
    get index() { return this.owner.index; }
    @Transient
    get AsEffect() { return new SelfRef(this, ()=>this.owner); }

    get TargetPosition() {
        return new SpellTargetPosition(this, this.row.ID.get(), this.owner.index)
    }

    objectify() {
        const eff = this.AsEffect.get();
        if(eff.Aura.get() > 0) {
            let {cell:auraCell} = EnumCellTransform.getSelection(eff.Aura);
            return {
                  Type: this.AsEffect.get().Type.objectify()
                , Aura: this.AsEffect.get().Aura.objectify()
                , ...Objects.objectifyObj(auraCell.as())
            }
        } else {
            return {
                  Type: this.AsEffect.get().Type.objectify()
                , Aura: 'NONE'
                , ...Objects.objectifyObj(this)
            }
        }
    }
}