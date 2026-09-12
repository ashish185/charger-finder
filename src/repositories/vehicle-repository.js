/* eslint-disable no-undef */
import Vehicle from "../models/vehicle.js";

class VehicleRepository {
  create(data) {
    return Vehicle.create(data);
  }

  findByUser(userId) {
    return Vehicle.find({ user_id: userId }).sort({ created_at: -1 }).lean();
  }

  findByIdForUser(vehicleId, userId) {
    return Vehicle.findOne({ _id: vehicleId, user_id: userId }).lean();
  }

  clearDefaultForUser(userId) {
    return Vehicle.updateMany(
      { user_id: userId, is_default: true },
      { $set: { is_default: false } },
    );
  }

  countByUser(userId) {
    return Vehicle.countDocuments({ user_id: userId });
  }
}

export default VehicleRepository;
