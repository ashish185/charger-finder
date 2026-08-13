import {
  CHARGER_STATUSES,
  CHARGING_TYPES,
  CONNECTORS,
  VEHICLE_SIZE,
} from "../constants.js";

const CONNECTOR_TYPES = [
  "CCS2",
  "CHAdeMO",
  "Type2_AC",
  "Bharat_AC001",
  "Bharat_DC001",
];
const VEHICLE_TYPES = ["2W_scooter", "2W_motorcycle", "3W", "4W"];
const STATION_STATUSES = [
  "draft",
  "pending_review",
  "live",
  "maintenance",
  "delisted",
];

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = "VALIDATION_ERROR";
  return error;
}

function requireObject(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw validationError(`${name} is required`);
  }
}

function ensureTime(value, name) {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    throw validationError(`${name} must be in HH:mm format`);
  }
}

export function validateStationPayload(payload, { partial = false } = {}) {
  const has = (key) => Object.prototype.hasOwnProperty.call(payload, key);
  if (!partial || has("name")) {
    if (typeof payload.name !== "string" || !payload.name.trim()) {
      throw validationError("name is required");
    }
  }
  if (!partial || has("address")) {
    if (typeof payload.address !== "string" || !payload.address.trim()) {
      throw validationError("address is required");
    }
  }
  if (!partial || has("location")) {
    requireObject(payload.location, "location");
    const { lat, lng } = payload.location;
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      throw validationError(
        "location.lat and location.lng must be valid coordinates",
      );
    }
  }
  if (has("operatingHours")) {
    requireObject(payload.operatingHours, "operatingHours");
    if (!payload.operatingHours.is24x7) {
      ensureTime(payload.operatingHours.open, "operatingHours.open");
      ensureTime(payload.operatingHours.close, "operatingHours.close");
    }
  }
  if (has("amenities") && !Array.isArray(payload.amenities)) {
    throw validationError("amenities must be an array");
  }
  if (has("paymentSupport") && !Array.isArray(payload.paymentSupport)) {
    throw validationError("paymentSupport must be an array");
  }
  if (has("bookingRules")) {
    requireObject(payload.bookingRules, "bookingRules");
    for (const value of Object.values(payload.bookingRules)) {
      if (!Number.isFinite(value) || value < 0) {
        throw validationError(
          "bookingRules values must be non-negative numbers",
        );
      }
    }
  }
  if (has("status") && !STATION_STATUSES.includes(payload.status)) {
    throw validationError("status is invalid");
  }
}

export function validateChargerPayload(payload, { partial = false } = {}) {
  const has = (key) => Object.prototype.hasOwnProperty.call(payload, key);
  if (!partial || has("connectorType")) {
    if (!CONNECTOR_TYPES.includes(payload.connectorType)) {
      throw validationError("connectorType is invalid");
    }
  }
  for (const key of ["maxPowerKw", "pricePerKwh", "pricePerMinute"]) {
    if (
      has(key) &&
      payload[key] !== null &&
      (!Number.isFinite(payload[key]) || payload[key] < 0)
    ) {
      throw validationError(`${key} must be a non-negative number or null`);
    }
  }
  if (!partial) {
    for (const key of ["maxPowerKw", "pricePerKwh"]) {
      if (!Number.isFinite(payload[key]) || payload[key] < 0) {
        throw validationError(
          `${key} is required and must be a non-negative number`,
        );
      }
    }
  }
  if (has("vehicleCompatibility")) {
    if (
      !Array.isArray(payload.vehicleCompatibility) ||
      payload.vehicleCompatibility.some((type) => !VEHICLE_TYPES.includes(type))
    ) {
      throw validationError(
        "vehicleCompatibility contains an invalid vehicle type",
      );
    }
  }
}

export function validatePagination(query) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    throw validationError(
      "page must be >= 1 and limit must be between 1 and 100",
    );
  }
  if (query.status && !STATION_STATUSES.includes(query.status)) {
    throw validationError("status is invalid");
  }
  return { page, limit };
}

export function validatePricingPayload(payload) {
  if (!Number.isFinite(payload.pricePerKwh) || payload.pricePerKwh < 0) {
    throw validationError(
      "pricePerKwh is required and must be a non-negative number",
    );
  }
  if (
    payload.pricePerMinute !== null &&
    payload.pricePerMinute !== undefined &&
    (!Number.isFinite(payload.pricePerMinute) || payload.pricePerMinute < 0)
  ) {
    throw validationError(
      "pricePerMinute must be a non-negative number or null",
    );
  }
  if (
    payload.effectiveFrom &&
    Number.isNaN(Date.parse(payload.effectiveFrom))
  ) {
    throw validationError("effectiveFrom must be a valid timestamp");
  }
}

function toArray(value) {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function ensureEnumValues(values, allowed, name) {
  for (const value of values) {
    if (!allowed.includes(value)) {
      throw validationError(`${name} must be one of: ${allowed.join(", ")}`);
    }
  }
}

export function validateNearbyStationsQuery(query) {
  const { lat, lng } = query;
  if ((lat === undefined) !== (lng === undefined)) {
    throw validationError("lat and lng must be provided together");
  }
  if (
    lat !== undefined &&
    (!Number.isFinite(Number(lat)) || Number(lat) < -90 || Number(lat) > 90)
  ) {
    throw validationError("lat must be a valid latitude");
  }
  if (
    lng !== undefined &&
    (!Number.isFinite(Number(lng)) || Number(lng) < -180 || Number(lng) > 180)
  ) {
    throw validationError("lng must be a valid longitude");
  }
  if (
    query.radiusKm !== undefined &&
    (!Number.isFinite(Number(query.radiusKm)) || Number(query.radiusKm) <= 0)
  ) {
    throw validationError("radiusKm must be a positive number");
  }

  const connectorTypes = toArray(query.connectorType);
  ensureEnumValues(connectorTypes, Object.values(CONNECTORS), "connectorType");

  const chargingTypes = toArray(query.chargingType);
  ensureEnumValues(
    chargingTypes,
    Object.values(CHARGING_TYPES),
    "chargingType",
  );

  const statuses = toArray(query.chargerStatus);
  ensureEnumValues(statuses, Object.values(CHARGER_STATUSES), "chargerStatus");

  const occupancy = toArray(query.occupancy);
  ensureEnumValues(occupancy, Object.values(VEHICLE_SIZE), "occupancy");

  return {
    lat: lat !== undefined ? Number(lat) : undefined,
    lng: lng !== undefined ? Number(lng) : undefined,
    radiusKm: query.radiusKm !== undefined ? Number(query.radiusKm) : undefined,
    connectorTypes,
    chargingTypes,
    statuses,
    occupancy,
  };
}
