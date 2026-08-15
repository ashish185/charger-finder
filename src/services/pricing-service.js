import mongoose from "mongoose";
import PricingRepository from "../repositories/pricing-repository.js";
import ChargerRepository from "../repositories/charger-repository.js";
import StationRepository from "../repositories/station-repository.js";

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

function pricingData(payload) {
  const data = {};
  if (payload.ratePerKwh !== undefined) {
    data.rate_per_kwh = payload.ratePerKwh;
  }
  if (payload.reservationFee !== undefined) {
    data.reservation_fee = payload.reservationFee;
  }
  if (payload.platformFee !== undefined) {
    data.platform_fee = payload.platformFee;
  }
  if (payload.chargingEfficiency !== undefined) {
    data.charging_efficiency = payload.chargingEfficiency;
  }
  if (payload.bufferPercentage !== undefined) {
    data.buffer_percentage = payload.bufferPercentage;
  }
  if (payload.isActive !== undefined) {
    data.is_active = payload.isActive;
  }
  return data;
}

function pricingResponse(pricing) {
  return {
    pricingId: pricing._id,
    chargerId: pricing.charger_id,
    ratePerKwh: pricing.rate_per_kwh,
    reservationFee: pricing.reservation_fee,
    platformFee: pricing.platform_fee,
    chargingEfficiency: pricing.charging_efficiency,
    bufferPercentage: pricing.buffer_percentage,
    isActive: pricing.is_active,
    updatedAt: pricing.updatedAt,
  };
}

class PricingService {
  constructor(pricingRepository, chargerRepository, stationRepository) {
    this.pricingRepository = pricingRepository || new PricingRepository();
    this.chargerRepository = chargerRepository || ChargerRepository;
    this.stationRepository = stationRepository || new StationRepository();
  }

  async ensureChargerOwnership(operatorId, chargerId) {
    ensureId(chargerId, "chargerId");
    const charger = await this.chargerRepository.findById(chargerId);
    if (!charger) {
      throw notFound("Charger not found");
    }
    const station = await this.stationRepository.findByIdForOperator(
      charger.station_id,
      operatorId,
    );
    if (!station) {
      throw notFound("Charger not found");
    }
    return charger;
  }

  async get(operatorId, chargerId) {
    await this.ensureChargerOwnership(operatorId, chargerId);
    const pricing = await this.pricingRepository.findActiveByCharger(chargerId);
    if (!pricing) {
      throw notFound("Pricing not found");
    }
    return pricingResponse(pricing);
  }

  async upsert(operatorId, chargerId, payload) {
    await this.ensureChargerOwnership(operatorId, chargerId);
    const pricing = await this.pricingRepository.upsertByCharger(chargerId, {
      ...pricingData(payload),
      charger_id: chargerId,
    });
    return pricingResponse(pricing);
  }
}

export default new PricingService();
