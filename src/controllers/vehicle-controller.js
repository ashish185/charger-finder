import vehicleService from "../services/vehicle-service.js";
import { validateVehiclePayload } from "../validators/vehicle-validator.js";

class VehicleController {
  constructor(service) {
    this.vehicleService = service || vehicleService;
  }

  userId(req) {
    console.log("req", req.user);
    return req?.user?.uid;
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

  createVehicle = async (req, res) => {
    try {
      //validateVehiclePayload(req.body);
      const data = await this.vehicleService.create(this.userId(req), req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  listVehicles = async (req, res) => {
    try {
      const data = await this.vehicleService.list(this.userId(req));
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  getVehicle = async (req, res) => {
    try {
      const data = await this.vehicleService.get(
        this.userId(req),
        req.params.vehicleId,
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };
}

export default new VehicleController();
