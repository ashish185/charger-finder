import OperatorRepository from "../repositories/operator-repository.js";

function conflictError(message) {
  const error = new Error(message);
  error.statusCode = 409;
  error.code = "CONFLICT";
  return error;
}

function operatorData(payload) {
  return {
    businessName: payload.businessName.trim(),
    fullName: payload.fullName.trim(),
    gstNumber: payload.gstNumber.trim().toUpperCase(),
    phoneNumber: payload.phoneNumber.trim(),
    agreedToTerms: payload.agreedToTerms,
  };
}

function operatorResponse(operator) {
  return {
    operatorId: operator._id,
    businessName: operator.businessName,
    fullName: operator.fullName,
    gstNumber: operator.gstNumber,
    phoneNumber: operator.phoneNumber,
    agreedToTerms: operator.agreedToTerms,
    createdAt: operator.createdAt,
  };
}

class CpoService {
  constructor(operatorRepository) {
    this.operatorRepository = operatorRepository || new OperatorRepository();
  }

  async register(payload) {
    const [existingGst, existingPhone] = await Promise.all([
      this.operatorRepository.findByGstNumber(payload.gstNumber),
      this.operatorRepository.findByPhoneNumber(payload.phoneNumber),
    ]);
    if (existingGst) {
      throw conflictError("GST/Tax ID already registered");
    }
    if (existingPhone) {
      throw conflictError("Phone number already registered");
    }

    try {
      const operator = await this.operatorRepository.create(
        operatorData(payload),
      );
      return operatorResponse(operator.toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw conflictError("CPO already registered");
      }
      throw error;
    }
  }
}

export default new CpoService();
