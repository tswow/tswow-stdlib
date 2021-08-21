import { CreatureTemplates } from "../Creatures"
import { DBC } from "wotlkdata/dbc/DBCFiles";

export const CreaturePresets = {
    CreateClassTrainer(mod: string, id: string, classId: number) {
        let cls = DBC.ChrClasses.findById(classId);
        let trainerName = `${cls.Name.enGB.get()} Trainer`
        return CreatureTemplates.create(mod,id)
            .Name.enGB.set(trainerName)
            .Subname.enGB.set(trainerName)
            .Gossip.setRefID(0)
            .NPCFlags.Trainer.mark()
            .Trainer.modRefCopy((trainer)=>{
                trainer
                    .Greeting.enGB.set(
                        `Ready for some training, ${cls.Name.enGB.get()}?`
                    )
                    .Class.set(classId)
            })
    }
}