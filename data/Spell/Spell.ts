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
import { MaskCell, MaskLongCell } from "wotlkdata/cell/systems/Mask";
import { SpellRow } from "wotlkdata/dbc/types/Spell";
import { Ids } from "../Base/Ids";
import { IncludeExclude, IncludeExcludeMask } from "../Base/IncludeExclude";
import { MainEntity } from "../Base/MainEntity";
import { AuraInterruptFlags } from "./AuraInterruptFlags";
import { InterruptFlags } from "./InterruptFlags";
import { SpellAttributes } from "./SpellAttributes";
import { SpellCastTime } from "./SpellCastTime";
import { BaseClassSet } from "./SpellClassSet";
import { SpellDescriptionVariable } from "./SpellDescriptionVariable";
import { SpellDifficulty } from "./SpellDifficulty";
import { SpellDuration } from "./SpellDuration";
import { SpellEffects } from "./SpellEffect";
import { SpellIconCell } from "./SpellIcon";
import { SpellItemEquips } from "./SpellItemEquips";
import { SpellLevels } from "./SpellLevels";
import { SpellMissile } from "./SpellMissile";
import { SpellPower } from "./SpellPower";
import { SpellPowerDisplay } from "./SpellPowerDisplay";
import { SpellProc } from "./SpellProc";
import { SpellRange } from "./SpellRange";
import { SpellReagents } from "./SpellReagents";
import { SpellRecovery } from "./SpellRecovery";
import { SpellReputation } from "./SpellReputation";
import { SpellSkillLineAbilites } from "./SpellSkillLines";
import { SpellVisual } from "./SpellVisual";
import { SpellCreatureTarget } from "./TargetCreatureType";
import { SpellTargetType } from "./TargetType";

export class Spell extends MainEntity<SpellRow> {
    get Attributes() { return new SpellAttributes(this); }
    get Visual() { return new SpellVisual(this); }
    get Icon() { return new SpellIconCell(this, this.row.SpellIconID); }
    get ActiveIcon() { return new SpellIconCell(this, this.row.ActiveIconID); }
    get Name() { return this.wrapLoc(this.row.Name); }
    get Subtext() { return this.wrapLoc(this.row.NameSubtext); }
    get Description() { return this.wrapLoc(this.row.Description); }
    get AuraDescription() { return this.wrapLoc(this.row.AuraDescription); }
    get PowerDisplay() { return new SpellPowerDisplay(this, this.row.PowerDisplayID); }

    get ID() { return this.row.ID.get(); }

    get TargetType() { return new SpellTargetType(this); }
    get CreatureTargets() { return new SpellCreatureTarget(this); }

    get Totems() { return this.wrapArray(this.row.Totem); }
    get Reagents() { return new SpellReagents(this); }

    get RequiresSpellFocus() { return this.wrap(this.row.RequiresSpellFocus); }
    get FacingCasterFlags() { return new MaskCell(this, this.row.FacingCasterFlags); }
    
    get CasterAuraState() : IncludeExclude<number, this> { 
        return new IncludeExclude(this, 
            this.wrap(this.row.CasterAuraState),
            this.wrap(this.row.ExcludeCasterAuraState)
    )}

    get TargetAuraState() : IncludeExclude<number, this> { 
        return new IncludeExclude(this, 
            this.wrap(this.row.TargetAuraState),
            this.wrap(this.row.ExcludeTargetAuraState)
    )}

    get CasterAuraSpell() : IncludeExclude<number, this> { 
        return new IncludeExclude(this, 
        this.wrap(this.row.CasterAuraSpell),
        this.wrap(this.row.ExcludeCasterAuraSpell)
    )}

    get TargetAuraSpell() : IncludeExclude<number, this> { 
        return new IncludeExclude(this, 
        this.wrap(this.row.TargetAuraSpell),
        this.wrap(this.row.ExcludeTargetAuraSpell)
    )}

    get SkillLines() { return new SpellSkillLineAbilites(this); }
    /** How many stacks of this spell can be present on the target */
    get Stacks() { return this.wrap(this.row.CumulativeAura); }

    get ModalNextSpell() { return this.wrap(this.row.ModalNextSpell); }
    get Effects() { return new SpellEffects(this); }
    get Duration() { return new SpellDuration(this); }
    get Range() { return new SpellRange(this); }
    get Speed() { return this.wrap(this.row.Speed); }
    get ClassMask() { return new BaseClassSet(this); }
    get Power() { return new SpellPower(this); }
    get ItemEquips() { return new SpellItemEquips(this); }
    get Proc() { return new SpellProc(this); }
    get Priority() { return this.wrap(this.row.SpellPriority); }
    get Cooldown() { return new SpellRecovery(this); }
    get MaxTargetLevel() { return this.wrap(this.row.MaxTargetLevel); }
    get MaxTargets() { return this.wrap(this.row.MaxTargets); }
    get DefenseType() { return this.wrap(this.row.DefenseType); }
    get PreventionType() { return this.wrap(this.row.PreventionType); }
    get StanceBarOrder() { return this.wrap(this.row.StanceBarOrder); }
    get CastTime() { return new SpellCastTime(this); }
    get Category() { return this.wrap(this.row.Category); }

    /** Points to a TotemCategory */
    get RequiredTotems() { return this.wrapArray(this.row.RequiredTotemCategoryID); }
    get Faction() { return new SpellReputation(this); }
    get RequiredAuraVision() { return this.wrap(this.row.RequiredAuraVision); }

    /** Points to a WorldMapArea */
    get RequiredAreaID() { return this.wrap(this.row.RequiredAreasID); }
    get SchoolMask() { return new MaskCell(this, this.row.SchoolMask); }
    get MissileID() { return this.wrap(this.row.SpellMissileID); }
    get DifficultyID() { return this.wrap(this.row.SpellDifficultyID); }
    get DispelType() { return this.wrap(this.row.DispelType); }
    get Mechanic() { return this.wrap(this.row.Mechanic); }

    get Missile() { return new SpellMissile(this); }

    get ShapeshiftMask() { return new IncludeExcludeMask(this, 
        new MaskLongCell(this,this.row.ShapeshiftMask),
        new MaskLongCell(this,this.row.ShapeshiftMask),
    )}

    get Levels() { return new SpellLevels(this); }
    get SpellDescriptionVariable() { return new SpellDescriptionVariable(this); }
    get Difficulty() { return new SpellDifficulty(this); }
    get ChannelInterruptFlags() { return new MaskCell(this, this.row.ChannelInterruptFlags); }
    get AuraInterruptFlags() { return new AuraInterruptFlags(this); }
    get InterruptFlags() { return new InterruptFlags(this); }

    /**
     * Creates a separate clone of this spell
     * @param mod 
     * @param id 
     * @param keepVisualLink - Whether the new spell should keep sharing visual rows with its parent.
     */
    clone(mod: string, id: string, keepVisualLink: boolean = false) {
        const newId = Ids.Spell.id(mod, id);
        let spell = new Spell(this.row.clone(newId));
        if(!keepVisualLink) {
            spell.Visual.makeUnique();
        }
        spell.Duration.makeUnique();
        for(let i=0;i<spell.Effects.length; ++i) {
            spell.Effects.get(i).Radius.makeUnique();
        }
        return spell;
    }
}