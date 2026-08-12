import userService from "../services/user-service.js";
import { validateRegistrationPayload } from "../validators/user-validator.js";

class UserController {
  constructor(service) {
    this.userService = service || userService;
    this.registerUser = this.handler(this._registerUser);
  }

  sendError(res, error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: {
        code: error.code || "INTERNAL_ERROR",
        message: error.message || "Something went wrong",
      },
    });
  }

  handler(method) {
    return async (req, res) => {
      try {
        await method.call(this, req, res);
      } catch (error) {
        this.sendError(res, error);
      }
    };
  }

  async _registerUser(req, res) {
    validateRegistrationPayload(req.body);
    const user = await this.userService.register(req.body);
    res.status(201).json({ success: true, data: user });
  }
}

export default new UserController();
