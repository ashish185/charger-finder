import reviewService from "../services/review-service.js";
import { validatePagination } from "../validators/review-validator.js";

class ReviewController {
  constructor(service) {
    this.reviewService = service || reviewService;
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

  listChargerReviews = async (req, res) => {
    try {
      const pagination = validatePagination(req.query);
      const data = await this.reviewService.listByCharger(
        req.params.chargerId,
        pagination,
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };
}

export default new ReviewController();
