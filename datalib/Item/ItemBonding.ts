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
import { Enum, EnumField } from "wotlkdata/cell/Systems/Enum";
import { ItemBase } from "./Item";

export class ItemBonding extends Enum<ItemBase> {
    constructor(owner: ItemBase) {
        super(owner, owner.row.bonding);
    }

    @EnumField(0)
    setNoBounds() { return this.set(0); }

    @EnumField(1)
    setBindsOnPickup() { return this.set(1); }

    @EnumField(2)
    setBindsOnEquip() { return this.set(2); }

    @EnumField(3)
    setBindsOnUse() { return this.set(3); }

    @EnumField(4)
    setQuestItem() { return this.set(4); }
}