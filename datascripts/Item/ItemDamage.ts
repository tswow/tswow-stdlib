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
import { EnumCellWrapper } from "wotlkdata/cell/cells/EnumCell";
import { ArrayEntry, ArraySystem } from "wotlkdata/cell/systems/ArraySystem";
import { ItemTemplate } from "./ItemTemplate";

function schools(owner: ItemTemplate) {
    return [
        owner.row.dmg_type1,
        owner.row.dmg_type2
    ]
}

function dmgMin(owner: ItemTemplate) {
    return [
        owner.row.dmg_min1,
        owner.row.dmg_min2,
    ]
}

function dmgMax(owner: ItemTemplate) {
    return [
        owner.row.dmg_max1,
        owner.row.dmg_max2,
    ]
}

export class DamageSchool<T> extends EnumCellWrapper<T> {
    setPhysical() { return this.set(0); }
    setHoly() { return this.set(1); }
    fetFire() { return this.set(2); }
    setNature() { return this.set(3); }
    setFrost() { return this.set(4); }
    setShadow() { return this.set(5); }
    setArcane() { return this.set(6); }
}

export class ItemDamage extends ArrayEntry<ItemTemplate> {
    get school() { return schools(this.owner)[this.index]; }
    get min() { return dmgMin(this.owner)[this.index]; }
    get max() { return dmgMax(this.owner)[this.index]; }

    clear(): ItemTemplate {
        this.school.set(0);
        this.min.set(0);
        this.max.set(0);
        return this.owner;
    }

    isClear(): boolean {
        return this.school.get() === 0 && this.min.get() === 0 && this.max.get() === 0;
    }
}

export class ItemDamages extends ArraySystem<ItemDamage, ItemTemplate> {
    get length(): number {
        return 2;
    }
    get(index: number): ItemDamage {
        return new ItemDamage(this.owner, index);
    }

    private add(type: number, min: number, max: number) {
        const free = this.getFree()
        free.school.set(type);
        free.min.set(min);
        free.max.set(max);
        return this.owner;
    }

    addPhysical(min: number, max: number) {
        return this.add(0, min, max);
    }

    addHoly(min: number, max: number) {
        return this.add(1, min, max);
    }

    addFire(min: number, max: number) {
        return this.add(2, min, max);
    }

    addNature(min: number, max: number) {
        return this.add(3, min, max);
    }

    addFrost(min: number, max: number) {
        return this.add(4, min, max);
    }

    addShadow(min: number, max: number) {
        return this.add(5, min, max);
    }

    addArcane(min: number, max: number) {
        return this.add(6, min, max);
    }
}