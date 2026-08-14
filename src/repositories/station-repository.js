import Station from "../models/station.js";

class StationRepository {
  create(data) {
    return Station.create(data);
  }

  findNearby({
    lat,
    lng,
    radiusKm,
    connectorTypes = [],
    chargingTypes = [],
    statuses = [],
    occupancy = [],
  }) {
    const pipeline = [];
    const hasGeo = lat !== undefined && lng !== undefined;

    if (hasGeo) {
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          distanceField: "distanceMeters",
          spherical: true,
          ...(radiusKm ? { maxDistance: Number(radiusKm) * 1000 } : {}),
        },
      });
    }

    const stationMatch = {};
    if (occupancy.length > 0) {
      stationMatch.occupancy = { $in: occupancy };
    }
    pipeline.push({ $match: stationMatch });

    const chargerMatch = { is_deleted: { $ne: true } };
    if (connectorTypes.length > 0) {
      chargerMatch.connector = { $in: connectorTypes };
    }
    if (chargingTypes.length > 0) {
      chargerMatch.charging_type = { $in: chargingTypes };
    }
    if (statuses.length > 0) {
      chargerMatch.status = { $in: statuses };
    }

    pipeline.push(
      {
        $lookup: {
          from: "chargers",
          let: { stationId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$station_id", "$$stationId"] },
                ...chargerMatch,
              },
            },
          ],
          as: "chargers",
        },
      },
      {
        $addFields: {
          totalChargers: { $size: "$chargers" },
          availableChargers: {
            $size: {
              $filter: {
                input: "$chargers",
                as: "charger",
                cond: { $eq: ["$$charger.status", "AVAILABLE"] },
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          location: 1,
          amenities: 1,
          operating_hours: 1,
          occupancy: 1,
          status: 1,
          distanceKm: hasGeo
            ? { $divide: ["$distanceMeters", 1000] }
            : "$$REMOVE",
          totalChargers: 1,
          availableChargers: 1,
        },
      },
    );

    if (hasGeo) {
      pipeline.push({ $sort: { distanceKm: 1 } });
    }

    return Station.aggregate(pipeline);
  }

  findById(stationId) {
    return Station.findOne({ _id: stationId }).lean();
  }

  findByIdForOperator(stationId, operatorId) {
    console.log("Finding station by ID for operator:", stationId, operatorId);
    return Station.findOne({ _id: stationId, operator_id: operatorId }).lean();
  }

  findPortfolio({ operatorId, status, city, skip, limit }) {
    const filter = { operator_id: operatorId };
    if (status) {
      filter.status = status;
    }
    if (city) {
      filter.address = { $regex: city, $options: "i" };
    }
    return Promise.all([
      Station.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Station.countDocuments(filter),
    ]);
  }

  updateForOperator(stationId, operatorId, update) {
    return Station.findOneAndUpdate(
      { _id: stationId, operator_id: operatorId },
      update,
      { new: true, runValidators: true },
    ).lean();
  }
}

export default StationRepository;
