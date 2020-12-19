import { SQL } from "wotlkdata";
import { Subsystem } from "wotlkdata/cell/Subsystem";
import { Position } from "../Misc/Position";
import { CreatureTemplate } from "./CreatureTemplate";

export class CreatureWaypoints extends Subsystem<CreatureTemplate> {

    get(){
        return SQL.waypoints.filter({entry: this.owner.ID})
            .sort((a,b)=>a.pointid.get()>b.pointid.get() ? 1 : -1)
    }

    add(point: Position) {
        const wps = this.get();
        const index = wps.length == 0 ? 1 : wps[wps.length-1].pointid.get() + 1
        SQL.waypoints.add(this.owner.ID, index)
            .position_x.set(point.x)
            .position_y.set(point.y)
            .position_z.set(point.z)
            .orientation.set(point.o);
        return this.owner;
    }
}