import { CHARGING_TYPES, CONNECTORS, VEHICLE_SIZE } from "../constants.js";

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = "VALIDATION_ERROR";
  return error;
}

function validateChargingOptions(chargingOptions) {
  if (!Array.isArray(chargingOptions)) {
    throw validationError("chargingOptions must be an array");
  }
  for (const option of chargingOptions) {
    if (!option || typeof option !== "object") {
      throw validationError("chargingOptions entries must be objects");
    }
    if (!Object.values(CHARGING_TYPES).includes(option.chargingType)) {
      throw validationError("chargingOptions.chargingType is invalid");
    }
    if (!Object.values(CONNECTORS).includes(option.connectorType)) {
      throw validationError("chargingOptions.connectorType is invalid");
    }
  }
}

export function validateVehiclePayload(payload, { partial = false } = {}) {
  const has = (key) => Object.prototype.hasOwnProperty.call(payload, key);

  if (!partial || has("manufacturer")) {
    if (
      typeof payload.manufacturer !== "string" ||
      !payload.manufacturer.trim()
    ) {
      throw validationError("manufacturer is required");
    }
  }

  if (!partial || has("model")) {
    if (typeof payload.model !== "string" || !payload.model.trim()) {
      throw validationError("model is required");
    }
  }

  if (!partial || has("vehicleType")) {
    if (!Object.values(VEHICLE_SIZE).includes(payload.vehicleType)) {
      throw validationError("vehicleType is invalid");
    }
  }

  if (has("nickname") && typeof payload.nickname !== "string") {
    throw validationError("nickname must be a string");
  }

  if (has("variant") && typeof payload.variant !== "string") {
    throw validationError("variant must be a string");
  }

  if (
    has("registrationNumber") &&
    typeof payload.registrationNumber !== "string"
  ) {
    throw validationError("registrationNumber must be a string");
  }

  if (
    has("batteryCapacityKwh") &&
    (!Number.isFinite(payload.batteryCapacityKwh) ||
      payload.batteryCapacityKwh < 0)
  ) {
    throw validationError("batteryCapacityKwh must be a non-negative number");
  }

  if (
    has("rangeKm") &&
    (!Number.isFinite(payload.rangeKm) || payload.rangeKm < 0)
  ) {
    throw validationError("rangeKm must be a non-negative number");
  }

  if (has("isDefault") && typeof payload.isDefault !== "boolean") {
    throw validationError("isDefault must be a boolean");
  }

  if (has("chargingOptions")) {
    validateChargingOptions(payload.chargingOptions);
  }
}
