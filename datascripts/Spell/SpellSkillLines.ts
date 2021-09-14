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
import { DBC } from "wotlkdata";
import { CellSystem } from "wotlkdata/cell/systems/CellSystem";
import { MultiRowSystem } from "wotlkdata/cell/systems/MultiRowSystem";
import { SkillLineAbilityRow } from "wotlkdata/dbc/types/SkillLineAbility";
import { SQL } from "wotlkdata/sql/SQLFiles";
import { MainEntity } from "../Misc/Entity";
import { Ids } from "../Misc/Ids";
import { Spell } from "./Spell";

export class TrivialSkillLineRank extends CellSystem<SpellSkillLineAbility> {
    get High() { return this.ownerWrap(this.owner.row.TrivialSkillLineRankHigh); }
    get Low() { return this.ownerWrap(this.owner.row.TrivialSkillLineRankLow); }
    set(low: number, high: number) {
        this.Low.set(low);
        this.High.set(high);
        return this.owner;
    }
}

export class SpellSkillLineAbility extends MainEntity<SkillLineAbilityRow> {
    get RaceMask() { return this.wrap(this.row.RaceMask); }
    get ClassMask() { return this.wrap(this.row.ClassMask); }
    get ClassMaskForbidden() { return this.wrap(this.row.ClassMaskForbidden); }
    get MinSkillRank() { return this.wrap(this.row.MinSkillLineRank); }

    /** The spell this spell is superceded by */
    get SupercededBy() { return this.wrap(this.row.SupercededBySpell); }
    get AcquireMethod() { return this.wrap(this.row.AcquireMethod); }
    get TrivialRank() { return new TrivialSkillLineRank(this); }
    get SkillLine() { return this.wrap(this.row.SkillLine); }
    get CharacterPoints() { return this.wrapArray(this.row.CharacterPoints); }

    get Spell() { return this.row.Spell.get(); }

    setAutolearn() {
        this.AcquireMethod.set(1);
        SQL.playercreateinfo_spell_custom
            .add(this.RaceMask.get(), this.ClassMask.get(), this.Spell)
            .Note.set('TSWoW')
        return this;
    }
}

export class SpellSkillLineAbilites extends MultiRowSystem<SpellSkillLineAbility,Spell> {
    static getAllRows(slas: SpellSkillLineAbilites) {
        return slas.getAllRows();
    }

    protected getAllRows(): SpellSkillLineAbility[] {
        return DBC.SkillLineAbility
            .filter({Spell: this.owner.ID})
            .map(x=>new SpellSkillLineAbility(x));
    }

    protected isDeleted(value: SpellSkillLineAbility): boolean {
        return value.row.isDeleted()
    }

    constructor(owner: Spell) {
        super(owner);
    }

    addMod(
        skillLine: number
      , autolearn: boolean = false
      , callback: (sla: SpellSkillLineAbility)=>void = ()=>{}
      )
      {
        callback(this.addGet(skillLine,autolearn));
        return this.owner;
      }

    addGet(
          skillLine: number
        , autolearn: boolean = false
        ) {
        const rci = DBC.SkillRaceClassInfo.find({SkillID: skillLine});
        let racemask = rci.RaceMask.get();
        let classmask = rci.ClassMask.get();
        if(racemask===4294967295) {
            racemask = 0;
        }

        if(classmask===4294967295) {
            classmask = 0;
        }

        let row = DBC.SkillLineAbility.add(Ids.SkillLineAbility.id())

        let sla = new SpellSkillLineAbility(row
            .SkillLine.set(skillLine)
            .ClassMask.set(classmask)
            .RaceMask.set(racemask)
            .Spell.set(this.owner.ID));
        if(autolearn) {
            sla.setAutolearn();
        }
        return sla;
    }
}