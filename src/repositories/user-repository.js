import User from "../models/user.js";

class UserRepository {
  create(data) {
    return User.create(data);
  }

  findByEmail(email) {
    return User.findOne({ email: email.toLowerCase().trim() }).lean();
  }
}

export default UserRepository;
