import mongoose from "mongoose";
import StationRepository from "../repositories/station-repository.js";
import StationChargerRepository from "../repositories/station-charger-repository.js";

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

function stationData(payload) {
  const data = {};
  if (payload.name !== undefined) {
    data.name = payload.name;
  }
  if (payload.address !== undefined) {
    data.address = payload.address;
  }
  if (payload.location !== undefined) {
    data.location = {
      type: "Point",
      coordinates: [payload.location.lng, payload.location.lat],
    };
  }
  if (payload.amenities !== undefined) {
    data.amenities = payload.amenities;
  }
  if (payload.paymentSupport !== undefined) {
    data.payment_support = payload.paymentSupport;
  }
  if (payload.supportContact !== undefined) {
    data.support_contact = {
      name: payload.supportContact.name,
      phone: payload.supportContact.phone,
    };
  }
  if (payload.operatingHours !== undefined) {
    data.operating_hours = {
      open: payload.operatingHours.open,
      close: payload.operatingHours.close,
      is_24x7: Boolean(payload.operatingHours.is24x7),
    };
  }
  if (payload.bookingRules !== undefined) {
    data.booking_rules = {
      advance_booking_minutes: payload.bookingRules.advanceBookingMinutes,
      cancellation_window_minutes:
        payload.bookingRules.cancellationWindowMinutes,
    };
  }
  if (payload.status !== undefined) {
    data.status = payload.status;
  }
  return data;
}

function stationResponse(station, chargerCount) {
  return {
    stationId: station._id,
    name: station.name,
    address: station.address,
    location: {
      lat: station.location.coordinates[1],
      lng: station.location.coordinates[0],
    },
    operatingHours: {
      open: station.operating_hours?.open,
      close: station.operating_hours?.close,
      is24x7: station.operating_hours?.is_24x7,
    },
    amenities: station.amenities || [],
    bookingRules: {
      advanceBookingMinutes: station.booking_rules?.advance_booking_minutes,
      cancellationWindowMinutes:
        station.booking_rules?.cancellation_window_minutes,
    },
    paymentSupport: station.payment_support || [],
    supportContact: {
      name: station.support_contact?.name,
      phone: station.support_contact?.phone,
    },
    status: station.status,
    trustScore: station.trust_score,
    lastAcknowledgedAt: station.last_acknowledged_at,
    chargerCount,
    createdAt: station.createdAt,
    updatedAt: station.updatedAt,
  };
}

function chargerData(payload) {
  const data = {};
  if (payload.connectorType !== undefined) {
    data.connector_type = payload.connectorType;
  }
  if (payload.maxPowerKw !== undefined) {
    data.max_power_kw = payload.maxPowerKw;
  }
  if (payload.vehicleCompatibility !== undefined) {
    data.vehicle_compatibility = payload.vehicleCompatibility;
  }
  if (payload.pricePerKwh !== undefined) {
    data.price_per_kwh = payload.pricePerKwh;
  }
  if (payload.pricePerMinute !== undefined) {
    data.price_per_minute = payload.pricePerMinute;
  }
  return data;
}

function chargerResponse(charger) {
  return {
    chargerId: charger._id,
    stationId: charger.station_id,
    connectorType: charger.connector_type,
    maxPowerKw: charger.max_power_kw,
    vehicleCompatibility: charger.vehicle_compatibility || [],
    pricePerKwh: charger.price_per_kwh,
    pricePerMinute: charger.price_per_minute,
    status: charger.status,
    updatedAt: charger.updatedAt,
  };
}

function nearbyStationResponse(station) {
  return {
    stationId: station._id,
    name: station.name,
    address: station.address,
    location: {
      lat: station.location.coordinates[1],
      lng: station.location.coordinates[0],
    },
    amenities: station.amenities || [],
    operatingHours: {
      open: station.operating_hours?.open,
      close: station.operating_hours?.close,
      is24x7: station.operating_hours?.is_24x7,
    },
    occupancy: station.occupancy || [],
    distanceKm: station.distanceKm,
    totalChargers: station.totalChargers,
    availableChargers: station.availableChargers,
  };
}

class StationService {
  constructor(stationRepository, chargerRepository) {
    this.stationRepository = stationRepository || new StationRepository();
    this.chargerRepository =
      chargerRepository || new StationChargerRepository();
  }

  async findNearby(query) {
    const stations = await this.stationRepository.findNearby(query);
    return stations.map(nearbyStationResponse);
  }

  async create(operatorId, payload) {
    const station = await this.stationRepository.create({
      ...stationData(payload),
      operator_id: operatorId,
    });
    return stationResponse(station.toObject(), 0);
  }

  async list(operatorId, query) {
    const { page, limit, status, city } = query;
    const [stations, total] = await this.stationRepository.findPortfolio({
      operatorId,
      status,
      city,
      skip: (page - 1) * limit,
      limit,
    });
    const counts = await this.chargerRepository.countByStationIds(
      stations.map((station) => station._id),
    );
    const countMap = new Map(
      counts.map((item) => [item._id.toString(), item.count]),
    );
    return {
      stations: stations.map((station) =>
        stationResponse(station, countMap.get(station._id.toString()) || 0),
      ),
      pagination: { page, limit, total },
    };
  }

  async get(operatorId, stationId) {
    ensureId(stationId, "stationId");
    const station = await this.stationRepository.findByIdForOperator(
      stationId,
      operatorId,
    );
    if (!station) {
      throw notFound("Station not found");
    }
    const chargers = await this.chargerRepository.findByStation(stationId);
    return {
      ...stationResponse(station, chargers.length),
      chargers: chargers.map(chargerResponse),
    };
  }

  async update(operatorId, stationId, payload) {
    ensureId(stationId, "stationId");
    const station = await this.stationRepository.updateForOperator(
      stationId,
      operatorId,
      { $set: stationData(payload) },
    );
    if (!station) {
      throw notFound("Station not found");
    }
    const chargers = await this.chargerRepository.findByStation(stationId);
    return stationResponse(station, chargers.length);
  }

  async delist(operatorId, stationId) {
    ensureId(stationId, "stationId");
    const station = await this.stationRepository.updateForOperator(
      stationId,
      operatorId,
      { $set: { status: "delisted", delisted_at: new Date() } },
    );
    if (!station) {
      throw notFound("Station not found");
    }
  }

  async createCharger(operatorId, stationId, payload) {
    await this.get(operatorId, stationId);
    const charger = await this.chargerRepository.create({
      ...chargerData(payload),
      station_id: stationId,
      status: "AVAILABLE",
      last_updated_at: new Date(),
      last_updated_source: "operator",
    });
    return chargerResponse(charger.toObject());
  }

  async updateCharger(operatorId, stationId, chargerId, payload) {
    await this.get(operatorId, stationId);
    ensureId(chargerId, "chargerId");
    const charger = await this.chargerRepository.updateForStation(
      chargerId,
      stationId,
      {
        $set: {
          ...chargerData(payload),
          last_updated_at: new Date(),
          last_updated_source: "operator",
        },
      },
    );
    if (!charger) {
      throw notFound("Charger not found");
    }
    return chargerResponse(charger);
  }

  async deleteCharger(operatorId, stationId, chargerId) {
    await this.updateCharger(operatorId, stationId, chargerId, {});
    await this.chargerRepository.updateForStation(chargerId, stationId, {
      $set: { is_deleted: true },
    });
  }

  async updatePricing(operatorId, stationId, chargerId, payload) {
    await this.get(operatorId, stationId);
    ensureId(chargerId, "chargerId");
    const effectiveFrom = payload.effectiveFrom
      ? new Date(payload.effectiveFrom)
      : new Date();
    const charger = await this.this.chargerRepository.updateForStation(
      chargerId,
      stationId,
      {
        $set: {
          price_per_kwh: payload.pricePerKwh,
          price_per_minute: payload.pricePerMinute ?? null,
          price_effective_from: effectiveFrom,
          last_updated_at: new Date(),
          last_updated_source: "operator",
        },
        $push: {
          pricing_history: {
            price_per_kwh: payload.pricePerKwh,
            price_per_minute: payload.pricePerMinute ?? null,
            effective_from: effectiveFrom,
          },
        },
      },
    );
    if (!charger) {
      throw notFound("Charger not found");
    }
    return chargerResponse(charger);
  }
}

export default new StationService();
