import User from "../models/user.js";

class UserRepository {
  create(data) {
    return User.create(data);
  }

  findByEmail(email) {
    return User.findOne({ email: email.toLowerCase().trim() }).lean();
  }

  findByPhoneNumber(phone) {
    return User.findOne({ phone: phone.trim() }).lean();
  }

  findById(userId) {
    return User.findById(userId).lean();
  }
}

export default UserRepository;
