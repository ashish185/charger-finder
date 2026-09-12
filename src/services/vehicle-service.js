import mongoose from "mongoose";
import VehicleRepository from "../repositories/vehicle-repository.js";

function notFound(message) {
  const error = new Error(message);
  error.statusCode = 404;
  error.code = "NOT_FOUND";
  return error;
}

function ensureId(value, name) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(`${name} is invalid`);
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }
}

function vehicleData(payload) {
  const data = {};
  if (payload.nickname !== undefined) {
    data.nickname = payload.nickname;
  }
  if (payload.manufacturer !== undefined) {
    data.manufacturer = payload.manufacturer;
  }
  if (payload.model !== undefined) {
    data.model = payload.model;
  }
  if (payload.variant !== undefined) {
    data.variant = payload.variant;
  }
  if (payload.vehicleType !== undefined) {
    data.vehicle_type = payload.vehicleType;
  }
  if (payload.registrationNumber !== undefined) {
    data.registration_number = payload.registrationNumber;
  }
  if (payload.batteryCapacityKwh !== undefined) {
    data.battery_capacity_kwh = payload.batteryCapacityKwh;
  }
  if (payload.chargingOptions !== undefined) {
    data.charging_options = payload.chargingOptions.map((option) => ({
      charging_type: option.chargingType,
      connector_type: option.connectorType,
    }));
  }
  if (payload.rangeKm !== undefined) {
    data.range_km = payload.rangeKm;
  }
  if (payload.isDefault !== undefined) {
    data.is_default = payload.isDefault;
  }
  return data;
}

function vehicleResponse(vehicle) {
  return {
    vehicleId: vehicle._id,
    userId: vehicle.user_id,
    nickname: vehicle.nickname,
    manufacturer: vehicle.manufacturer,
    model: vehicle.model,
    variant: vehicle.variant,
    vehicleType: vehicle.vehicle_type,
    registrationNumber: vehicle.registration_number,
    batteryCapacityKwh: vehicle.battery_capacity_kwh,
    chargingOptions: (vehicle.charging_options || []).map((option) => ({
      chargingType: option.charging_type,
      connectorType: option.connector_type,
    })),
    rangeKm: vehicle.range_km,
    isDefault: vehicle.is_default,
    createdAt: vehicle.created_at,
    updatedAt: vehicle.updated_at,
  };
}

class VehicleService {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository || new VehicleRepository();
  }

  async create(userId, payload) {
    const data = vehicleData(payload);
    const existingCount = await this.vehicleRepository.countByUser(userId);
    const isDefault = data.is_default || existingCount === 0;

    if (isDefault) {
      await this.vehicleRepository.clearDefaultForUser(userId);
    }

    const vehicle = await this.vehicleRepository.create({
      ...data,
      user_id: userId,
      is_default: isDefault,
    });
    return vehicleResponse(vehicle);
  }

  async list(userId) {
    const vehicles = await this.vehicleRepository.findByUser(userId);
    return vehicles.map(vehicleResponse);
  }

  async get(userId, vehicleId) {
    ensureId(vehicleId, "vehicleId");
    const vehicle = await this.vehicleRepository.findByIdForUser(
      vehicleId,
      userId,
    );
    if (!vehicle) {
      throw notFound("Vehicle not found");
    }
    return vehicleResponse(vehicle);
  }
}

export default new VehicleService();
