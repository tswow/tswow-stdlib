// needed to load custom classes once created,

import { DBC, LUAXML, SQL } from "wotlkdata";
import { Cell } from "wotlkdata/cell/cells/Cell";
import { CellReadOnly } from "wotlkdata/cell/cells/CellReadOnly";
import { EnumCon, makeEnum } from "wotlkdata/cell/cells/EnumCell";
import { ChrClassesQuery, ChrClassesRow } from "wotlkdata/dbc/types/ChrClasses";
import { Edit } from "wotlkdata/luaxml/TextFile";
import { includes } from "wotlkdata/query/Relations";
import { playercreateinfo_skillsRow } from "wotlkdata/sql/types/playercreateinfo_skills";
import { Table } from "wotlkdata/table/Table";
import { Ids, StaticIDGenerator } from "../Misc/Ids";
import { makeRefNoCreate, makeRefReadOnly } from "../Refs/Ref";
import { RegistryRowBase } from "../Refs/Registry";
import { CharacterCreationUI } from "../UI/CharacterCreation";
import { BaseClassData } from "./BaseClassData";
import { Class } from "./Class";

// it's too complicated to find all the lua/xml rows again
const loadedClasses: {[key: number]: Class} = {}
let created = false;
let languages : playercreateinfo_skillsRow[] = []

export enum ClassIDs {
      WARRIOR      = 1
    , PALADIN      = 2
    , HUNTER       = 3
    , ROGUE        = 4
    , PRIEST       = 5
    , DEATH_KNIGHT = 6
    , SHAMAN       = 7
    , MAGE         = 8
    , WARLOCK      = 9
    , DRUID        = 11
}

export enum ClassMask {
      WARRIOR      = 0x1
    , PALADIN      = 0x2
    , HUNTER       = 0x4
    , ROGUE        = 0x8
    , PRIEST       = 0x10
    , DEATH_KNIGHT = 0x20
    , SHAMAN       = 0x40
    , MAGE         = 0x80
    , WARLOCK      = 0x100
    , DRUID        = 0x400
}

export class ClassRegistryClass
    extends RegistryRowBase<Class,ChrClassesRow,ChrClassesQuery> {
    ref<T>(owner: T, cell: Cell<number,any>) {
        return makeRefNoCreate(ClassIDs,owner,cell,this);
    }

    readOnlyRef<T>(owner: T, cell: CellReadOnly<number,any>) {
        return makeRefReadOnly(ClassIDs,owner,cell,this);
    }

    protected Table(): Table<any, ChrClassesQuery, ChrClassesRow> & { add: (id: number) => ChrClassesRow; } {
        return DBC.ChrClasses
    }
    protected IDs(): StaticIDGenerator {
        return Ids.Class;
    }
    protected Entity(row: ChrClassesRow): Class {
        let loaded = loadedClasses[row.ID.get()];
        if(loaded)
        {
            return loaded;
        }
        const cc = LUAXML.file('Interface/GlueXML/CharacterCreate.lua');
        const co = LUAXML.file('Interface/FrameXML/Constants.lua');
        const xm = LUAXML.file('Interface/GlueXML/CharacterCreate.xml');
        const gs = LUAXML.file('Interface/GlueXML/GlueStrings.lua');

        const fn = row.Filename.get()
        const tcoordscc = cc.emptyReplace(BaseClassData.CHARACTERCREATE_ICON_TCOORD_ROWS[fn]);
        const tcoords = co.emptyReplace(BaseClassData.CONSTANT_ICON_TCOORDS_ROWS[fn]);
        const classColor = co.emptyReplace(BaseClassData.CLASS_COLOR_ROWS[fn]);
        const sortOrder = co.emptyReplace(BaseClassData.CLASS_SORT_ORDER_ROWS[fn]);
        const xmle = xm.emptyReplace(BaseClassData.XML_ROWS[fn]);

        const maleDesc = gs.emptyReplace(BaseClassData.CLASS_DESCRIPTION_ROW[fn]);
        const femaleDesc = gs.emptyReplace(BaseClassData.CLASS_DESCRIPTION_ROW[fn]+1);

        const [infoStart,infoLen] = BaseClassData.CLASS_INFO_ROW[fn];
        const infoRows : Edit[] = [];
        for(let i = infoStart; i < infoStart + infoLen ; ++i ) {
            infoRows.push(gs.emptyReplace(i));
        }

        return loadedClasses[row.ID.get()] =
            new Class(
                row.ID.get(),
                row,
                tcoordscc,
                classColor,
                sortOrder,
                tcoords,
                xmle,
                maleDesc,
                femaleDesc,
                infoRows
            );
    }
    protected FindByID(id: number): ChrClassesRow {
        return DBC.ChrClasses.findById(id);
    }
    protected EmptyQuery(): ChrClassesQuery {
        return {}
    }
    ID(e: Class): number {
        return e.ID;
    }

    load(cls: EnumCon<keyof typeof ClassIDs>) {
        return super.load(makeEnum(ClassIDs,cls));
    }

    create(mod: string, clsId: string, parentClass: EnumCon<keyof typeof ClassIDs>) {
        for(let i=0;i<clsId.length;++i) {
            let cc = clsId.charCodeAt(i);
            if(!(cc>=97&&cc<=122) && !(cc>=48 && cc<=57) && !(cc>=65&&cc<=90)) {
                throw new Error(
                    `Non ascii character in class id ${clsId}`
                    + ` at pos ${i}`
                    + ` (${clsId.charAt(i)})`);
            }
        }

        let identifier = clsId.toUpperCase();

        const parent = makeEnum(ClassIDs,parentClass);

        // Set up parent buttons
        if(!created) {
            created = true;
            new CharacterCreationUI()
                .MaleButton.setPos(-20,-360)
                .FemaleButton.setPos(20,-360)
                .ClassName.setPos(0,-418)
        }

        // Create class object
        const rParent = DBC.ChrClasses.findById(parent);
        const id = Ids.Class.id(mod,clsId);
        const classIndex = DBC.ChrClasses.rowCount;

        // Copy all languages
        if(languages.length == 0) {
            languages = SQL.playercreateinfo_skills.filter({comment:includes("Language")})
        }
        languages.forEach(x=>x.clone(x.raceMask.get(),(x.classMask.get()|1<<(id-1)>>>0),x.skill.get()));

        // Setup RaceClassInfos
        DBC.SkillRaceClassInfo.find({});
        const parentRCI = DBC.SkillRaceClassInfo.filter({})
            .filter(x=>x.RaceMask.get() !== 4294967295 && x.ClassMask.get()&((1<<(parent-1))>>>0));
        parentRCI.forEach(x=>{
            let mask = x.ClassMask.get();
            if(mask!==0xffffffff) {
                mask = (mask | (1<<(id-1)))>>>0;
            }
            x.ClassMask.set(mask);
        });

        interface GtItem {
            index: number;
            Data: Cell<number, any>
            clone() : GtItem
        }

        interface GTFile {
            add(c: {Data:number}): any;
            filter(g: any): GtItem[];
        }

        // Copy over stats
        const p = (size: number, dbc: GTFile) =>
            dbc.filter({})
            .filter((x,i)=>x.index>=parent*size && x.index<parent*size+size)
        const g = (size: number, dbc: GTFile) =>
            p(size,dbc).forEach((x)=>x.clone().Data.set(x.Data.get()))

        g(100,DBC.GtChanceToMeleeCrit)
        g(100,DBC.GtChanceToSpellCrit)
        g(100,DBC.GtOCTRegenHP)
        g(100,DBC.GtOCTRegenMP)
        g(100,DBC.GtRegenHPPerSpt)
        g(100,DBC.GtRegenMPPerSpt)
        g(1,DBC.GtChanceToMeleeCritBase)
        g(1,DBC.GtChanceToSpellCritBase)
        g(320,DBC.GtCombatRatings)
        DBC.GtOCTClassCombatRatingScalar.filter({})
            .filter((x)=>x.index>=parent*32 && x.index < parent*32+32)
            .forEach((x,i)=>{
                const g = x.clone({ID: (classIndex+1)*32+i})
            });

        SQL.player_classlevelstats
            .filter({class:rParent.ID.get()}).map(x=>x.clone(id,x.level.get()));

        const co = LUAXML.file('Interface/FrameXML/Constants.lua');
        const cc = LUAXML.file('Interface/GlueXML/CharacterCreate.lua');
        const gs = LUAXML.file('Interface/GlueXML/GlueStrings.lua');

        const tCoordsCC = cc.after(52,`["${identifier}"] = {0, 0.25, 0, 0.25},`)
        const classColor = co.after(54,`\t["${identifier}"] = { r = 0.67, g = 0.83, b = 0.45 },`)
        const sortOrder = co.after(71,`\t"${identifier}",`)
        const tCoords = co.after(91,`\t["${identifier}"] = {0,0,0,0},`);

        const ccx = LUAXML.file('Interface/GlueXML/CharacterCreate.xml');
        ccx.after(586, `<CheckButton name="CharacterCreateClassButton${id-1}" inherits = "CharacterCreateClassButtonTemplate" id="${id-1}">`)
        ccx.after(586, `<Anchors>`);
        let xmlE = ccx.after(586, `<Anchor point="TOP" x="-90" y="-420"/>`);
        ccx.after(586, `</Anchors>`);
        ccx.after(586,`</CheckButton>`);
        const maleDesc = gs.after(327,`CLASS_${identifier} = "Male Description";`);
        const femaleDesc = gs.after(327,`CLASS_${identifier}_FEMALE = "Female Description";`);

        gs.after(552,`${identifier}_DISABLED = "${identifier}\\nYou must choose a difference race to be this class.";`);

        let cls = new Class(
            parent,
            rParent.clone(id,{Filename:identifier}),
            tCoordsCC,
            classColor,
            sortOrder,
            tCoords,
            xmlE,
            maleDesc,
            femaleDesc,
            []
        );

        // Set up first classes automatically
        if(cls.ID == 13) cls.UI.ClassButton.setPos(-46,-420)
        if(cls.ID == 14) cls.UI.ClassButton.setPos(-0,-420)
        if(cls.ID == 15) cls.UI.ClassButton.setPos(42,-420)
        if(cls.ID == 16) cls.UI.ClassButton.setPos(85,-420)
        loadedClasses[cls.ID] = cls;
        return cls;
    }
}
export const ClassRegistry = new ClassRegistryClass();