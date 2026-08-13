import Operator from "../models/operator.js";

class OperatorRepository {
  create(data) {
    return Operator.create(data);
  }

  findByGstNumber(gstNumber) {
    return Operator.findOne({
      gstNumber: gstNumber.toUpperCase().trim(),
    }).lean();
  }

  findByPhoneNumber(phoneNumber) {
    return Operator.findOne({ phoneNumber: phoneNumber.trim() }).lean();
  }
}

export default OperatorRepository;
