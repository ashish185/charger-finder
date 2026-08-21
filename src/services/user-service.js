import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/user-repository.js";

const SALT_ROUNDS = 10;

function conflictError(message) {
  const error = new Error(message);
  error.statusCode = 409;
  error.code = "CONFLICT";
  return error;
}

function notFoundError(message) {
  const error = new Error(message);
  error.statusCode = 404;
  error.code = "NOT_FOUND";
  return error;
}

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = "VALIDATION_ERROR";
  return error;
}

function userData(payload, hashedPassword) {
  return {
    full_name: payload.fullName.trim(),
    email: payload.email ? payload.email.trim().toLowerCase() : undefined,
    password: hashedPassword,
    phone: payload.phoneNumber.trim(),
    payment_methods: payload.paymentMethods || [],
    agreed_to_terms: payload.agreedToTerms,
  };
}

function userResponse(user) {
  return {
    userId: user._id,
    fullName: user.full_name,
    email: user.email,
    phoneNumber: user.phone,
    paymentMethods: user.payment_methods || [],
    agreedToTerms: user.agreed_to_terms,
    role: user.role,
    createdAt: user.created_at,
  };
}

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  async register(payload) {
    const [existingEmail, existingPhone] = await Promise.all([
      payload.email ? this.userRepository.findByEmail(payload.email) : null,
      this.userRepository.findByPhoneNumber(payload.phoneNumber),
    ]);
    if (existingEmail) {
      throw conflictError("Email already registered");
    }
    if (existingPhone) {
      throw conflictError("Phone number already registered");
    }

    const hashedPassword = payload.password
      ? await bcrypt.hash(payload.password, SALT_ROUNDS)
      : undefined;

    try {
      const user = await this.userRepository.create(
        userData(payload, hashedPassword),
      );
      return userResponse(user.toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw conflictError("Email already registered");
      }
      throw error;
    }
  }

  async getByIdOrPhoneNumber(identifier) {
    if (!identifier) {
      throw validationError("identifier is required");
    }

    const user = mongoose.Types.ObjectId.isValid(identifier)
      ? await this.userRepository.findById(identifier)
      : await this.userRepository.findByPhoneNumber(identifier);

    if (!user) {
      throw notFoundError("User not found");
    }
    return userResponse(user);
  }
}

export default new UserService();
