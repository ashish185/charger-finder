import mongoose from "mongoose";
import ReviewRepository from "../repositories/review-repository.js";
import ChargerRepository from "../repositories/charger-repository.js";

function notFound(message) {
  const error = new Error(message);
  error.statusCode = 404;
  error.code = "NOT_FOUND";
  return error;
}

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = "VALIDATION_ERROR";
  return error;
}

function ensureId(value, name) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw validationError(`${name} is invalid`);
  }
}

function reviewResponse(review) {
  return {
    reviewId: review._id,
    userId: review.user_id?._id || review.user_id,
    userName: review.user_id?.full_name,
    chargerId: review.charger_id,
    orderId: review.order_id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.created_at,
  };
}

class ReviewService {
  constructor(reviewRepository, chargerRepository) {
    this.reviewRepository = reviewRepository || new ReviewRepository();
    this.chargerRepository = chargerRepository || ChargerRepository;
  }

  async listByCharger(chargerId, { page, limit }) {
    ensureId(chargerId, "chargerId");
    const charger = await this.chargerRepository.findById(chargerId);
    if (!charger) {
      throw notFound("Charger not found");
    }
    const [reviews, total] = await this.reviewRepository.findByCharger({
      chargerId,
      skip: (page - 1) * limit,
      limit,
    });
    return {
      reviews: reviews.map(reviewResponse),
      pagination: { page, limit, total },
    };
  }
}

export default new ReviewService();
