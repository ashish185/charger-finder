/* eslint-disable no-undef */
import userService from "../services/user-service.js";
import {
  validateRegistrationPayload,
  validateRolePayload,
  validateCompleteProfilePayload,
} from "../validators/user-validator.js";
import { issueSession } from "../utils/session.js";
class UserController {
  constructor(service) {
    this.userService = service || userService;
    this.registerUser = this.handler(this._registerUser);
    this.getUser = this.handler(this._getUser);
    this.getCurrentUser = this.handler(this._getCurrentUser);
    this.updateRole = this.handler(this._updateRole);
    this.completeProfile = this.handler(this._completeProfile);
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

  async _getUser(req, res) {
    const identifier =
      req.params.identifier || req.user?.uid || req.user?.phone;
    const user = await this.userService.getByIdOrPhoneNumber(identifier);
    res.json({ success: true, data: user });
  }

  async _getCurrentUser(req, res) {
    const identifier = req.user?.phone;
    const user = await this.userService.getByIdOrPhoneNumber(identifier);
    res.json({ success: true, data: user });
  }

  async _completeProfile(req, res) {
    validateCompleteProfilePayload(req.body);
    const identifier = req.user?.uid || req.user?._id;
    const user = await this.userService.completeProfile(identifier, req.body);
    res.json({ success: true, data: user });
  }

  async _updateRole(req, res) {
    validateRolePayload(req.body);
    const identifier = req.user?._id || req.user?.uid || req.user?.phone;
    const user = await this.userService.updateRole(identifier, req.body.role);
    issueSession(res, user);
    res.json({ success: true, data: user });
  }
}

export default new UserController();
