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
import { SQL } from "wotlkdata";
import { Cell } from "wotlkdata/wotlkdata/cell/cells/Cell";
import { EnumCon, makeEnumCell } from "wotlkdata/wotlkdata/cell/cells/EnumCell";
import { CellSystem } from "wotlkdata/wotlkdata/cell/systems/CellSystem";
import { Language } from "wotlkdata/wotlkdata/dbc/Localization";
import { loc_constructor } from "wotlkdata/wotlkdata/primitives";
import { creature_textRow } from "wotlkdata/wotlkdata/sql/types/creature_text";
import { CreatureTemplateRegistry } from "../Creature/Creatures";
import { CreatureTemplate } from "../Creature/CreatureTemplate";
import { LanguageRegistry } from "../Languages/Languages";
import { MainEntity } from "../Misc/Entity";
import { PercentCell } from "../Misc/PercentCell";
import { SQLLocSystem } from "../Misc/SQLLocSystem";
import { BroadcastTextRegistry } from "./BroadcastText";

export class CreatureTextLoc extends SQLLocSystem<CreatureText> {
    protected getMain(): Cell<string, any> {
        return this.owner.row.Text
    }
    protected getLoc(loc: Language): Cell<string, any> {
        return SQL.creature_text_locale.find({
              CreatureID:this.owner.CreatureTemplate.get()
            , GroupID:this.owner.Group
            , ID: this.owner.Index
            , Locale: loc
        }).Text;
    }
}

export enum CreatureTextType {
    SAY          = 12,
    YELL         = 14,
    EMOTE        = 16,
    BOSS_EMOTE   = 41,
    WHISPER      = 15,
    BOSS_WHISPER = 42,
}

export class CreatureText extends MainEntity<creature_textRow> {
    get CreatureTemplate() {
        return CreatureTemplateRegistry
            .readOnlyRef(this, this.row.CreatureID)
    }

    get Type() { return makeEnumCell(CreatureTextType, this, this.row.Type); }

    get Group() {
        return this.row.GroupID.get()
    }
    get Index() {
        return this.row.ID.get();
    }
    get Probability() {
        return new PercentCell(this, '[0-100]', false, this.row.Probability)
    }
    get Language() { return LanguageRegistry.ref(this, this.row.Language); }
    get BroadcastText() {
        return BroadcastTextRegistry.ref(this, this.row.BroadcastTextId)
    }
    get Text() { return new CreatureTextLoc(this); }
}

export class CreatureTextGroup {
    private texts: CreatureText[] = []
    private creature: number;
    private group: number;

    constructor(template: number, group: number, texts: CreatureText[]) {
        this.creature = template;
        this.group = group;
        this.texts = texts;
    }

    get Group() { return this.group; }

    addGet() {
        const text = new CreatureText(SQL.creature_text
            .add(this.creature,this.group,this.texts.length)
            .Language.set(0)
            .Probability.set(100)
            .Sound.set(0)
            .Text.set('')
            .TextRange.set(0)
            .Type.set(0))
            .BroadcastText.set(0)
        this.texts.push(text);
        return text;
    }

    add(
          text: loc_constructor
        , type: EnumCon<keyof typeof CreatureTextType>
        , probability: number = 100
        , language: number = 0
    ) {
        this.addGet()
            .Text.set(text)
            .Type.set(type)
            .Probability.set(probability)
            .Language.set(language)
        return this;
    }

    addMod(callback: (text: CreatureText)=>void) {
        callback(this.addGet());
        return this
    }

    objectify() {
        return this.texts.map(x=>x.objectify())
    }
}

export class CreatureTexts {
    private creature: number;
    private groups: CreatureTextGroup[] = []

    constructor(creature: number, groups: CreatureTextGroup[]) {
        this.creature = creature;
        this.groups = groups;
    }

    get(index: number) {
        return this.groups[index];
    }

    get length() {
        return this.groups.length;
    }

    addGet() {
        let groupid = this.groups.length
        let group = new CreatureTextGroup(this.creature,groupid,[]);
        this.groups.push(group);
        return group;
    }

    addMod(callback: (group: CreatureTextGroup)=>void) {
        callback(this.addGet());
        return this;
    }

    mod(index: number, callback: (group: CreatureTextGroup)=>void) {
        callback(this.get(index));
        return this;
    }

    objectify() {
        return this.groups.map(x=>x.objectify())
    }
}

export class CreatureTextsAttached extends CellSystem<CreatureTemplate> {
    private texts: CreatureTexts;
    constructor(owner: CreatureTemplate) {
        super(owner);
        this.texts = CreatureTextRegistry.load(owner.ID)
    }

    get(index: number) {
        return this.texts.get(index);
    }

    mod(index: number, callback: (group: CreatureTextGroup)=>void) {
        this.texts.mod(index,callback);
        return this.owner;
    }

    get length() {
        return this.texts.length;
    }

    addGet() {
        return this.texts.addGet()
    }

    addMod(callback: (group: CreatureTextGroup)=>void) {
        this.texts.addMod(callback);
        return this.owner;
    }

    objectify() {
        return this.texts.objectify()
    }
}

const cachedGroups: {[creature: number]: CreatureTexts} = {}

export class CreatureTextRegistryClass {
    load(creature: number) {
        let group = cachedGroups[creature];
        if(group !== undefined) return group;
        const split = SQL.creature_text
            .filter({CreatureID:creature})
            .reduce<{[c: number]: creature_textRow[]}>((p,c)=>{
                (p[c.GroupID.get()]||(p[c.GroupID.get()] = [])).push(c)
                return p;
            },{})
        const groups = Object
            .entries(split)
            .map(([key,value])=>{
                return new CreatureTextGroup(
                        creature
                    , parseInt(key)
                    , value.map(x=>new CreatureText(x))
                        .sort((a,b)=>a.Index>b.Index?1:-1)
                )
            })
            .sort((a,b)=>a.Group > b.Group ? 1 : -1)
        return cachedGroups[creature] = new CreatureTexts(creature,groups);
    }
}

export const CreatureTextRegistry = new CreatureTextRegistryClass();