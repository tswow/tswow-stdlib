import { MultiRowSystem } from "wotlkdata/cell/systems/MultiRowSystem";
import { SQL } from "wotlkdata/sql/SQLFiles";
import { vehicle_accessoryRow } from "wotlkdata/sql/types/vehicle_accessory";
import { vehicle_template_accessoryRow } from "wotlkdata/sql/types/vehicle_template_accessory";
import { CreatureInstance, CreatureRefReadOnly } from "../Creature/CreatureInstance";
import { CreatureTemplate, CreatureTemplateRefReadOnly } from "../Creature/CreatureTemplate";
import { MainEntity } from "../Misc/Entity";
import { SummonType } from "../Misc/SummonType";

export class VehicleAccessoryBase<
    T extends vehicle_template_accessoryRow
            | vehicle_accessoryRow>
    extends MainEntity<T>
{
    get Seat() { return this.row.seat_id.get() }
    get DiesWithVehicle() { return this.wrap(this.row.minion); }
    get SummonType() { return new SummonType(this, this.row.summontype); }
    get SummonTimer() { return this.wrap(this.row.summontimer); }
}

export class VehicleTemplateAccessory extends VehicleAccessoryBase<vehicle_template_accessoryRow> {
    get Creature() {
        return new CreatureTemplateRefReadOnly(this, this.row.entry);
    }
}

export class VehicleInstanceAccessory extends VehicleAccessoryBase<vehicle_accessoryRow> {
    get Creature() {
        return new CreatureRefReadOnly(this, this.row.guid);
    }
}

export class VehicleTemplateAccessories extends MultiRowSystem<VehicleTemplateAccessory, CreatureTemplate> {
    protected getAllRows(): VehicleTemplateAccessory[] {
        return SQL.vehicle_template_accessory.filter({entry:this.owner.ID})
            .map(x=> new VehicleTemplateAccessory(x))
    }
    protected isDeleted(value: VehicleTemplateAccessory): boolean {
        return value.row.isDeleted();
    }

    getSeat(seatIndex: number) {
        return new VehicleTemplateAccessory(
            SQL.vehicle_template_accessory
                .find({entry:this.owner.ID,seat_id:seatIndex})
            || SQL.vehicle_template_accessory
                .add(this.owner.ID,seatIndex)
                .description.set('tswow')
                .minion.set(0)
                .summontimer.set(0)
                .summontype.set(1)
                .undelete()
        )
    }

    modSeat(seatIndex: number, callback: (accessory: VehicleTemplateAccessory)=>void) {
        callback(this.getSeat(seatIndex));
    }
}

export class VehicleInstanceAccessories extends MultiRowSystem<VehicleInstanceAccessory, CreatureInstance> {
    protected getAllRows(): VehicleInstanceAccessory[] {
        return SQL.vehicle_accessory.filter({guid:this.owner.GUID})
            .map(x=> new VehicleInstanceAccessory(x))
    }
    protected isDeleted(value: VehicleInstanceAccessory): boolean {
        return value.row.isDeleted();
    }

    getSeat(seatIndex: number) {
        return new VehicleInstanceAccessory(
            SQL.vehicle_accessory
                .find({guid:this.owner.GUID,seat_id:seatIndex})
            || SQL.vehicle_accessory
                .add(this.owner.GUID,seatIndex)
                .description.set('tswow')
                .minion.set(0)
                .summontimer.set(0)
                .summontype.set(1)
                .undelete()
        )
    }

    modSeat(seatIndex: number, callback: (accessory: VehicleInstanceAccessory)=>void) {
        callback(this.getSeat(seatIndex));
    }
}