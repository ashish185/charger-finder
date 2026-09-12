function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = "VALIDATION_ERROR";
  return error;
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
  return { page, limit };
}
