import crypto from "crypto";
import mongoose from "mongoose";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import razorpayInstance from "../config/razorpay.js";
import OrderRepository from "../repositories/order-repository.js";
import ChargerRepository from "../repositories/charger-repository.js";
import chargerService from "./charger-service.js";

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

function bookingResponse(order) {
  return {
    orderId: order._id,
    chargerId: order.charger_id?._id || order.charger_id,
    stationId: order.charger_id?.station_id,
    slotId: order.slot_id,
    status: order.status,
    amount: order.amount,
    currency: order.currency,
    estimatedPrice: order.estimated_price,
    createdAt: order.createdAt,
  };
}

class BookingService {
  constructor(orderRepository, chargerRepository, chargerServiceInstance) {
    this.orderRepository = orderRepository || new OrderRepository();
    this.chargerRepository = chargerRepository || ChargerRepository;
    this.chargerService = chargerServiceInstance || chargerService;
  }

  async createBooking(userId, chargerId, slotId) {
    ensureId(chargerId, "chargerId");
    ensureId(slotId, "slotId");
    const charger = await this.chargerRepository.findById(chargerId);
    if (!charger) {
      throw notFound("Charger not found");
    }

    const slot = (charger.availability_slots || []).find(
      (item) => String(item._id) === String(slotId),
    );
    console.log("slot", slot);
    if (!slot) {
      throw notFound("Slot not found");
    }
    if (slot.status === "BOOKED") {
      throw validationError("Slot already booked");
    }

    const { estimatedCost } = await this.chargerService.estimate(
      chargerId,
      slotId,
    );

    const order = await razorpayInstance.orders.create({
      amount: Math.round(estimatedCost * 100),
      currency: "INR",
      receipt: `bk_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`,
      notes: { userId, chargerId, slotId },
    });

    const savedOrder = await this.orderRepository.create({
      user_id: userId,
      charger_id: chargerId,
      slot_id: slotId,
      razorpay_order_id: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      estimated_price: estimatedCost,
      notes: order.notes,
    });

    return {
      orderId: savedOrder._id,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      // eslint-disable-next-line no-undef
      keyId: process.env.RAZORPAY_KEY_ID,
      estimatedCost,
    };
  }

  async listMyBookings(userId, { page, limit }) {
    ensureId(userId, "userId");
    const [orders, total] = await this.orderRepository.findByUser({
      userId,
      skip: (page - 1) * limit,
      limit,
    });
    return {
      bookings: orders.map(bookingResponse),
      pagination: { page, limit, total },
    };
  }

  async handleWebhook(rawBody, signature) {
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(rawBody),
      signature,
      // eslint-disable-next-line no-undef
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );
    if (!isWebhookValid) {
      throw validationError("Webhook signature is invalid");
    }

    const paymentEntity = rawBody.payload.payment.entity;

    const order = await this.orderRepository.findByRazorpayOrderId(
      paymentEntity.order_id,
    );
    if (!order) {
      return { received: true };
    }

    await this.orderRepository.updateStatus(order._id, paymentEntity.status);

    if (paymentEntity.status === "captured") {
      await this.chargerRepository.markSlotBooked(
        order.charger_id,
        order.slot_id,
        order._id,
      );
    }

    return { received: true };
  }
}

export default new BookingService();
