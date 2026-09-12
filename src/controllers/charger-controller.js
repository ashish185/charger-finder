import chargerService from "../services/charger-service.js";

class ChargerController {
  constructor(service) {
    this.chargerService = service || chargerService;
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

  getCharger = async (req, res) => {
    try {
      const data = await this.chargerService.get(req.params.chargerId);
      res.json(data);
    } catch (error) {
      this.sendError(res, error);
    }
  };

  getChargerAvailabilitySlots = async (req, res) => {
    try {
      const data = await this.chargerService.getAvailabilitySlots(
        req.params.chargerId,
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  getChargerEstimate = async (req, res) => {
    try {
      const data = await this.chargerService.estimate(
        req.params.chargerId,
        req.query.slotId,
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };
}

export default new ChargerController();
