/*
 * This file is part of tswow (https://github.com/tswow)
 *
 * Copyright (C) 2020 tswow <https://github.com/tswow/>
 * This program is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
import { EnumCell } from "wotlkdata/cell/cells/EnumCell";
import { ArrayEntry, ArraySystem } from "wotlkdata/cell/systems/ArraySystem";
import { ItemTemplate } from "./ItemTemplate";

function IdRows(owner: ItemTemplate) {
    return [
        owner.row.spellid_1,
        owner.row.spellid_2,
        owner.row.spellid_3,
        owner.row.spellid_4,
        owner.row.spellid_5,
    ]
}

function CatRows(owner: ItemTemplate) {
    return [
        owner.row.spellcategory_1,
        owner.row.spellcategory_2,
        owner.row.spellcategory_3,
        owner.row.spellcategory_4,
        owner.row.spellcategory_5,
    ]
}

function TriggerRows(owner: ItemTemplate) {
    return [
        owner.row.spelltrigger_1,
        owner.row.spelltrigger_2,
        owner.row.spelltrigger_3,
        owner.row.spelltrigger_4,
        owner.row.spelltrigger_5,
    ]
}

function ChargeRows(owner: ItemTemplate) {
    return [
        owner.row.spellcharges_1,
        owner.row.spellcharges_2,
        owner.row.spellcharges_3,
        owner.row.spellcharges_4,
        owner.row.spellcharges_5,
    ]
}

function PPMRows(owner: ItemTemplate) {
    return [
        owner.row.spellppmRate_1,
        owner.row.spellppmRate_2,
        owner.row.spellppmRate_3,
        owner.row.spellppmRate_4,
        owner.row.spellppmRate_5,
    ]
}

function CooldownRows(owner: ItemTemplate) {
    return [
        owner.row.spellcooldown_1,
        owner.row.spellcooldown_2,
        owner.row.spellcooldown_3,
        owner.row.spellcooldown_4,
        owner.row.spellcooldown_5,
    ]
}

function CCooldownRows(owner: ItemTemplate) {
    return [
        owner.row.spellcategorycooldown_1,
        owner.row.spellcategorycooldown_2,
        owner.row.spellcategorycooldown_3,
        owner.row.spellcategorycooldown_4,
        owner.row.spellcategorycooldown_5,
    ]
}

export class ItemSpellTrigger extends EnumCell<ItemSpell> {
    /** Enum Value:                       0 */
    get OnUse()       { return this.value(0) }
    /** Enum Value:                       1 */
    get OnEquip()     { return this.value(1) }
    /** Enum Value:                       2 */
    get ChanceOnHit() { return this.value(2) }
    /** Enum Value:                       4 */
    get Soulstone()   { return this.value(4) }
    /** Enum Value:                       5 */
    get UseNoDelay()  { return this.value(5) }
    /** Enum Value:                       6 */
    get OnLearn()     { return this.value(6) }
}

export class ItemSpell extends ArrayEntry<ItemTemplate> {
    clear() {
        this.SpellID.set(0);
        this.Category.set(0);
        this.Trigger.set(0);
        this.Charges.set(0);
        this.ProcsPerMinute.set(0);
        this.Cooldown.set(-1);
        this.CategoryCooldown.set(-1);
        return this;
    }
    isClear(): boolean {
        return this.SpellID.get() === 0;
    }

    get SpellID() { return this.wrap(IdRows(this.container)[this.index]); }
    get Category() { return this.wrap(CatRows(this.container)[this.index]); }
    get Trigger() { return new ItemSpellTrigger(this, TriggerRows(this.container)[this.index]); }
    get Charges() { return this.wrap(ChargeRows(this.container)[this.index]); }
    get ProcsPerMinute() { return this.wrap(PPMRows(this.container)[this.index]); }
    get Cooldown () { return this.wrap(CooldownRows(this.container)[this.index]); }
    get CategoryCooldown() { return this.wrap(CCooldownRows(this.container)[this.index]); }
}

export class ItemSpells extends ArraySystem<ItemSpell, ItemTemplate> {
    get(index: number): ItemSpell {
        return new ItemSpell(this.owner, index);
    }

    get length(): number {
        return 5;
    }

    getFree() {
        return super.getFree();
    }

    modFree(callback: (itemSpell: ItemSpell)=>void) {
        callback(this.getFree());
        return this.owner;
    }
}