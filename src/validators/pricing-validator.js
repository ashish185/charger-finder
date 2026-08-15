function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = "VALIDATION_ERROR";
  return error;
}

export function validatePricingConfigPayload(
  payload,
  { partial = false } = {},
) {
  const has = (key) => Object.prototype.hasOwnProperty.call(payload, key);

  if (!partial || has("ratePerKwh")) {
    if (!Number.isFinite(payload.ratePerKwh) || payload.ratePerKwh < 0) {
      throw validationError(
        "ratePerKwh is required and must be a non-negative number",
      );
    }
  }

  for (const key of ["reservationFee", "platformFee", "bufferPercentage"]) {
    if (has(key) && (!Number.isFinite(payload[key]) || payload[key] < 0)) {
      throw validationError(`${key} must be a non-negative number`);
    }
  }

  if (has("chargingEfficiency")) {
    if (
      !Number.isFinite(payload.chargingEfficiency) ||
      payload.chargingEfficiency <= 0 ||
      payload.chargingEfficiency > 1
    ) {
      throw validationError(
        "chargingEfficiency must be a number between 0 (exclusive) and 1",
      );
    }
  }

  if (has("isActive") && typeof payload.isActive !== "boolean") {
    throw validationError("isActive must be a boolean");
  }
}
