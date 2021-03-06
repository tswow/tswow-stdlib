import { SQL } from "wotlkdata";
import { Position, Pos } from "../Misc/Position";

export class ScriptPath {
    protected pathId: number;

    constructor(pathId: number) {
        this.pathId = pathId;
    }

    get ID() { return this.pathId; }

    get length() { return SQL.waypoints.filter({entry:this.pathId}).length }

    get(index: number) {
        let waypoint = SQL.waypoints.filter({entry:this.pathId,pointid: index+1})[0];
    }

    add(points: Position|Position[]) {
        if(!Array.isArray(points)) {
            points = [points];
        }
        const oldPoints = SQL.waypoints.filter({entry:this.pathId});
        points.forEach((x,i)=>
            SQL.waypoints.add(this.pathId,oldPoints.length+1+i)
                .position_x.set(x.x)
                .position_y.set(x.y)
                .position_z.set(x.z)
                .orientation.set(x.o)
                .delay.set(x.delay||0)
                .point_comment.set('tswow')
            )
        return this;
    }
}