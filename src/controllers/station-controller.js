import stationService from "../services/station-service.js";
import {
  validateChargerPayload,
  validateNearbyStationsQuery,
  validatePagination,
  validatePricingPayload,
  validateStationPayload,
} from "../validators/station-validator.js";

class StationController {
  constructor(service) {
    this.stationService = service || stationService;
  }

  operatorId(req) {
    return (
      req.user?.id ||
      req.user?._id ||
      req.user?.sub ||
      "6a75f01a440d1688108bb0ec"
    );
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

  findNearbyStations = async (req, res) => {
    try {
      const query = validateNearbyStationsQuery(req.query);
      const data = await this.stationService.findNearby(query);
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  createStation = async (req, res) => {
    try {
      validateStationPayload(req.body);
      const station = await this.stationService.create(
        this.operatorId(req),
        req.body,
      );
      res.status(201).json({ success: true, data: station });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  listStations = async (req, res) => {
    try {
      const pagination = validatePagination(req.query);
      const data = await this.stationService.list(this.operatorId(req), {
        ...req.query,
        ...pagination,
      });
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  getStation = async (req, res) => {
    try {
      const data = await this.stationService.get(
        this.operatorId(req),
        req.params.stationId,
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  getStationCharges = async (req, res) => {
    try {
      const data = await this.stationService.listCharges(req.params.stationId);
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  updateStation = async (req, res) => {
    try {
      validateStationPayload(req.body, { partial: true });
      const data = await this.stationService.update(
        this.operatorId(req),
        req.params.stationId,
        req.body,
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  deleteStation = async (req, res) => {
    try {
      await this.stationService.delist(
        this.operatorId(req),
        req.params.stationId,
      );
      res.status(204).send();
    } catch (error) {
      this.sendError(res, error);
    }
  };

  createCharger = async (req, res) => {
    try {
      validateChargerPayload(req.body);
      const data = await this.stationService.createCharger(
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
      validateChargerPayload(req.body, { partial: true });
      const data = await this.stationService.updateCharger(
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

  deleteCharger = async (req, res) => {
    try {
      await this.stationService.deleteCharger(
        this.operatorId(req),
        req.params.stationId,
        req.params.chargerId,
      );
      res.status(204).send();
    } catch (error) {
      this.sendError(res, error);
    }
  };

  updatePricing = async (req, res) => {
    try {
      validatePricingPayload(req.body);
      const data = await this.stationService.updatePricing(
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

  updateOperatingHours = async (req, res) => {
    try {
      validateStationPayload({ operatingHours: req.body }, { partial: true });
      const data = await this.stationService.update(
        this.operatorId(req),
        req.params.stationId,
        { operatingHours: req.body },
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  updateAmenities = async (req, res) => {
    try {
      validateStationPayload(
        { amenities: req.body.amenities },
        { partial: true },
      );
      const data = await this.stationService.update(
        this.operatorId(req),
        req.params.stationId,
        { amenities: req.body.amenities },
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };
}

export default new StationController();
