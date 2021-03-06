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
import { EnumCellWrapper, EnumField } from "wotlkdata/cell/cells/EnumCell";
import { MaskCell32 } from "wotlkdata/cell/cells/MaskCell";

export class CreatureTypeEnum<T> extends EnumCellWrapper<T> {
    @EnumField(0)
    setNone() { return this.set(0); }

    @EnumField(1)
    setBeast() { return this.set(1); }

    @EnumField(2)
    setDragonkin() { return this.set(2); }

    @EnumField(3)
    setDemon() { return this.set(3); }

    @EnumField(4)
    setElemental() { return this.set(4); }

    @EnumField(5)
    setGiant() { return this.set(5); }

    @EnumField(6)
    setUndead() { return this.set(6); }

    @EnumField(7)
    setHumanoid() { return this.set(7); }

    @EnumField(8)
    setCritter() { return this.set(8); }

    @EnumField(9)
    setMechanical() { return this.set(9); }

    @EnumField(10)
    setNotSpecified() { return this.set(10); }

    @EnumField(11)
    setTotem() { return this.set(11); }

    @EnumField(12)
    setNonCombatPet() { return this.set(12); }

    @EnumField(13)
    setGasCloud() { return this.set(13); }

    @EnumField(14)
    setWildPet() { return this.set(14); }

    @EnumField(15)
    setAberration() { return this.set(15); }
}

export class CreatureTypeMask<T> extends MaskCell32<T> {
    get None() { return this.bit(0); }
    get Beast() { return this.bit(1); }
    get Dragonkin() { return this.bit(2); }
    get Demon() { return this.bit(3); }
    get Elemental() { return this.bit(4); }
    get Giant() { return this.bit(5); }
    get Undead() { return this.bit(6); }
    get Humanoid() { return this.bit(7); }
    get Critter() { return this.bit(8); }
    get Mechanical() { return this.bit(9); }
    get NotSpecified() { return this.bit(10); }
    get Totem() { return this.bit(11); }
    get NonCombatPet() { return this.bit(12); }
    get GasCloud() { return this.bit(13); }
    get WildPet() { return this.bit(14); }
    get Aberration() { return this.bit(15); }
}