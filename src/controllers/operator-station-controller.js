import operatorStationService from "../services/operator-station-service.js";
import {
  validateOperatorChargerPayload,
  validateOperatorStationPayload,
  validateOperatorStationsQuery,
} from "../validators/operator-station-validator.js";

class OperatorStationController {
  constructor(service) {
    this.operatorStationService = service || operatorStationService;
  }

  operatorId(req) {
    return req.user?.uid;
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

  createStation = async (req, res) => {
    try {
      validateOperatorStationPayload(req.body);
      const station = await this.operatorStationService.create(
        this.operatorId(req),
        req.body,
      );
      res.status(201).json({ success: true, data: station });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  updateStation = async (req, res) => {
    try {
      validateOperatorStationPayload(req.body, { partial: true });
      const station = await this.operatorStationService.update(
        this.operatorId(req),
        req.params.stationId,
        req.body,
      );
      res.json({ success: true, data: station });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  listStations = async (req, res) => {
    try {
      const pagination = validateOperatorStationsQuery(req.query);
      const data = await this.operatorStationService.list(
        this.operatorId(req),
        pagination,
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  getStation = async (req, res) => {
    try {
      const data = await this.operatorStationService.get(
        this.operatorId(req),
        req.params.stationId,
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  createCharger = async (req, res) => {
    try {
      validateOperatorChargerPayload(req.body);
      const data = await this.operatorStationService.createCharger(
        this.operatorId(req),
        req.params.stationId,
        req.body,
      );
      res.status(201).json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  updateCharger = async (req, res) => {
    try {
      validateOperatorChargerPayload(req.body, { partial: true });
      const data = await this.operatorStationService.updateCharger(
        this.operatorId(req),
        req.params.stationId,
        req.params.chargerId,
        req.body,
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };
}

export default new OperatorStationController();
