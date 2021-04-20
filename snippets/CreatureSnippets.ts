import { std } from "../datascripts/tswow-stdlib-data";

/**
 * Snippet: Creature::Aggressive Mob
 * - Basic aggressive mob
 */
std.CreatureTemplates.create(/*@1*/'mod'/**/,/*@2*/'id'/**/)
    .Name.enGB.set('Aggressive Mob')
    .FactionTemplate.setNeutralHostile()
    .Models.addIds(29419)
    .MovementType.setRandomMovement()

    // Stats
    .Stats.ArmorMod.set(1)
    .Stats.DamageMod.set(1)
    .Stats.ExperienceMod.set(1)
    .Stats.HealthMod.set(1)
    .Stats.ManaMod.set(1)
    .UnitClass.setWarrior()
    .Level.set(1,1)

    // Loot
    .Gold.set(1,100)
    .NormalLoot.addItem(25,10,1,1)
    .NormalLoot.addItem(100,10,1,1)
/** end-snippet */

/**
 * Snippet: Creature::Vendor
 * - Basic vendor npc
 */
std.CreatureTemplates.create(/*@1*/'mod'/**/,/*@2*/'id'/**/)
    .Name.enGB.set('Vendor NPC')
    .Title.enGB.set('Vendor')
    .Models.addIds(29419)
    .FactionTemplate.setOrgrimmar()

    .NPCFlags.Repairer.mark()
    .Vendor.addItem(25)
    // add items here
/** end-snippet */

/**
 * Snippet: Creature::Innkeeper
 * - Basic innkeeper and vendor npc
 */
std.CreatureTemplates.create(/*@1*/'mod'/**/,/*@2*/'id'/**/)
    .Name.enGB.set('Innkeeper NPC')
    .Title.enGB.set('Innkeeper')
    .Models.addIds(29419)
    .Gossip
        .Text.add({enGB:'Welcome to my inn!'})
        .Options.add()
            .Text.MaleText.enGB.set('Make this inn your home')
            .Action.setInnkeeper()
            .Icon.setCogwheel()
        .end

        .Options.add()
            .Text.MaleText.enGB.set('Let me browse your goods')
            .Icon.setMoneyBag()
            .Action.setOwnVendor()
                .addItem(10)
                .addItem(25)
                // add items here
            .end
        .end
    .end
/** end-snippet */

/**
 * Snippet: Creature::Multivendor
 * - Basic multivendor npc
 */
std.CreatureTemplates.create(/*@1*/'mod'/**/,/*@2*/'id'/**/)
    .Name.enGB.set('Multivendor NPC')
    .Title.enGB.set('Multivendor')
    .Models.addIds(29419)
    .Gossip
        .Text.add({enGB:'What goods would you like to browse?'})

        // Weapon vendor
        .Options.add()
            .Text.MaleText.enGB.set('Let me browse your weapons')
            .Icon.setVendor()
            .Action.setOwnVendor()
                .addItem(25)
                // add items here
            .end
        .end

        // Food vendor
        .Options.add()
            .Text.MaleText.enGB.set('Let me browse your food')
            .Icon.setVendor()
            .Action.setMultivendor()
                .addItem(117)
                // add items here
            .end
        .end

        // Bag vendor
        .Options.add()
            .Text.MaleText.enGB.set('Let me browse your bags')
            .Icon.setVendor()
            .Action.setMultivendor()
                .addItem(4496)
                // add items here
            .end
        .end
    .end
/** end-snippet */