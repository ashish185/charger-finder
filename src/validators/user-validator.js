import validator from "validator";
import { ROLES } from "../constants.js";

const PAYMENT_TYPES = ["CREDIT_CARD", "DIGITAL_WALLET"];
// Admin is granted out-of-band, never through this self-service endpoint.
const SELF_ASSIGNABLE_ROLES = [
  ROLES.CUSTOMER,
  ROLES.OPERATOR,
  ROLES.PRICING_MANAGER,
];

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

export function validateCompleteProfilePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw validationError("Request body is required");
  }

  requireNonEmptyString(payload.full_name, "full_name");

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

  if (
    payload.agreed_to_terms !== undefined &&
    payload.agreed_to_terms !== true
  ) {
    throw validationError("agreed_to_terms must be true");
  }
}

export function validateRolePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw validationError("Request body is required");
  }

  requireNonEmptyString(payload.role, "role");
  if (!SELF_ASSIGNABLE_ROLES.includes(payload.role)) {
    throw validationError(
      `role must be one of: ${SELF_ASSIGNABLE_ROLES.join(", ")}`,
    );
  }
}
