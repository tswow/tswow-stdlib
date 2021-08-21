import { SkillLine } from "../SkillLines/SkillLine";
import { Spell } from "../Spell/Spell";
import { DBC } from "wotlkdata/dbc/DBCFiles";
import { std } from "../tswow-stdlib-data";
import { SQL } from "wotlkdata/sql/SQLFiles";
import { ProfessionTier, resolveProfessionTier, isTradeskillSpell } from "./ProfessionType";
import { ProfessionNameSystem } from "./ProfessionName";
import { ProfessionRecipe } from "./ProfessionRecipe";
import { LockType } from "../Locks/LockType";
import { GameObjectTemplates } from "../GameObject/GameObjects";

let BS_SPELLS = [
    2018,
    3100,
    3538,
    9785,
    29844,
    51300
]

export class Profession {
    skillLine: SkillLine;

    private _ApprenticeSpell: Spell|undefined;
    private _ApprenticeLearnSpell: Spell|undefined;
    private _LockType: LockType|undefined;

    private getSpells() {
        return DBC.SkillLineAbility.filter({SkillLine:this.skillLine.ID})
            .map(x=>std.Spells.load(x.Spell.get()))
    }

    private getSkillSpells() {
        return this.getSpells().filter(x=>isTradeskillSpell(x));
    }

    getSkillRank(index: number) {
        if(index<=0) {
            throw new Error(`Invalid skill rank argument: ${index}`);
        }
        if(index==1) {
            return this.ApprenticeSpell;
        }
        let rank = SQL.spell_ranks.find({first_spell_id:this.ApprenticeSpell.ID,rank:index});
        if(rank===undefined) {
            throw new Error(`Spell ${this.skillLine.Name.enGB} has no spell rank ${index}`);
        }
        let spl = std.Spells.load(rank.spell_id.get());
        if(spl===undefined) {
            throw new Error(`Spell ${this.skillLine.Name.enGB} has an invalid spell at rank ${index}`);
        }
        return spl;
    }

    setHasCrafting(value: boolean) {
        loop1:
        for(let i=1;i<this.GetHighestRank();++i) {
            let ef = this.getSkillRank(i);
            if(value) {
                ef.Attributes.isHiddenInSpellbook.clear();
                ef.Attributes.unk41.clear();
            } else {
                ef.Attributes.unk41.mark();
                ef.Attributes.isHiddenInSpellbook.mark();
            }

            for(let j=0;j<3;++j) {
                if(ef.Effects.isEffectType(j,47)) {
                    if(!value) {
                        ef.Effects.modify(j,e=>e.EffectType.set(0))
                        break;
                    } else {
                        continue loop1;
                    }
                }
            }
        }
        return this;
    }

    constructor(skillLine: SkillLine) {
        this.skillLine = skillLine;
        this.skillLine.CanLink.set(1);
    }

    addRecipe(mod: string, id: string) {
        return new ProfessionRecipe(
            this,std.Spells.create(mod,id,3492)
                .SkillLines.add(this.ID)
                )
            .SpellFocus.set(0)
            .Reagents.clearAll()
            .Totems.clearAll()
    }

    addGatheringNode(mod: string, name: string, lockType: LockType, levelNeeded: number) {
        let lock = std.Locks.createTypeInstance(lockType.ID,levelNeeded)
        return GameObjectTemplates.create(mod,name)
            .setChest()
            .IsConsumable.set(1)
            .Lock.setID(lock.ID)
    }

    addSkillsTo(modid: string, id: string, rank: ProfessionTier) {
        let rnk = resolveProfessionTier(rank);
        try {
            this.ApprenticeSpell;
        } catch(err) {
            this._ApprenticeSpell = std.Spells.create(modid,`${id}_spell_1`,BS_SPELLS[0])
                .Name.enGB.set(this.skillLine.Name.enGB.get())
                .Description.enGB.set(this.skillLine.Description.enGB.get())
                .Effects.modify(1,(eff)=>eff.MiscValueA.set(this.skillLine.ID))
                .Visual.set(0)
                .SkillLines.add(this.skillLine.ID,-1,(sla)=>{
                    sla.RaceMask.set(this.skillLine.RaceClassInfos.getIndex(0).RaceMask.get())
                       .ClassMaskForbidden.set(0)
                       .MinSkillRank.set(1)
                       .ClassMask.set(this.skillLine.RaceClassInfos.getIndex(0).ClassMask.get())
                })

            this._ApprenticeLearnSpell = std.Spells.create(modid,`${id}_learn_spell`,2020)
                .Name.enGB.set(this.skillLine.Name.enGB.get())
                .Description.enGB.set(this.skillLine.Description.enGB.get())
                .Effects.modify(0,(eff)=>eff.TriggerSpell.set((this._ApprenticeSpell as Spell).ID))
                .Effects.modify(1,(eff)=>eff.MiscValueA.set(this.skillLine.ID))

            SQL.spell_ranks.add((this._ApprenticeSpell as Spell).ID,1,
                {spell_id: (this._ApprenticeSpell as Spell).ID})
        }

        for(let i=2;i<rnk;++i) {
            try { this.getSkillRank(i);}
            catch(err) {
                let spl = std.Spells.create(modid,`${id}_spell_${i}`,BS_SPELLS[i-1])
                    .Name.enGB.set(this.skillLine.Name.enGB.get())
                    .Effects.modify(1,e=>e.MiscValueA.set(this.skillLine.ID))
                    .Visual.set(0)
                    .SkillLines.add(this.skillLine.ID,-1,(sla)=>{
                        sla
                            .RaceMask.set(this.skillLine.RaceClassInfos.getIndex(0).RaceMask.get())
                            .ClassMaskForbidden.set(0)
                            .MinSkillRank.set(1)
                            .ClassMask.set(this.skillLine.RaceClassInfos.getIndex(0).ClassMask.get())
                    })
                SQL.spell_ranks.add(this.ApprenticeSpell.ID,i,{spell_id:spl.ID})
            }
        }

        for(let i=1;i<rnk-1;++i) {
            this.getSkillRank(i)
                .SkillLines.getIndex(0)
                .SupercededBySpell.set(this.getSkillRank(i+1).ID)
        }

        return this;
    }

    AddGatheringSpell(mod: string, id: string, lockType: number, speed: number = 0, maxRange: number = 5, totem: number = 0) {
        let spli = std.Spells.create(mod,id)
            .Attributes.isHiddenFromLog.mark()
            .Attributes.isHiddenFromLog.mark()
            .Attributes.unk41.mark()
            .Range.cloneModify((range)=>{
                range.set(0,maxRange,0,maxRange)
            })
        let spl = std.Spells.create(mod,id)
            .Attributes.isHiddenInSpellbook.mark()
            .Attributes.isHiddenFromLog.mark()
            .Attributes.unk41.mark()
            .Range.cloneModify((x)=>x.set(0,maxRange,0,maxRange))
            .SkillLines.add(this.ID)
            .CastTime.cloneModify((x)=>x.set(speed,0,speed))
            .RequiredTotems.setIndex(0,totem)
            .Effects.add((eff)=>{
                eff.EffectType.setOpenLock()
                .TargetA.setGameobjectTarget()
                .LockType.set(lockType)
                .AsRawEffect()
                .BasePoints.set(-1)
                .PointsPerLevel.set(5)
                .Radius.cloneModify(x=>x.set(2,0,2))
                .ChainAmplitude.set(1)
            })
            .Effects.add((eff)=>{
                eff.EffectType.setSkill()
                .AsRawEffect()
                .MiscValueA.set(this.ID)
                .DieSides.set(1)
                .ChainAmplitude.set(1)
                .BonusMultiplier.set(1)
            })
            .SchoolMask.mark(0)
            .InterruptFlags.OnMovement.mark()
            .InterruptFlags.OnPushback.mark()
            .InterruptFlags.OnInterruptCast.mark()
            .InterruptFlags.mark(3)
            .InterruptFlags.mark(4)
        this.ApprenticeLearnSpell.Effects.addLearnSpells(spl.ID)
        return spl;
    }

    GetHighestRank() {
        for(let i=1;i<=6;++i) {
            try { this.getSkillRank(i); }
            catch(err) { return i-1; }
        }
        return 6;
    }

    SetCastTime(base: number, perLevel: number = 0, minimum: number = base) {
        for(let i=1;i<this.GetHighestRank();++i) {
            this.getSkillRank(i).CastTime.cloneModify(x=>x.set(base,perLevel,minimum));
        }
        return this;
    }

    get Name() { return new ProfessionNameSystem(this); }

    get ApprenticeLearnSpell(): Spell {
        if(this._ApprenticeLearnSpell !== undefined) {
            return this._ApprenticeLearnSpell;
        }
        this._ApprenticeLearnSpell = std.Spells.filter({EffectTriggerSpell:this.ApprenticeSpell.ID})[0];

        if(this._ApprenticeLearnSpell === undefined) {
            throw new Error(`Profession ${this.skillLine.Name.enGB.get()} has no Apprentice learn spell`)
        }
        return this._ApprenticeLearnSpell;
    }

    get ApprenticeSpell(): Spell {
        if(this._ApprenticeSpell!==undefined) return this._ApprenticeSpell;
        let spell = this.getSkillSpells().find(x=>isTradeskillSpell(x));
        if(spell===undefined) {
            // No apprentice spell!
            throw Error(`Profession ${this.skillLine.Name.enGB.get()} has no TradeSkill spells!`);
        }
        let spellRank = SQL.spell_ranks.find({spell_id:spell.ID});

        if(!spellRank) {
            throw new Error(`Profession ${this.skillLine.Name.enGB.get()} has no valid spell ranks for profession spells!`);
        }
        let firstSpell = std.Spells.load(spellRank.first_spell_id.get());

        if(!firstSpell) {
            throw new Error(`Profession ${this.skillLine.Name.enGB.get()} has an invalid first spell rank in spell_ranks`);
        }
        return firstSpell;
    }

    get ID() {
        return this.skillLine.ID;
    }

    get JourneymanSpell(): Spell {
        return this.getSkillRank(2);
    }

    get ExpertSpell(): Spell {
        return this.getSkillRank(3);
    }

    get ArtisanSpell(): Spell {
        return this.getSkillRank(4);
    }

    get MasterSpell(): Spell {
        return this.getSkillRank(5);
    }

    get GrandMasterSpell(): Spell {
        return this.getSkillRank(6);
    }
}