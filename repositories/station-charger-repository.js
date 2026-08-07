import Charger from "../models/charger.js";

class StationChargerRepository {
  create(data) {
    return Charger.create(data);
  }

  findByIdForStation(chargerId, stationId) {
    return Charger.findOne({
      _id: chargerId,
      station_id: stationId,
      is_deleted: { $ne: true },
    }).lean();
  }

  findByStation(stationId) {
    return Charger.find({
      station_id: stationId,
      is_deleted: { $ne: true },
    }).lean();
  }

  countByStationIds(stationIds) {
    return Charger.aggregate([
      {
        $match: {
          station_id: { $in: stationIds },
          is_deleted: { $ne: true },
        },
      },
      { $group: { _id: "$station_id", count: { $sum: 1 } } },
    ]);
  }

  updateForStation(chargerId, stationId, update) {
    return Charger.findOneAndUpdate(
      { _id: chargerId, station_id: stationId, is_deleted: { $ne: true } },
      update,
      { new: true, runValidators: true },
    ).lean();
  }
}

export default StationChargerRepository;
