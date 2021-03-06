/*
* This file is part of tswow (https://github.com/tswow)
*
* Copyright (C) 2021 tswow <https://github.com/tswow/>
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
import { ItemDisplayInfo } from "./ItemDisplayInfo";
import { CellSystem } from "wotlkdata/cell/systems/CellSystem";

export class ItemIcon<T> extends CellSystem<ItemDisplayInfo<T>> {
    set(value: string) {
        if(value.includes('\\')) {
            if(!value.startsWith('Interface\\Icons\\')) {
                throw new Error(
                    `Invalid icon path ${value}:`
                    +` ItemIcons cannot have absolute paths outside of Interface\\Icons`);
            }
            value = value.replace('Interface\\Icons\\','');
        }
        this.owner.row.InventoryIcon.setIndex(0,value);
        return this.owner;
    }

    get() {
        return this.owner.row.InventoryIcon.getIndex(0);
    }
}