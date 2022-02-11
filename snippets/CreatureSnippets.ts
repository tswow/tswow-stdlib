import { std } from "../datascripts/datascripts";

/**
 * Snippet: Creature::Aggressive Mob
 * - Basic aggressive mob
 */
std.CreatureTemplates.create(/*@1*/'mod'/**/,/*@2*/'id'/**/)
    .Name.enGB.set('Aggressive Mob')
    .FactionTemplate.NEUTRAL_HOSTILE.set()
    .Models.addIds(29419)
    .MovementType.RANDOM_MOVEMENT.set()

    // Stats
    .Stats.ArmorMod.set(1)
    .Stats.DamageMod.set(1)
    .Stats.ExperienceMod.set(1)
    .Stats.HealthMod.set(1)
    .Stats.ManaMod.set(1)
    .UnitClass.WARRIOR.set()
    .Level.set(1,1)

    // Loot
    .Gold.set(1,100)
    .NormalLoot.modRefCopy((loot)=>{
        loot.addItem(25,10,1,1)
            .addItem(100,10,1,1)
    })
/** end-snippet */

/**
 * Snippet: Creature::Vendor
 * - Basic vendor npc
 */
std.CreatureTemplates.create(/*@1*/'mod'/**/,/*@2*/'id'/**/)
    .Name.enGB.set('Vendor NPC')
    .Subname.enGB.set('Vendor')
    .Models.addIds(29419)
    .FactionTemplate.NEUTRAL_PASSIVE.set()

    .NPCFlags.REPAIRER.set(true)
    .Vendor.add(25)
    // add items here
/** end-snippet */

/**
 * Snippet: Creature::Innkeeper
 * - Basic innkeeper and vendor npc
 */
std.CreatureTemplates.create(/*@1*/'mod'/**/,/*@2*/'id'/**/)
    .Name.enGB.set('Innkeeper NPC')
    .Subname.enGB.set('Innkeeper')
    .Models.addIds(29419)
    .FactionTemplate.NEUTRAL_PASSIVE.set()
    .NPCFlags.GOSSIP.set(true)
    .NPCFlags.VENDOR.set(true)
    .NPCFlags.INNKEEPER.set(true)
    .NPCFlags.TRAINER.set(true)
    .NPCFlags.CLASS_TRAINER.set(true)
    .Gossip.modNew((gossip)=>{
        gossip
            .Text.add({enGB:'Welcome to my inn'})
            .Options.addMod(option=>{
                option.Text.setSimple({enGB:'Make this inn your home'})
                .Action.INNKEEPER.set()
                .Icon.COGWHEEL.set()
            })
            .Options.addMod(option=>{
                option.Text.MaleText.enGB.set('Let me browse your goods')
                .Icon.setVendor()
                .Action.setNewVendor((vendor)=>{
                    // Add vendor items here
                    vendor.addItem(25)
                })
            })
    })
/** end-snippet */

/**
 * Snippet: Creature::Multivendor
 * - Basic multivendor npc
 */
std.CreatureTemplates.create(/*@1*/'mod'/**/,/*@2*/'id'/**/)
    .Name.enGB.set('Multivendor NPC')
    .Subname.enGB.set('Multivendor')
    .Models.addIds(29419)
    .FactionTemplate.setNeutralPassive()
    .NPCFlags.Gossip.set(true)
    .Gossip.modRefCopy((gossip)=>{
        gossip
            .Options.addMod(op=>{
                op.Text.MaleText.enGB.set('Let me browse your goods')
                  .Icon.setVendor()
                  .Action.setNewVendor((vendor)=>{
                      vendor.addItem(25)
                  })
            })
            .Options.addMod(op=>{
                op.Text.MaleText.enGB.set('Let me browse more goods')
                  .Icon.setVendor()
                  .Action.setNewVendor((vendor)=>{
                      vendor.addItem(100)
                  })
            })
    })
/** end-snippet */

/**
 * Snippet: Creature::QuestGiver
 * - Basic questgiver npc
 */
std.CreatureTemplates.create(/*@1*/'mod'/**/,/*@2*/'id'/**/)
    .Name.enGB.set('Questgiver NPC')
    .Subname.enGB.set('Questgiver')
    .Models.addIds(29419)
    .FactionTemplate.setNeutralPassive()
    .NPCFlags.QuestGiver.set(true)
/** end-snippet */

/**
 * Snippet: Creature::Patrol
 * - Basic patrol npc
 */
std.CreatureTemplates.create(/*@1*/'mod'/**/,/*@2*/'id'/**/)
    .Name.enGB.set('Patrol NPC')
    .Subname.enGB.set('Patroller')
    .Models.addIds(29419)
    .FactionTemplate.setNeutralPassive()
    .NPCFlags.QuestGiver.set(true)
    .spawnMod(/*@1*/'mod'/**/,/*@2*/'id'/**/+'spawn'
        , {map:0,x:0,y:0,z:0,o:0}
        , (spawn=>{
                spawn.PatrolPath.add('WALK',[
                    /*@4*/{map:0,x:0,y:0,z:0,o:0}/**/
                ])
        })
    )
/** end-snippet */