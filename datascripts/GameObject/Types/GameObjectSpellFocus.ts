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
import { GameObjectTemplate } from "../GameObjectTemplate";
import { gameobject_templateRow } from "wotlkdata/sql/types/gameobject_template";

export class GameObjectSpellFocus extends GameObjectTemplate<GameObjectSpellFocus> {
    constructor(row: gameobject_templateRow) {
        super(row);
        this.Type.setSpellFocus();
    }
    get FocusID() { return this.wrap(this.row.Data0); }
    get Distance() { return this.wrap(this.row.Data1); }
    get LinkedTrapID() { return this.wrap(this.row.Data2); }
    get ServerOnly() { return this.wrap(this.row.Data3); }
    get QuestID() { return this.wrap(this.row.Data4); }
    get Large() { return this.wrap(this.row.Data5); }
    get FloatingTooltip() { return this.wrap(this.row.Data6); }
    get FloatOnWater() { return this.wrap(this.row.Data7); }
    get ConditionID() { return this.wrap(this.row.Data8); }
}