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
import { MaskCell32 } from "wotlkdata/cell/cells/MaskCell";
import { Spell } from "./Spell";

export class AuraInterruptFlags extends MaskCell32<Spell> {
    constructor(owner: Spell) {
        super(owner, owner.row.AuraInterruptFlags);
    }

    get HitBySpell() { return this.bit(0); }
    get TakeDamage() { return this.bit(1); }
    get Cast() { return this.bit(2); }
    get Move() { return this.bit(3); }
}