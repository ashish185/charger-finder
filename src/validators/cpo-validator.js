import validator from "validator";

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const TAX_ID_REGEX = /^[A-Z0-9]{4,20}$/;

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

  requireNonEmptyString(payload.businessName, "businessName");
  requireNonEmptyString(payload.fullName, "fullName");

  requireNonEmptyString(payload.gstNumber, "gstNumber");
  const gstNumber = payload.gstNumber.trim().toUpperCase();
  if (gstNumber.length === 15) {
    if (!GSTIN_REGEX.test(gstNumber)) {
      throw validationError("gstNumber is not a valid GSTIN");
    }
  } else if (!TAX_ID_REGEX.test(gstNumber)) {
    throw validationError("gstNumber must be a valid GST/Tax ID");
  }

  requireNonEmptyString(payload.phoneNumber, "phoneNumber");
  if (!validator.isMobilePhone(payload.phoneNumber.trim(), "any")) {
    throw validationError("phoneNumber must be a valid phone number");
  }

  if (payload.agreedToTerms !== true) {
    throw validationError("agreedToTerms must be true");
  }
}
