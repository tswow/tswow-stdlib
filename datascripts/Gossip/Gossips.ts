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
import { SQL } from "wotlkdata";
import { GOCreature } from "../Misc/GOorCreature";
import { Ids } from "../Misc/Ids"
import { Gossip } from "./Gossip";
import { TopCell } from "../Refs/SharedRef";

export const Gossips = {
    create<S,G,T extends GOCreature<G>>(directOwner?: S, topOwner?: T){
        const id = Ids.GossipMenu.id();
        const text = Ids.NPCText.id();
        const gossipRow = SQL.gossip_menu.add(id, text)
            .VerifiedBuild.set(17688)
        SQL.npc_text.add(text)
            .BroadcastTextID0.set(0)
            .BroadcastTextID1.set(0)
            .BroadcastTextID2.set(0)
            .BroadcastTextID3.set(0)
            .BroadcastTextID4.set(0)
            .BroadcastTextID5.set(0)
            .BroadcastTextID6.set(0)
            .BroadcastTextID7.set(0)
            .VerifiedBuild.set(17688)
        return new Gossip<S,G,T>(directOwner as S, topOwner as T,new TopCell(gossipRow.MenuID.get()));
    },

    load<S,G,T extends GOCreature<G>>(id: number, directOwner?: S, topOwner?: T) {
        return new Gossip<S,G,T>(directOwner as S, topOwner as T, new TopCell(id));
    }
}