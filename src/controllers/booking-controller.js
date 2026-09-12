import bookingService from "../services/booking-service.js";
import {
  validateCreateBookingPayload,
  validatePagination,
} from "../validators/booking-validator.js";

class BookingController {
  constructor(service) {
    this.bookingService = service || bookingService;
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

  createBooking = async (req, res) => {
    try {
      validateCreateBookingPayload(req.body);
      const data = await this.bookingService.createBooking(
        req.user.uid,
        req.body.chargerId,
        req.body.slotId,
      );
      res.json({ success: true, data });
    } catch (error) {
      console.log("err", error);
      this.sendError(res, error);
    }
  };

  listMyBookings = async (req, res) => {
    try {
      const pagination = validatePagination(req.query);
      const data = await this.bookingService.listMyBookings(
        req.user.uid,
        pagination,
      );
      res.json({ success: true, data });
    } catch (error) {
      this.sendError(res, error);
    }
  };

  webhook = async (req, res) => {
    try {
      const data = await this.bookingService.handleWebhook(
        req.body,
        req.get("X-Razorpay-Signature"),
      );
      res.status(200).json(data);
    } catch (error) {
      this.sendError(res, error);
    }
  };
}

export default new BookingController();
