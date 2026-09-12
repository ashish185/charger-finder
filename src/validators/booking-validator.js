export { validatePagination } from "./review-validator.js";

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = "VALIDATION_ERROR";
  return error;
}

export function validateCreateBookingPayload(payload) {
  if (
    typeof payload.chargerId !== "string" ||
    payload.chargerId.trim() === ""
  ) {
    throw validationError("chargerId is required");
  }
  if (typeof payload.slotId !== "string" || payload.slotId.trim() === "") {
    throw validationError("slotId is required");
  }
}
