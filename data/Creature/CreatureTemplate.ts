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
import { Language } from "wotlkdata/dbc/Localization";
import { SQL } from "wotlkdata/sql/SQLFiles";
import { creature_templateRow } from "wotlkdata/sql/types/creature_template";
import { MainEntity } from "../Base/MainEntity";
import { SQLLoc } from "../Base/SQLLocSystem";
import { Position } from "../Misc/Position";
import { AttachedScript } from "../SmartScript/AttachedScript";
import { SmartScripts } from "../SmartScript/SmartScript";
import { CreatureAI } from "./CreatureAI";
import { CreatureAttackTime } from "./CreatureAttackTime";
import { CreatureDamageSchool } from "./CreatureDamageSchool";
import { CreatureFamily } from "./CreatureFamily";
import { CreatureGold } from "./CreatureGold";
import { CreatureIconNames } from "./CreatureIconNames";
import { CreatureLevel } from "./CreatureLevel";
import { CreatureLoot } from "./CreatureLoot";
import { MechanicImmunity } from "./CreatureMechanicImmunity";
import { CreatureModels } from "./CreatureModels";
import { CreatureMovementSpeed } from "./CreatureMovementSpeed";
import { CreatureMovementType } from "./CreatureMovementType";
import { CreatureRank } from "./CreatureRank";
import { CreatureInstances } from "./Creatures";
import { CreatureStats } from "./CreatureStats";
import { CreatureType } from "./CreatureType";
import { CreatureTypeFlags } from "./CreatureTypeFlags";
import { DynFlags } from "./DynFlags";
import { NPCFlags } from "./NPCFlags";
import { Trainer } from "./Trainer";
import { UnitClass } from "./UnitClass";
import { Vendor } from "./Vendor";

function creatureLoc(id: number, lang: Language) {
    const old = SQL.creature_template_locale.find({entry:id, locale:lang});
    if(old) {
        return old;
    }
    return SQL.creature_template_locale.add(id, lang);
}

export class CreatureTemplate extends MainEntity<creature_templateRow> {
    get ID() { return this.row.entry.get(); }
    get Name() { return new SQLLoc(this,
        ()=>this.row.name,
        (lang)=>creatureLoc(this.ID,lang).Name) 
    }
    get Title() { return new SQLLoc(this,()=>this.row.subname,
        (lang)=>creatureLoc(this.ID,lang).Title
    )}

    get Scripts() { 
        return new AttachedScript(()=>{
            this.row.AIName.set('SmartAI');
            return SmartScripts.creature(this.ID, this);
        })
    }
    
    /**
     * What expansion the creatures health is taken from, values are from 0-2
     */
    get HealthExpansion() { return this.wrap(this.row.exp); }

    /** 
     * ID of the Faction template this creature belongs to
     */
    get FactionTemplate() { return this.wrap(this.row.faction); }

    /** 
     * - 0 = does not regenerate health
     * - 1 = regenerates health 
     */
    get RegenHealth() { return this.wrap(this.row.RegenHealth); }
    
    get NPCFlags() { return new NPCFlags(this, this.row.npcflag); }
    get Type() { return new CreatureType(this); }
    get TypeFlags() { return new CreatureTypeFlags(this, this.row.type_flags); }
    get DynFlags() { return new DynFlags(this, this.row.dynamicflags); }
    get FlagsExtra() { return this.wrap(this.row.flags_extra); }
    get UnitClass() { return new UnitClass(this); }
    get DynamicFlags() { return this.wrap(this.row.dynamicflags); }
    get DungeonHeroicID() { return this.wrap(this.row.difficulty_entry_1); }
    get RaidNormal25ID() { return this.wrap(this.row.difficulty_entry_1); }
    get RaidHeroic10ID() { return this.wrap(this.row.difficulty_entry_2); }
    get RaidHeroic25ID() { return this.wrap(this.row.difficulty_entry_3); }
    get Models() { return new CreatureModels(this); }
    get Icon() { return new CreatureIconNames(this); }
    get GossipID() { return this.wrap(this.row.gossip_menu_id); }
    get Level() { return new CreatureLevel(this);}
    get MovementSpeed() { return new CreatureMovementSpeed(this); }
    get Scale() { return this.wrap(this.row.scale); }
    get Rank() { return new CreatureRank(this); }
    get DamageSchool() { return new CreatureDamageSchool(this); }
    get AttackTime() { return new CreatureAttackTime(this); }
    get Family() { return new CreatureFamily(this); }
    get Loot() { return new CreatureLoot(this); }
    get PetSpells() { return this.wrap(this.row.PetSpellDataId); }
    get VehicleID() { return this.wrap(this.row.VehicleId); }
    get Gold() { return new CreatureGold(this); }
    get AIName() { return new CreatureAI(this); }
    get MovementType() { return new CreatureMovementType(this); }
    get HoverHeight() { return this.wrap(this.row.HoverHeight); }
    get Stats() { return new CreatureStats(this); }
    get RacialLeader() { return this.wrap(this.row.RacialLeader); }
    get MovementID() { return this.wrap(this.row.movementId); }
    get MechanicImmunity() { return new MechanicImmunity(this, this.row.mechanic_immune_mask); }
    get SpellSchoolImmunity() { return this.wrap(this.row.spell_school_immune_mask); }
    get Trainer() { return new Trainer(this); }
    get Vendor() { return new Vendor(this); }

    spawn(mod: string, id: string, pos: Position) {
        CreatureInstances.create(mod, id, this.ID, pos);
        return this;
    }
}