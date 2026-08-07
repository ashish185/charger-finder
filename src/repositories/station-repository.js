import Station from "../models/station.js";

class StationRepository {
  create(data) {
    return Station.create(data);
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
