import validator from "validator";

const PLUG_TYPES = ["CCS", "NACS"];
const PAYMENT_TYPES = ["CREDIT_CARD", "DIGITAL_WALLET"];

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = "VALIDATION_ERROR";
  return error;
}

function requireNonEmptyString(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw validationError(`${name} is required`);
  }
}

export function validateRegistrationPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw validationError("Request body is required");
  }

  requireNonEmptyString(payload.fullName, "fullName");

  requireNonEmptyString(payload.phoneNumber, "phoneNumber");
  if (!validator.isMobilePhone(payload.phoneNumber.trim(), "any")) {
    throw validationError("phoneNumber must be a valid phone number");
  }

  if (payload.email !== undefined) {
    requireNonEmptyString(payload.email, "email");
    if (!validator.isEmail(payload.email.trim())) {
      throw validationError("email must be a valid email address");
    }
  }

  if (payload.password !== undefined) {
    requireNonEmptyString(payload.password, "password");
    if (!validator.isStrongPassword(payload.password)) {
      throw validationError(
        "password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
      );
    }
  }

  if (payload.vehicleMake !== undefined) {
    requireNonEmptyString(payload.vehicleMake, "vehicleMake");
  }

  if (
    payload.plugType !== undefined &&
    !PLUG_TYPES.includes(payload.plugType)
  ) {
    throw validationError(`plugType must be one of: ${PLUG_TYPES.join(", ")}`);
  }

  if (payload.paymentMethods !== undefined) {
    if (!Array.isArray(payload.paymentMethods)) {
      throw validationError("paymentMethods must be an array");
    }
    for (const [index, method] of payload.paymentMethods.entries()) {
      if (!method || typeof method !== "object" || Array.isArray(method)) {
        throw validationError(`paymentMethods[${index}] must be an object`);
      }
      if (!PAYMENT_TYPES.includes(method.type)) {
        throw validationError(
          `paymentMethods[${index}].type must be one of: ${PAYMENT_TYPES.join(", ")}`,
        );
      }
      requireNonEmptyString(
        method.provider,
        `paymentMethods[${index}].provider`,
      );
    }
  }

  if (payload.agreedToTerms !== undefined && payload.agreedToTerms !== true) {
    throw validationError("agreedToTerms must be true");
  }
}
