import { Cell } from "wotlkdata/cell/Cell";
import { DBC } from "wotlkdata/dbc/DBCFiles";
import { AchievementRow } from "wotlkdata/dbc/types/Achievement";
import { Ids } from "../Base/Ids";
import { MainEntity } from "../Base/MainEntity";
import { iconToPath, pathToIcon } from "../Spell/SpellIcon";
import { AchievementCriteria } from "./AchievementCriteria";

export class Achievement extends MainEntity<AchievementRow> {
    readonly criteria : AchievementCriteria;

    constructor(row: AchievementRow) {
        super(row);
        this.criteria = new AchievementCriteria(this);
    }

    get Category() { return this.wrap(this.row.Category); }
    get Description() { return this.wrapLoc(this.row.Description); }
    get Icon() { return Cell.make(this,
        ()=>iconToPath(this.row.IconID.get()).get(),
        (str: string)=>{pathToIcon(str); return this}
    )}
    get Map() { return this.wrap(this.row.Map); }
    get Points() { return this.wrap(this.row.Points); }
    get Name() { return this.wrapLoc(this.row.Title); }
    get UIOrder() { return this.wrap(this.row.Ui_Order); }
}

export const Achievements = {
    create : (mod : string, achievementId : string) => {     
        return new Achievement(
            DBC.Achievement.add(Ids.Achievement.id(mod,achievementId)))
    },
    
    load : (id : number) => {
        return new Achievement(DBC.Achievement.find({ID:id}))
    }
}