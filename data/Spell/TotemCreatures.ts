import { DBC } from "wotlkdata";
import { loc_constructor } from "wotlkdata/primitives";
import { Ids } from "../Base/Ids";
import { Spell } from "./Spell";
import { Spells } from "./Spells"

const created = [0,0,0,0];

export type CreatureControlType =
    'Attack'|'Stay'|'Follow'|'Aggressive'|'Passive'|'Defensive'

const ControllerValues : CreatureControlType[] = 
    ['Attack','Stay','Follow','Aggressive','Passive','Defensive']

export class CreatureControllers {
    Attack?: Spell;
    Follow?: Spell;
    Stay?: Spell;

    Aggressive?: Spell;
    Defensive?: Spell;
    Passive?: Spell;

    forEach(callback: (spell: Spell, type: CreatureControlType) => any) {
        if(this.Attack) callback(this.Attack,'Attack');
        if(this.Follow) callback(this.Follow,'Follow');
        if(this.Stay) callback(this.Stay,'Stay');
        if(this.Aggressive) callback(this.Aggressive,'Aggressive');
        if(this.Defensive) callback(this.Defensive,'Defensive');
        if(this.Passive) callback(this.Passive,'Passive');
    }
}

export const TotemCreatures = {
    createSummon(mod: string, id: string, totemCategory: number, creature: number){
        const cat = DBC.TotemCategory.findById(totemCategory);
        let slot = 0;
        const mask = cat.TotemCategoryMask.get();
        switch(mask) {
            case 1:
                slot = 0;
                break;
            case 2:
                slot = 1;
                break;
            case 4:
                slot = 2;
                break;
            case 8:
                slot= 3;
                break;
            default:
                throw new Error(`Using non-totem TotemCategory. TotemCategoryMask was ${mask}, must be any of {1,2,4,8}`)
        }

        if(!created[slot]) {
            created[slot] = Ids.SummonProperties.id();
            DBC.SummonProperties.add(created[slot])
                .Control.set(1)
                .Faction.set(0)
                .Title.set(4)
                .Slot.set(2+slot)
                .Flags.set(512)
        }

        const spell = Spells.create(mod, id, 2484)
            .Effects.get(0)
                .MiscValueA.set(creature)
                .MiscValueB.set(created[slot])
                .up()
            .TotemCategories.setIndex(0,totemCategory)
        return spell;
    },

    createControllers(mod: string, id: string, slots: number[], 
        controllers: CreatureControlType[] = ControllerValues) {
            let bitmask = 0;
            slots.forEach((x)=>{
                bitmask |= (1<<(x+2))
            });

            const controlOut = new CreatureControllers();

            for(const controller of controllers) {
                const spell = Spells.create(mod, id+'_'+controller.toLowerCase())
                    .Effects.add()
                    .EffectType.setControlTotemCreature()
                    .MiscValueA.set(bitmask).up()

                switch(controller) {
                    case 'Aggressive':
                        controlOut.Aggressive = 
                            spell.Effects.get(0).MiscValueB.set(2).up()
                            .Icon.set('Interface\\Icons\\Ability_Racial_BloodRage.blp')
                        break
                    case 'Attack':
                        controlOut.Attack = 
                            spell.Effects.get(0).MiscValueB.set(5).up()
                            .Icon.set('Interface\\Icons\\Ability_GhoulFrenzy.blp')
                        break
                    case 'Defensive':
                        controlOut.Defensive = 
                            spell.Effects.get(0).MiscValueB.set(1).up()
                            .Icon.set('Interface\\Icons\\Ability_Defend.blp')
                        break
                    case 'Follow':
                        controlOut.Follow = 
                            spell.Effects.get(0).MiscValueB.set(4).up()
                            .Icon.set('Interface\\Icons\\Ability_Tracking.blp')
                        break
                    case 'Passive':
                        controlOut.Passive = 
                            spell.Effects.get(0).MiscValueB.set(0).up()
                            .Icon.set('Interface\\Icons\\AbilitySeal.blp')
                        break
                    case 'Stay':
                        controlOut.Stay = 
                            spell.Effects.get(0).MiscValueB.set(3).up()
                            .Icon.set('Interface\\Icons\\Spell_Nature_TimeStop.blp')
                        break
                }
            }
            return controlOut;
    },
}