/* eslint-disable no-undef */
import Charger from "../models/charger.js";
import Station from "../models/station.js";
import mongoose from "mongoose";

class ChargerRepository {
  async findNearby({ lat, lng, radiusKm, vehicleId, type }) {
    const meters = Number(radiusKm) * 1000;

    const typeMap = {
      "2W": "Type2",
      "4W": "CCS2",
    };

    const chargerMatch = {
      "charger.status": { $ne: "UNAVAILABLE" },
      "charger.fault_flag": false,
      "charger.is_deleted": { $ne: true },
    };

    if (type && typeMap[type]) {
      chargerMatch["charger.connector_type"] = typeMap[type];
    }

    const pipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          distanceField: "distanceMeters",
          spherical: true,
          maxDistance: meters,
        },
      },
      {
        $lookup: {
          from: "chargers",
          localField: "_id",
          foreignField: "station_id",
          as: "chargers",
        },
      },
      {
        $unwind: "$chargers",
      },
      {
        $match: chargerMatch,
      },
      {
        $project: {
          chargerId: "$chargers._id",
          stationId: "$_id",
          distance: { $divide: ["$distanceMeters", 1000] },
          status: "$chargers.status",
          price: "$chargers.price_per_kwh",
          powerKw: "$chargers.max_power_kw",
          freshness: {
            $cond: [
              {
                $gt: [
                  "$chargers.last_updated_at",
                  new Date(Date.now() - 1000 * 60 * 30),
                ],
              },
              "FRESH",
              "STALE",
            ],
          },
        },
      },
      {
        $sort: { distance: 1 },
      },
    ];

    return Station.aggregate(pipeline);
  }

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
