/* eslint-disable no-undef */
import Order from "../models/order.js";

class OrderRepository {
  create(data) {
    return Order.create(data);
  }

  findByRazorpayOrderId(razorpayOrderId) {
    return Order.findOne({ razorpay_order_id: razorpayOrderId });
  }

  updateStatus(orderId, status) {
    return Order.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true },
    );
  }

  findByUser({ userId, skip, limit }) {
    const filter = { user_id: userId };
    return Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("charger_id", "station_id price_per_kwh max_power_kw status")
        .lean(),
      Order.countDocuments(filter),
    ]);
  }
}

export default OrderRepository;
