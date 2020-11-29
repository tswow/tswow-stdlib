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
import { Subsystem } from "wotlkdata/cell/Subsystem";
import { ItemBase } from "./Item";

export class ItemShop extends Subsystem<ItemBase> {
    private row() { return this.owner.sqlRow; }

    set(buycount: number, buyprice: number, sellprice: number) {
        this.BuyCount.set(buycount);
        this.BuyPrice.set(BigInt(buyprice));
        this.SellPrice.set(sellprice);
        return this.owner;
    }

    get BuyCount() { return this.ownerWrap(this.row().BuyCount); }
    get BuyPrice() { return this.ownerWrap(this.row().BuyPrice); }
    get SellPrice() { return this.ownerWrap(this.row().SellPrice); }
}