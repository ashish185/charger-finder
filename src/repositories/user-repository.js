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

  updateProfileById(userId, data) {
    return User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  updateRoleById(userId, role) {
    return User.findByIdAndUpdate(
      userId,
      { role: [role] },
      { new: true },
    ).lean();
  }

  updateRoleByPhoneNumber(phone, role) {
    return User.findOneAndUpdate(
      { phone: phone.trim() },
      { role: [role] },
      { new: true },
    ).lean();
  }
}

export default UserRepository;
