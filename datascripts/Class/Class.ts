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

import { finish } from "wotlkdata";
import { DBC } from "wotlkdata/wotlkdata/dbc/DBCFiles";
import { ChrClassesRow } from "wotlkdata/wotlkdata/dbc/types/ChrClasses";
import { Edit } from "wotlkdata/wotlkdata/luaxml/TextFile";
import { BuildArgs } from "wotlkdata/wotlkdata/Settings";
import { findGaps } from "../GapDetection/GapDetection";
import { MainEntity } from "../Misc/Entity";
import { ClassRaces } from "./ClassRaceData/ClassRaces";
import { ClassStartInventory } from "./ClassStartInventory";
import { ClassStats } from "./ClassStats";
import { ClassTalents } from "./ClassTalents";
import { ClassUISettings } from "./ClassUISettings";

export type LevelStats = { str: number, agi: number, sta: number, inte: number, spi: number};

export class Class extends MainEntity<ChrClassesRow> {
    readonly UI : ClassUISettings;
    readonly BaseClass: number;

    constructor(baseClass: number, row : ChrClassesRow,
        tCoordsCCEdit : Edit,
        classColorEdit : Edit,
        sortOrderEdit : Edit,
        tCoordsEdit : Edit,
        xmlEdit : Edit,
        maleDescription : Edit,
        femaleDescription : Edit,
        infoRows : Edit[]) {
            super(row);
            this.UI = new ClassUISettings(this,
                tCoordsCCEdit,classColorEdit,sortOrderEdit,
                tCoordsEdit,xmlEdit,maleDescription,
                femaleDescription,infoRows);
            this.BaseClass = baseClass;
    }

    get Inventory() { return new ClassStartInventory(this); }
    get Filename() { return this.row.Filename.get(); }
    get ID() { return this.row.ID.get(); }
    get Mask() { return 1<<(this.ID-1) }
    get Stats() { return new ClassStats(this); }
    get Name() { return this.wrapLoc(this.row.Name); }
    get Flags() { return this.wrap(this.row.Flags); }
    get CinematicSequence() { return this.wrap(this.row.CinematicSequenceID); }
    get RequiredExpansion() { return this.wrap(this.row.Required_Expansion); }
    get DisplayPower() { return this.wrap(this.row.DisplayPower); }
    get PetNameToken() { return this.wrap(this.row.PetNameToken); }
    get Races() { return new ClassRaces(this); }
    get Talents() { return new ClassTalents(this); }
}


finish('class-gaps', ()=>{
    if(BuildArgs.READ_ONLY) return; // <-- class gaps are valid if we're in readonly mode
    findGaps(
          'class'
        , 'ChrClasses'
        , 0
        , DBC.ChrClasses.filter({}).map(x=>x.ID.get())
        , (cur,last)=>cur===11&&last===9
    )
})