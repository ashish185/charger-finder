import mongoose from "mongoose";
import StationRepository from "../repositories/station-repository.js";
import StationChargerRepository from "../repositories/station-charger-repository.js";
import {
  CHARGER_STATUSES,
  SLOT_STATUS,
  STATIONS_STATUS,
} from "../constants.js";

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
  if (payload.occupancy !== undefined) {
    data.occupancy = payload.occupancy;
  }
  if (payload.operatingHours !== undefined) {
    data.operating_hours = payload.operatingHours;
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
    amenities: station.amenities || [],
    occupancy: station.occupancy || [],
    operatingHours: station.operating_hours,
    status: station.status,
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
  if (payload.chargingType !== undefined) {
    data.charging_type = payload.chargingType;
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
  if (payload.availabilitySlots !== undefined) {
    data.availability_slots = payload.availabilitySlots.map((slot) => ({
      start: new Date(slot.start),
      end: new Date(slot.end),
      status: slot.status || SLOT_STATUS.AVAILABLE,
      order_id: slot.orderId || null,
    }));
  }
  return data;
}

function chargerResponse(charger) {
  return {
    chargerId: charger._id,
    stationId: charger.station_id,
    connectorType: charger.connector_type,
    chargingType: charger.charging_type,
    maxPowerKw: charger.max_power_kw,
    vehicleCompatibility: charger.vehicle_compatibility || [],
    pricePerKwh: charger.price_per_kwh,
    status: charger.status,
    availabilitySlots: (charger.availability_slots || []).map((slot) => ({
      slotId: slot._id,
      start: slot.start,
      end: slot.end,
      status: slot.status,
      orderId: slot.order_id,
    })),
    updatedAt: charger.updatedAt,
  };
}

class OperatorStationService {
  constructor(stationRepository, chargerRepository) {
    this.stationRepository = stationRepository || new StationRepository();
    this.chargerRepository =
      chargerRepository || new StationChargerRepository();
  }

  async create(operatorId, payload) {
    const station = await this.stationRepository.create({
      status: STATIONS_STATUS.CLOSED,
      ...stationData(payload),
      operator_id: operatorId,
    });
    return stationResponse(station.toObject(), 0);
  }

  async list(operatorId, { page, limit }) {
    const [stations, total] = await this.stationRepository.findPortfolio({
      operatorId,
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
      stationData(payload),
    );
    if (!station) {
      throw notFound("Station not found");
    }
    const chargers = await this.chargerRepository.findByStation(stationId);
    return stationResponse(station, chargers.length);
  }

  async createCharger(operatorId, stationId, payload) {
    await this.get(operatorId, stationId);
    const charger = await this.chargerRepository.create({
      ...chargerData(payload),
      station_id: stationId,
      status: CHARGER_STATUSES.AVAILABLE,
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
        ...chargerData(payload),
        last_updated_at: new Date(),
        last_updated_source: "operator",
      },
    );
    if (!charger) {
      throw notFound("Charger not found");
    }
    return chargerResponse(charger);
  }
}

export default new OperatorStationService();
