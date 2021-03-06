import { DBC } from "wotlkdata"
import { SkillLineQuery } from "wotlkdata/dbc/types/SkillLine";
import { SQL } from "wotlkdata/sql/SQLFiles";
import { Ids } from "../Misc/Ids";
import { SkillLine } from "./SkillLine"

export const SkillLines = {
    load(id: number) {
        return new SkillLine(DBC.SkillLine.findById(id));
    },

    filter(query: SkillLineQuery) {
        return DBC.SkillLine.filter(query).map(x=>new SkillLine(x));
    },

    create(mod: string, id: string) {
        return new SkillLine(DBC.SkillLine.add(Ids.SkillLine.id(mod, id)))
    },

    createClass(mod: string, id: string, cls: number) {
        const sl = SkillLines.create(mod, id)
            .Category.set(7)
            .SkillCosts.set(0)
            .CanLink.set(0)
            .RaceClassInfos.add()
                .RaceMask.set(4294967295)
                .ClassMask.clearAll()
                .ClassMask.mark(cls-1)
                .Flags.set(1040)
                .end
        SQL.playercreateinfo_skills.add(0, 1<<(cls-1),sl.ID).comment.set(`${cls} - ${id}`);
        return sl;
    }
}