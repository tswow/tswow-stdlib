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
import { DBC, finish, isReadOnly } from "wotlkdata";
import { MaskCell32 } from "wotlkdata/cell/cells/MaskCell";
import { MultiRowSystem } from "wotlkdata/cell/systems/MultiRowSystem";
import { TalentTabRow } from "wotlkdata/dbc/types/TalentTab";
import { ClassMask } from "../Misc/ClassMask";
import { MainEntity } from "../Misc/Entity";
import { Ids } from "../Misc/Ids";
import { SpellIconCell } from "../Spell/SpellIcon";
import { SpellRegistry } from "../Spell/Spells";
import { Talent } from "./Talent";
import { TalentTreeRegistry } from "./Talents";

export class TalentTreeTalents extends MultiRowSystem<Talent,TalentTree> {
    protected getAllRows(): Talent[] {
        return DBC.Talent.filter({TabID:this.owner.ID})
            .map(x=>new Talent(x));
    }
    protected isDeleted(value: Talent): boolean {
        return value.row.isDeleted();
    }

    getPos(row: number, column: number) {
        return new Talent(DBC.Talent
            .find({
                  TabID:this.owner.ID
                , ColumnIndex:column
                , TierID:row
            }))
    }

    modPos(row: number, column: number, callback: (talent: Talent)=>void) {
        callback(this.getPos(row,column));
        return this.owner;
    }

    addGet(mod: string, id: string, row: number, column: number, ranks: number, parentSpell = 0) {
        let spellids: number[] = []
        for(let i=0;i<ranks;++i) {
            spellids.push(
                SpellRegistry.create(
                    mod,`${id}-spell-${i}`,parentSpell,true
                ).ID
            )
        }
        let talent = new Talent(
            DBC.Talent.add(Ids.Talent.id(mod,id))
                .TabID.set(this.owner.ID)
                .PrereqTalent.set([0,0,0])
                .PrereqRank.set([0,0,0])
                .CategoryMask.set([0,0])
                .SpellRank.set([0,0,0,0,0,0,0])
                .RequiredSpellID.set(0)
        )
        talent.Spells.add(spellids)
        talent.row
            .TierID.set(row)
            .ColumnIndex.set(column)
        return talent;
    }

    /**
     * @param parentSpell set to 0 for no parent
     * @returns
     */
    addMod(mod: string, id: string, row: number, column: number, ranks: number, parentSpell: number, callback: (talent: Talent)=>void) {
        callback(this.addGet(mod,id,row,column,ranks,parentSpell));
        return this.owner;
    }
}

export class TalentTree extends MainEntity<TalentTabRow> {
    get ID() { return this.row.ID.get(); }
    get Name() { return this.wrapLoc(this.row.Name); }
    get BackgroundImage() { return this.wrap(this.row.BackgroundFile); }
    get Icon() { return new SpellIconCell(this, this.row.SpellIconID); }
    get Talents() { return new TalentTreeTalents(this); }
    // racemasks don't seem to work clientside for now
    //get RaceMask() { return new RaceMask(this, this.row.RaceMask); }
    get ClassMask() { return new ClassMask(this, this.row.ClassMask); }
    get OrderIndex() { return this.wrap(this.row.OrderIndex); }
    get PetTalentMask() { return new MaskCell32(this, this.row.PetTalentMask)}

}

finish('verify-talent-trees',()=>{
    if(isReadOnly()) return;
    TalentTreeRegistry.forEach(x=>{
        if(x.ClassMask.get() === 0 && !x.PetTalentMask.get()) {
            throw new Error(`Talent Tab ${x.ID} has no classmask set, it will bug out talents for all classes`)
        }
    })
})