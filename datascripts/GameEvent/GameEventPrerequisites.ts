import { MultiRowSystem } from "wotlkdata/cell/systems/MultiRowSystem";
import { SQL } from "wotlkdata/sql/SQLFiles";
import { game_event_prerequisiteRow } from "wotlkdata/sql/types/game_event_prerequisite";
import { MainEntity } from "../Misc/Entity";
import { GameEvent, GameEventRefReadOnly } from "./GameEvent";

export class GameEventPrerequisite extends MainEntity<game_event_prerequisiteRow> {
    get Event() {
        return new GameEventRefReadOnly(this, this.row.eventEntry);
    }
    get Prerequisite() {
        return new GameEventRefReadOnly(this, this.row.prerequisite_event);
    }

    isDeleted() {
        return this.row.isDeleted();
    }

    delete() {
        this.row.delete();
        return this;
    }
}

export class GameEventPrerequisitesForward extends MultiRowSystem<GameEventPrerequisite,GameEvent>{
    protected getAllRows(): GameEventPrerequisite[] {
        return SQL.game_event_prerequisite
            .filter({eventEntry:this.owner.ID})
            .map(x=>new GameEventPrerequisite(x));
    }

    add(prerequisite: number) {
        SQL.game_event_prerequisite.add(this.owner.ID,prerequisite);
        return this.owner;
    }

    protected isDeleted(value: GameEventPrerequisite): boolean {
        return value.isDeleted();
    }
}

export class GameEventPrerequisitesBackward extends MultiRowSystem<GameEventPrerequisite,GameEvent>{
    protected getAllRows(): GameEventPrerequisite[] {
        return SQL.game_event_prerequisite
            .filter({prerequisite_event:this.owner.ID})
            .map(x=>new GameEventPrerequisite(x));
    }

    add(event: number) {
        SQL.game_event_prerequisite.add(event,this.owner.ID);
        return this.owner;
    }

    protected isDeleted(value: GameEventPrerequisite): boolean {
        return value.isDeleted();
    }
}