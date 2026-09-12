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

function estimateSlotCost({
  start,
  end,
  maxPowerKw,
  pricePerKwh,
  pricePerMinute,
}) {
  const durationMin = (new Date(end) - new Date(start)) / 60000;
  if (!Number.isFinite(durationMin) || durationMin <= 0) {
    return null;
  }

  const energyKwh = Number.isFinite(maxPowerKw)
    ? maxPowerKw * (durationMin / 60)
    : null;
  const energyCost =
    energyKwh !== null && Number.isFinite(pricePerKwh)
      ? energyKwh * pricePerKwh
      : 0;
  const timeCost = Number.isFinite(pricePerMinute)
    ? durationMin * pricePerMinute
    : 0;

  const total = energyCost + timeCost;
  return Number.isFinite(total) ? Number(total.toFixed(2)) : null;
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

  async getAvailabilitySlots(chargerId) {
    ensureId(chargerId, "chargerId");
    const charger =
      await this.chargerRepository.findAvailabilitySlots(chargerId);
    if (!charger) {
      throw notFound("Charger not found");
    }
    return charger.availability_slots || [];
  }

  async estimate(chargerId, slotId) {
    ensureId(chargerId, "chargerId");
    ensureId(slotId, "slotId");

    const charger = await this.chargerRepository.findById(chargerId);
    if (!charger) {
      throw notFound("Charger not found");
    }

    const slot = (charger.availability_slots || []).find(
      (item) => String(item._id) === String(slotId),
    );
    if (!slot) {
      throw notFound("Slot not found");
    }

    const estimatedCost = estimateSlotCost({
      start: slot.start,
      end: slot.end,
      maxPowerKw: charger.max_power_kw,
      pricePerKwh: charger.price_per_kwh,
      pricePerMinute: charger.price_per_minute,
    });
    if (estimatedCost === null) {
      throw validationError("Unable to estimate cost for the selected slot");
    }

    const chargeTimeMin = Math.round(
      (new Date(slot.end) - new Date(slot.start)) / 60000,
    );
    const waitTimeMin = charger.status === "IN_USE" ? 8 : 2;
    const travelTimeMin = 12;
    console.log("estimatedCost", estimatedCost);
    return {
      chargerId: charger._id,
      slotId: slot._id,
      travelTimeMin,
      waitTimeMin,
      chargeTimeMin,
      estimatedCost,
    };
  }
}

export default new ChargerService();
