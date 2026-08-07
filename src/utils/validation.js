// utils/validation.js: Contains request validation logic for auth and profile inputs.
import validator from "validator";

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  const errors = {};

  if (!firstName) {
    errors.firstName = "First name is required";
  }

  if (!lastName) {
    errors.lastName = "Last name is required";
  }

  if (!emailId) {
    errors.emailId = "Email is required";
  } else if (!validator.isEmail(emailId)) {
    errors.emailId = "Email is not valid";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (!validator.isStrongPassword(password)) {
    errors.password =
      "Password must be at least 8 characters and include upper/lowercase letters, numbers, and symbols";
  }

  return Object.keys(errors).length ? errors : null;
};

export { validateSignUpData };
