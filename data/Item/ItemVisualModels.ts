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
import { ArrayEntry, SystemArray } from "wotlkdata/cell/Systems/SystemArray";
import { ItemTemplate } from "./ItemTemplate";

export class ItemVisualModel extends ArrayEntry<ItemTemplate> {
    get Model() { return this.wrapIndex(this.owner.Visual.row.ModelName, this.index); }
    get ModelTexture() { return this.wrapIndex(this.owner.Visual.row.ModelTexture, this.index); }

    clear(): ItemTemplate {
        this.Model.set("")
        this.ModelTexture.set("");
        return this.owner;
    }

    isClear(): boolean {
        return this.Model.get()==='' && this.ModelTexture.get()===''
    }
}

export class ItemVisualModels extends SystemArray<ItemVisualModel,ItemTemplate> {
    get length(): number {
        return 2;
    }

    get(index: number): ItemVisualModel {
        return new ItemVisualModel(this.owner, index);
    }

    add(model: string, texture: string) {
        return this.getFree()
            .Model.set(model)
            .ModelTexture.set(texture);
    }
}