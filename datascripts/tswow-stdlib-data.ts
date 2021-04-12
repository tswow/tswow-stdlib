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
import { Achievements } from "./Achievement/Achievement";
import { Classes } from "./Class/Class";
import { CreatureInstances, CreatureTemplates } from "./Creature/Creatures";
import { Items } from "./Item/ItemTemplate";
import { Languages } from "./Languages/Languages";
import { Loot } from "./Loot/Loot";
import { Quests } from "./Quest/Quests";
import { SkillLines } from "./SkillLines/SkillLines";
import { ClassSkills } from "./Skills/ClassSkill";
import { Spells } from "./Spell/Spells";
import { TalentTrees } from "./Talents/Talents";
import { Titles } from "./Title/Titles";
import { UI } from "./UI/UI";
import { finish } from "wotlkdata";
import { iterateIds } from "wotlkdata/ids/Ids";
import * as fs from 'fs';
import * as path from 'path';
import { Factions } from "./Faction/Faction";
import { SmartScripts } from "./SmartScript/SmartScript";
import { Gossips } from "./Gossip/Gossips";
import { Lights } from "./Light/Lights";
import { ScriptPaths } from "./Waypoints/ScriptPaths";
import { Areas } from "./Area/Areas";
import { Maps } from "./Map/Maps";
import { LoadingScreens } from "./Map/LoadingScreen";
import { GameObjectDisplays, GameObjectInstances, GameObjectTemplates } from "./GameObject/GameObjects";
import { TSImages } from "./Images/Image";
import { Professions } from "./Profession/Professions";
import { Locks } from "./Locks/Locks";

export const std = {
    Spells : Spells,
    Languages : Languages,
    Quests : Quests,
    Titles: Titles,
    Achievements: Achievements,
    Loot: Loot,
    Items: Items,
    Creatures: CreatureInstances,
    Classes: Classes,
    UI: UI,
    ClassSkills: ClassSkills,
    SkillLines: SkillLines,
    /** Templates used by one or multiple creature instances */
    CreatureTemplates: CreatureTemplates,
    /** Individual creatures placed in the world */
    CreatureInstances: CreatureInstances,
    TalentTrees: TalentTrees,
    Factions: Factions,
    Scripts: SmartScripts,
    Gossip: Gossips,
    Lights: Lights,
    ScriptPaths: ScriptPaths,
    Areas: Areas,
    Maps: Maps,
    LoadingScreens: LoadingScreens,
    /** Templates used by one or multiple game object instances */
    GameObjectTemplates: GameObjectTemplates,
    /** Individual Game Objects placed in the world */
    GameObjectInstances: GameObjectInstances,
    /** Model, sound and bounding box data for GameObjects */
    GameObjectDisplays: GameObjectDisplays,
    /** Allows manipulating images programmatically */
    Image: TSImages,
    Professions: Professions,
    Locks: Locks
}

// Patch ID files
finish('build-idfiles',()=>{
    let modulemap : {[key:string]: string}= {};
    
    iterateIds((r)=>{
        if(!modulemap[r.mod]) {
            modulemap[r.mod] = `export namespace ID {\n`;
        }
        const uMod = r.mod.toUpperCase().split('-').join('_').split(' ').join('_');
        const uName = r.name.toUpperCase().split('-').join('_').split(' ').join('_');
        if(r.size==1) {
            modulemap[r.mod]+= `    export const ${uMod}_${uName} : uint32 = GetID("${r.table}","${r.mod}","${r.name}");\n`
        } else {
            modulemap[r.mod]+= `    export const ${uMod}_${uName} : IDRange = GetIDRange("${r.table}", "${r.mod}", "${r.name}");\n`
        }
    });

    for(const mod in modulemap) {
        modulemap[mod]+=`};`;
        const scriptDir = path.join('./modules',mod,'scripts');
        if(fs.existsSync(scriptDir)) {
            fs.writeFileSync(path.join(scriptDir,'ID.ts'), modulemap[mod]);
        }
    }
});