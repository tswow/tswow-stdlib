import { DBC } from "wotlkdata";
import { SpellItemEnchantmentQuery, SpellItemEnchantmentRow } from "wotlkdata/dbc/types/SpellItemEnchantment";
import { Table } from "wotlkdata/table/Table";
import { ItemEffectsRegistry } from "../Item/ItemVisualEffect";
import { MainEntity } from "../Misc/Entity";
import { Ids, StaticIDGenerator } from "../Misc/Ids";
import { RegistryStatic } from "../Refs/Registry";
import { EnchantmentConditionRegistry } from "./EnchantmentCondition";
import { EnchantmentEffects } from "./EnchantmentEffect";
import { EnchantmentFlags } from "./EnchantmentFlags";
import { EnchantmentSpells } from "./EnchantmentSpells";

export class Enchantment extends MainEntity<SpellItemEnchantmentRow> {
    get Charges() { return this.wrap(this.row.Charges); }
    get Effects() { return new EnchantmentEffects(this); }
    get ID() { return this.row.ID.get(); }
    /**
     * All spells that are used to cast this enchantment.
     *
     * For spells cast by the enchantment itself, see "Effects"
     */
    get EnchantSpells() { return new EnchantmentSpells(this); }
    get ItemVisuals() { return ItemEffectsRegistry.ref(this, this.row.ItemVisual); }
    get Flags() { return new EnchantmentFlags(this, this.row.Flags); }
    get Condition() { return EnchantmentConditionRegistry.ref(this, this.row.Condition_Id); }
    get Name() { return this.wrapLoc(this.row.Name); }
}

export class EnchantmentRegistryClass
    extends RegistryStatic<
          Enchantment
        , SpellItemEnchantmentRow
        , SpellItemEnchantmentQuery
    >
{
    protected Table(): Table<any, SpellItemEnchantmentQuery, SpellItemEnchantmentRow> & { add: (id: number) => SpellItemEnchantmentRow; } {
        return DBC.SpellItemEnchantment
    }
    protected IDs(): StaticIDGenerator {
        return Ids.SpellItemEnchantment
    }
    Clear(r: Enchantment, mod: string, name: string): void {
        r.Charges.set(0)
         .Condition.set(0)
         .Effects.clearAll()
         .Flags.clearAll()
         .ItemVisuals.set(0)
         .Name.clear()
    }
    protected Entity(r: SpellItemEnchantmentRow): Enchantment {
        return new Enchantment(r);
    }
    protected FindByID(id: number): SpellItemEnchantmentRow {
        return DBC.SpellItemEnchantment.findById(id);
    }
    protected EmptyQuery(): SpellItemEnchantmentQuery {
        return {}
    }
    ID(e: Enchantment): number {
        return e.ID
    }
}

export const EnchantmentRegistry = new EnchantmentRegistryClass();