import pricingService from "../services/pricing-service.js";
import { validatePricingConfigPayload } from "../validators/pricing-validator.js";

function operatorId(req) {
  return (
    req.user?.id || req.user?._id || req.user?.sub || "6a75f01a440d1688108bb0ec"
  );
}

class PricingController {
  constructor(service) {
    this.pricingService = service || pricingService;
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

  getChargerPricing = async (req, res) => {
    try {
      const data = await this.pricingService.get(
        operatorId(req),
        req.params.chargerId,
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  upsertChargerPricing = async (req, res) => {
    try {
      validatePricingConfigPayload(req.body);
      const data = await this.pricingService.upsert(
        operatorId(req),
        req.params.chargerId,
        req.body,
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };
}

export default new PricingController();
