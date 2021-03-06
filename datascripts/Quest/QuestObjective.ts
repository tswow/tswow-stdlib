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
import { SQL } from "wotlkdata";
import { Cell } from "wotlkdata/cell/cells/Cell";
import { DummyCell } from "wotlkdata/cell/cells/DummyCell";
import { PendingCell } from "wotlkdata/cell/cells/PendingCell";
import { ArrayEntry, ArraySystem } from "wotlkdata/cell/systems/ArraySystem";
import { CellSystem } from "wotlkdata/cell/systems/CellSystem";
import { LocSystem } from "wotlkdata/cell/systems/CellSystem";
import { Language } from "wotlkdata/dbc/Localization";
import { iterLocConstructor, loc_constructor } from "wotlkdata/primitives";
import { Quest } from "./Quest";
import { addonRow } from "./QuestAddonRow";

function ItemIds(owner: Quest) {
    return [
        owner.row.RequiredItemId1,
        owner.row.RequiredItemId2,
        owner.row.RequiredItemId3,
        owner.row.RequiredItemId4,
        owner.row.RequiredItemId5,
        owner.row.RequiredItemId6,
    ]
}

function RequiredItemCounts(owner: Quest) {
    return [
        owner.row.RequiredItemCount1,
        owner.row.RequiredItemCount2,
        owner.row.RequiredItemCount3,
        owner.row.RequiredItemCount4,
        owner.row.RequiredItemCount5,
        owner.row.RequiredItemCount6,
    ]
}

export class ItemObjective extends ArrayEntry<Quest> {
    get ItemID() { return ItemIds(this.owner)[this.index]}
    get Count() { return RequiredItemCounts(this.owner)[this.index]; }

    clear(): Quest {
        this.ItemID.set(0);
        this.Count.set(0);
        return this.owner;
    }
    isClear(): boolean {
        return this.ItemID.get() === 0;
    }
}

export class ItemObjectives extends ArraySystem<ItemObjective, Quest> {
    get length(): number {
        return 6;
    }

    get(index: number): ItemObjective {
        return new ItemObjective(this.owner, index);
    }

    add(item: number, count: number) {
        let free = this.getFree();
        free.ItemID.set(item);
        free.Count.set(count);
        return this.owner;
    }
}

function NPCGOIds(owner: Quest) {
    return [
        owner.row.RequiredNpcOrGo1,
        owner.row.RequiredNpcOrGo2,
        owner.row.RequiredNpcOrGo3,
        owner.row.RequiredNpcOrGo4,
    ]
}

function NPCGOCounts(owner: Quest) {
    return [
        owner.row.RequiredNpcOrGoCount1,
        owner.row.RequiredNpcOrGoCount2,
        owner.row.RequiredNpcOrGoCount3,
        owner.row.RequiredNpcOrGoCount4,
    ]
}

export class NpcGoObjective extends ArrayEntry<Quest> {
    get ID() { return NPCGOIds(this.owner)[this.index]}
    get Count() { return NPCGOCounts(this.owner)[this.index]}
    clear(): Quest {
        this.ID.set(0);
        this.Count.set(0);
        return this.owner
    }
    isClear(): boolean {
        return this.ID.get() === 0;
    }
}

export class NpcGoObjectives extends ArraySystem<NpcGoObjective,Quest> {
    get length(): number {
        return 4;
    }

    get(index: number): NpcGoObjective {
        return new NpcGoObjective(this.owner, index);
    }

    // TODO: Split npc/go?
    add(id: number, count: number) {
        const free = this.getFree();
        free.ID.set(id);
        free.Count.set(count);
        return this.owner;
    }
}

function FactionIds(owner: Quest) {
    return [
        owner.row.RequiredFactionId1,
        owner.row.RequiredFactionId2,
    ]
}

function Reputation(owner: Quest) {
    return [
        owner.row.RequiredFactionValue1,
        owner.row.RequiredFactionValue2,
    ]
}

export class ReputationObjective extends ArrayEntry<Quest> {
    get Faction() { return FactionIds(this.owner)[this.index]; }
    get Reputation() { return Reputation(this.owner)[this.index]; }

    clear(): Quest {
        this.Faction.set(0);
        this.Reputation.set(0);
        return this.owner;
    }

    isClear(): boolean {
        return this.Faction.get() === 0;
    }
}

export class ReputationObjectives extends ArraySystem<ReputationObjective,Quest> {
    get length(): number {
        return 2;
    }

    get(index: number): ReputationObjective {
        return new ReputationObjective(this.owner, index);
    }
}

export class Scripted extends LocSystem<Quest> {
    protected localeRow(language: Language) {
        let oldRow = SQL.quest_template_locale.find({ID: this.owner.ID, locale: language});
        if(oldRow) return oldRow;
        return SQL.quest_template_locale.add(this.owner.ID,language);
    }

    lang(lang: Language): Cell<string, Quest> & PendingCell {
        if(lang === 'enGB') {
            return this.ownerWrapExists(this.owner.row.AreaDescription);
        } else {
            return this.ownerWrapExists(this.localeRow(lang).Objectives);
        }
    }
    get mask(): Cell<number, Quest> {
        return new DummyCell(this.owner, 0);
    }

    constructor(owner: Quest) {
        super(owner);
        addonRow(this.owner.ID).SpecialFlags.set(2);
    }

    clear() {
        this.owner.row.AreaDescription.set("");
        addonRow(this.owner.ID).SpecialFlags.set(0);
        return this.owner;
    }

    set(con: loc_constructor): Quest {
        iterLocConstructor(con, (lang, value) => {
            if(lang === 'enGB') {
                this.owner.row.AreaDescription.set(value);
            } else {
                this.localeRow(lang).Objectives.set(value);
            }
        });
        return this.owner;
    }
}

export class QuestObjective extends CellSystem<Quest> {
    constructor(quest : Quest) {
        super(quest);
    }

    get Scripted() { return new Scripted(this.owner); }
    get PlayerKills() { return this.ownerWrap(this.owner.row.RequiredPlayerKills); }
    get Entity() { return new NpcGoObjectives(this.owner); }
    get Reputation() { return new ReputationObjectives(this.owner); }
    get Item() { return new ItemObjectives(this.owner); }
}