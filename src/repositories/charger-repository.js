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

  async estimate(chargerId, vehicleId) {
    const charger = await this.findById(chargerId);
    if (!charger) {
      return null;
    }

    const travelTimeMin = 12;
    const waitTimeMin = charger.status === "IN_USE" ? 8 : 2;
    const chargeTimeMin = Math.max(
      1,
      Math.round((60 / charger.max_power_kw) * 20),
    );
    const estimatedCost = Number(
      (chargeTimeMin / 60) * charger.price_per_kwh * 8,
    ).toFixed(2);

    return {
      chargerId: charger._id,
      travelTimeMin,
      waitTimeMin,
      chargeTimeMin,
      estimatedCost: Number(estimatedCost),
    };
  }
}

export default new ChargerRepository();
