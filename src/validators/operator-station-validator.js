import {
  CHARGING_TYPES,
  CONNECTORS,
  SLOT_STATUS,
  STATIONS_STATUS,
  VEHICLE_SIZE,
} from "../constants.js";

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

function ensureEnumValues(values, allowed, name) {
  for (const value of values) {
    if (!allowed.includes(value)) {
      throw validationError(`${name} must be one of: ${allowed.join(", ")}`);
    }
  }
}

const OPERATING_HOURS_PATTERN =
  /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

export function validateOperatorStationPayload(
  payload,
  { partial = false } = {},
) {
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
  if (!partial || has("operatingHours")) {
    if (
      typeof payload.operatingHours !== "string" ||
      !OPERATING_HOURS_PATTERN.test(payload.operatingHours)
    ) {
      throw validationError("operatingHours must be in HH:mm-HH:mm format");
    }
  }
  if (has("amenities")) {
    if (
      !Array.isArray(payload.amenities) ||
      payload.amenities.some((value) => typeof value !== "string")
    ) {
      throw validationError("amenities must be an array of strings");
    }
  }
  if (has("occupancy")) {
    if (!Array.isArray(payload.occupancy)) {
      throw validationError("occupancy must be an array");
    }
    ensureEnumValues(
      payload.occupancy,
      Object.values(VEHICLE_SIZE),
      "occupancy",
    );
  }
  if (has("status")) {
    ensureEnumValues(
      [payload.status],
      Object.values(STATIONS_STATUS),
      "status",
    );
  }
}

export function validateOperatorChargerPayload(
  payload,
  { partial = false } = {},
) {
  const has = (key) => Object.prototype.hasOwnProperty.call(payload, key);

  if (!partial || has("connectorType")) {
    ensureEnumValues(
      [payload.connectorType],
      Object.values(CONNECTORS),
      "connectorType",
    );
  }
  if (!partial || has("chargingType")) {
    ensureEnumValues(
      [payload.chargingType],
      Object.values(CHARGING_TYPES),
      "chargingType",
    );
  }
  if (!partial || has("maxPowerKw")) {
    if (!Number.isFinite(payload.maxPowerKw) || payload.maxPowerKw <= 0) {
      throw validationError("maxPowerKw must be a positive number");
    }
  }
  if (!partial || has("pricePerKwh")) {
    if (!Number.isFinite(payload.pricePerKwh) || payload.pricePerKwh < 0) {
      throw validationError("pricePerKwh must be a non-negative number");
    }
  }
  if (has("availabilitySlots")) {
    if (!Array.isArray(payload.availabilitySlots)) {
      throw validationError("availabilitySlots must be an array");
    }
    payload.availabilitySlots.forEach((slot, index) => {
      requireObject(slot, `availabilitySlots[${index}]`);
      const start = new Date(slot.start);
      const end = new Date(slot.end);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw validationError(
          `availabilitySlots[${index}].start and end must be valid dates`,
        );
      }
      if (start >= end) {
        throw validationError(
          `availabilitySlots[${index}].start must be before end`,
        );
      }
      if (slot.status !== undefined) {
        ensureEnumValues(
          [slot.status],
          Object.values(SLOT_STATUS),
          `availabilitySlots[${index}].status`,
        );
      }
    });
  }
}

export function validateOperatorStationsQuery(query) {
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
  return { page, limit };
}
