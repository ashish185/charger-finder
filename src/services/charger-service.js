import mongoose from "mongoose";
import ChargerRepository from "../repositories/charger-repository.js";

function notFound(message) {
  const error = new Error(message);
  error.statusCode = 404;
  error.code = "NOT_FOUND";
  return error;
}

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = "VALIDATION_ERROR";
  return error;
}

function ensureId(value, name) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw validationError(`${name} is invalid`);
  }
}

function chargerResponse(charger) {
  return {
    chargerId: charger._id,
    stationId: charger.station_id,
    status: charger.status,
    price: charger.price_per_kwh,
    powerKw: charger.max_power_kw,
    eta: charger.status === "IN_USE" ? 5 : 1,
    freshness:
      charger.last_updated_at &&
      charger.last_updated_at > new Date(Date.now() - 1000 * 60 * 30)
        ? "FRESH"
        : "STALE",
  };
}

class ChargerService {
  constructor(chargerRepository) {
    this.chargerRepository = chargerRepository || ChargerRepository;
  }

  async get(chargerId) {
    ensureId(chargerId, "chargerId");
    const charger = await this.chargerRepository.findById(chargerId);
    if (!charger) {
      throw notFound("Charger not found");
    }
    return chargerResponse(charger);
  }

  async estimate(chargerId, vehicleId) {
    ensureId(chargerId, "chargerId");
    if (!vehicleId) {
      throw validationError("vehicleId is required");
    }
    const estimate = await this.chargerRepository.estimate(
      chargerId,
      vehicleId,
    );
    if (!estimate) {
      throw notFound("Charger not found");
    }
    return estimate;
  }
}

export default new ChargerService();
