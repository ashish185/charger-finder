/* eslint-disable no-undef */

// ChargeHub — MongoDB mock data seed script (mongosh)
// Matches the V5 TDD schema (§5.1 ERD, §5.6 data model): Order terminology,
// no sessions collection, refund fields on payments.
// Run with: mongosh "<connection-string>" ChargeHub_MockData.js

use("dev");

// ---------------------------------------------------------------------
// MongoDB ObjectIds are generated once and reused across collections below so
// the documents link to each other using native `_id` values.
// ---------------------------------------------------------------------
const user_id1 = ObjectId();
const user_id2 = ObjectId();

const vehicle_id1 = ObjectId();
const vehicle_id2 = ObjectId();

const operator_id1 = ObjectId();

const station_id1 = ObjectId();
const station_id2 = ObjectId();

const charger_id1 = ObjectId();
const charger_id2 = ObjectId();
const charger_id3 = ObjectId();

const order_id1 = ObjectId();
const order_id2 = ObjectId();

const payment_id1 = ObjectId();
const payment_id2 = ObjectId();

const review_id1 = ObjectId();
const favorite_id1 = ObjectId();
const favorite_id2 = ObjectId();
const fault_report_id1 = ObjectId();
const acknowledgement_id1 = ObjectId();
const acknowledgement_id2 = ObjectId();
const trust_score_id1 = ObjectId();
const trust_score_id2 = ObjectId();

// ---------------------------------------------------------------------
// users
// ---------------------------------------------------------------------
db.users.insertMany([
  {
    _id: user_id1,
    phone: "+919876543210",
    created_at: ISODate("2026-06-01T08:15:00Z"),
  },
  {
    _id: user_id2,
    phone: "+919123456780",
    created_at: ISODate("2026-06-03T14:40:00Z"),
  },
]);

// ---------------------------------------------------------------------
// vehicles
// ---------------------------------------------------------------------
db.vehicles.insertMany([
  {
    _id: vehicle_id1,
    user_id: user_id1,
    type: "2W_SCOOTER",
    connector_types: ["Type2"],
    charging_speed_class: "FAST",
    registration_number: "MH12AB1234",
  },
  {
    _id: vehicle_id2,
    user_id: user_id2,
    type: "4W_HATCHBACK",
    connector_types: ["CCS2"],
    charging_speed_class: "RAPID",
    registration_number: "MH14CD5678",
  },
]);

// ---------------------------------------------------------------------
// operators  (CPOs)
// ---------------------------------------------------------------------
db.operators.insertMany([
  {
    _id: operator_id1,
    name: "GreenVolt Charging Pvt Ltd",
    contact: "ops@greenvolt.in",
  },
]);

// ---------------------------------------------------------------------
// stations
// ---------------------------------------------------------------------
db.stations.insertMany([
  {
    _id: station_id1,
    operator_id: operator_id1,
    name: "GreenVolt - Andheri West",
    address: "Link Road, Andheri West, Mumbai, MH 400058",
    location: { type: "Point", coordinates: [72.8296, 19.1358] },
    amenities: ["Parking", "Restroom", "Cafe"],
    operating_hours: "06:00-23:00",
  },
  {
    _id: station_id2,
    operator_id: operator_id1,
    name: "GreenVolt - BKC Complex",
    address: "Bandra Kurla Complex, Mumbai, MH 400051",
    location: { type: "Point", coordinates: [72.8656, 19.0668] },
    amenities: ["Parking", "24x7 Security"],
    operating_hours: "00:00-23:59",
  },
]);
// index used by ChargerAvailabilityService (nearby queries reference station location)
db.stations.createIndex({ location: "2dsphere" });

// ---------------------------------------------------------------------
// chargers  (top-level collection, not embedded — every other collection
// below references charger_id directly, which is awkward against an
// embedded array, so ChargerService owns chargers as their own documents)
// ---------------------------------------------------------------------
db.chargers.insertMany([
  {
    _id: charger_id1,
    station_id: station_id1,
    connector_type: "Type2",
    max_power_kw: 7.4,
    status: "AVAILABLE",
    price_per_kwh: 18.5,
    last_updated_at: ISODate("2026-08-05T06:10:00Z"),
    last_updated_source: "CPO_PORTAL",
    fault_flag: false,
  },
  {
    _id: charger_id2,
    station_id: station_id1,
    connector_type: "CCS2",
    max_power_kw: 50,
    status: "IN_USE",
    price_per_kwh: 22.0,
    last_updated_at: ISODate("2026-08-05T07:45:00Z"),
    last_updated_source: "CPO_PORTAL",
    fault_flag: false,
  },
  {
    _id: charger_id3,
    station_id: station_id2,
    connector_type: "CCS2",
    max_power_kw: 60,
    status: "UNAVAILABLE",
    price_per_kwh: 21.0,
    last_updated_at: ISODate("2026-08-04T18:00:00Z"),
    last_updated_source: "ADMIN",
    fault_flag: true,
  },
]);

// ---------------------------------------------------------------------
// orders  (formerly "bookings" — full lifecycle incl. charging + refund states)
// unique index prevents double-booking the same slot (§5.4 Concurrency Handling)
// ---------------------------------------------------------------------
db.orders.insertMany([
  {
    _id: order_id1,
    user_id: user_id1,
    charger_id: charger_id1,
    vehicle_id: vehicle_id1,
    slot_start: ISODate("2026-08-05T09:00:00Z"),
    slot_end: ISODate("2026-08-05T09:30:00Z"),
    status: "COMPLETED",
    estimated_cost: 140.5,
    charging_started_at: ISODate("2026-08-05T09:02:00Z"),
    charging_completed_at: ISODate("2026-08-05T09:28:00Z"),
    created_at: ISODate("2026-08-05T08:40:00Z"),
  },
  {
    _id: order_id2,
    user_id: user_id2,
    charger_id: charger_id3,
    vehicle_id: vehicle_id2,
    slot_start: ISODate("2026-08-06T11:00:00Z"),
    slot_end: ISODate("2026-08-06T11:45:00Z"),
    status: "REFUNDED",
    estimated_cost: 310.0,
    charging_started_at: null,
    charging_completed_at: null,
    created_at: ISODate("2026-08-06T10:15:00Z"),
  },
]);

// ---------------------------------------------------------------------
// payments
// ---------------------------------------------------------------------
db.payments.insertMany([
  {
    _id: payment_id1,
    order_id: order_id1,
    gateway_payment_id: "pay_NqX8f7T3kLm2Ab",
    amount: 140.5,
    status: "SUCCESS",
    refund_id: null,
    refund_amount: null,
    invoice_url: "https://cdn.chargehub.in/invoices/ord-1.pdf",
    created_at: ISODate("2026-08-05T08:41:10Z"),
  },
  {
    _id: payment_id2,
    order_id: order_id2,
    gateway_payment_id: "pay_R7yV2sQ9wPz1Cd",
    amount: 310.0,
    status: "REFUNDED",
    refund_id: "rfnd_T2mK8xL4nQw0Ef",
    refund_amount: 310.0,
    invoice_url: "https://cdn.chargehub.in/invoices/ord-2.pdf",
    created_at: ISODate("2026-08-06T10:16:00Z"),
  },
]);

// ---------------------------------------------------------------------
// reviews
// ---------------------------------------------------------------------
db.reviews.insertMany([
  {
    _id: review_id1,
    user_id: user_id1,
    charger_id: charger_id1,
    order_id: order_id1,
    rating: 5,
    comment: "Charger worked exactly as shown, no waiting.",
    created_at: ISODate("2026-08-05T09:35:00Z"),
  },
]);

// ---------------------------------------------------------------------
// favorites
// ---------------------------------------------------------------------
db.favorites.insertMany([
  {
    _id: favorite_id1,
    user_id: user_id1,
    charger_id: charger_id1,
    created_at: ISODate("2026-08-05T09:36:00Z"),
  },
  {
    _id: favorite_id2,
    user_id: user_id2,
    charger_id: charger_id2,
    created_at: ISODate("2026-08-04T20:10:00Z"),
  },
]);
db.favorites.createIndex({ user_id: 1, charger_id: 1 }, { unique: true });

// ---------------------------------------------------------------------
// fault_reports
// ---------------------------------------------------------------------
db.fault_reports.insertMany([
  {
    _id: fault_report_id1,
    charger_id: charger_id3,
    station_id: station_id2,
    user_id: user_id2,
    reason_code: "NOT_CHARGING",
    reported_at: ISODate("2026-08-04T17:55:00Z"),
    confirmed_on_site_at: ISODate("2026-08-04T17:57:00Z"),
    confirmed_working: false,
    decay_at: ISODate("2026-08-07T17:55:00Z"),
  },
]);
db.fault_reports.createIndex({ decay_at: 1 }, { expireAfterSeconds: 0 });

// ---------------------------------------------------------------------
// acknowledgements  (CPO daily status confirmation, PRD §12)
// ---------------------------------------------------------------------
db.acknowledgements.insertMany([
  {
    _id: acknowledgement_id1,
    station_id: station_id1,
    operator_id: operator_id1,
    ack_date: ISODate("2026-08-05T00:00:00Z"),
    acknowledged_at: ISODate("2026-08-05T07:05:00Z"),
    status: "ACKNOWLEDGED",
  },
  {
    _id: acknowledgement_id2,
    station_id: station_id2,
    operator_id: operator_id1,
    ack_date: ISODate("2026-08-05T00:00:00Z"),
    acknowledged_at: null,
    status: "MISSED",
  },
]);

// ---------------------------------------------------------------------
// trust_scores
// ---------------------------------------------------------------------
db.trust_scores.insertMany([
  {
    _id: trust_score_id1,
    charger_id: charger_id1,
    confirmation_count_7d: 6,
    fault_count_7d: 0,
    missed_ack_count_7d: 0,
    avg_rating: 4.8,
    visibility_status: "NORMAL",
    score: 92,
  },
  {
    _id: trust_score_id2,
    charger_id: charger_id3,
    confirmation_count_7d: 1,
    fault_count_7d: 3,
    missed_ack_count_7d: 1,
    avg_rating: 2.1,
    visibility_status: "REDUCED",
    score: 38,
  },
]);

print(
  "ChargeHub mock data seeded: users, vehicles, operators, stations, chargers, orders, payments, reviews, favorites, fault_reports, acknowledgements, trust_scores",
);
