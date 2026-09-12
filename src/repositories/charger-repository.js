/* eslint-disable no-undef */
import Charger from "../models/charger.js";
import mongoose from "mongoose";

class ChargerRepository {
  async findById(chargerId) {
    if (!mongoose.Types.ObjectId.isValid(chargerId)) {
      return null;
    }
    return Charger.findOne({
      _id: chargerId,
      is_deleted: { $ne: true },
    }).lean();
  }

  async findAvailabilitySlots(chargerId) {
    if (!mongoose.Types.ObjectId.isValid(chargerId)) {
      return null;
    }
    return Charger.findOne(
      { _id: chargerId, is_deleted: { $ne: true } },
      { availability_slots: 1 },
    ).lean();
  }

  markSlotBooked(chargerId, slotId, orderId) {
    return Charger.findOneAndUpdate(
      { _id: chargerId, "availability_slots._id": slotId },
      {
        $set: {
          "availability_slots.$.status": "BOOKED",
          "availability_slots.$.order_id": orderId,
        },
      },
      { new: true },
    );
  }
}

export default new ChargerRepository();
