/* eslint-disable no-undef */
import Review from "../models/review.js";

class ReviewRepository {
  findByCharger({ chargerId, skip, limit }) {
    const filter = { charger_id: chargerId };
    return Promise.all([
      Review.find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user_id", "full_name")
        .lean(),
      Review.countDocuments(filter),
    ]);
  }
}

export default ReviewRepository;
