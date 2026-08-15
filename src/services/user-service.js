import bcrypt from "bcrypt";
import UserRepository from "../repositories/user-repository.js";

const SALT_ROUNDS = 10;

function conflictError(message) {
  const error = new Error(message);
  error.statusCode = 409;
  error.code = "CONFLICT";
  return error;
}

function userData(payload, hashedPassword) {
  return {
    fullName: payload.fullName.trim(),
    email: payload.email ? payload.email.trim().toLowerCase() : undefined,
    password: hashedPassword,
    phoneNumber: payload.phoneNumber.trim(),
    paymentMethods: payload.paymentMethods || [],
    agreedToTerms: payload.agreedToTerms,
  };
}

function userResponse(user) {
  return {
    userId: user._id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    paymentMethods: user.paymentMethods || [],
    agreedToTerms: user.agreedToTerms,
    createdAt: user.createdAt,
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
}

export default new UserService();
