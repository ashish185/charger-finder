import cpoService from "../services/cpo-service.js";
import { validateRegistrationPayload } from "../validators/cpo-validator.js";

class CpoController {
  constructor(service) {
    this.cpoService = service || cpoService;
    this.registerCpo = this.handler(this._registerCpo);
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

  async _registerCpo(req, res) {
    validateRegistrationPayload(req.body);
    const operator = await this.cpoService.register(req.body);
    res.status(201).json({ success: true, data: operator });
  }
}

export default new CpoController();
