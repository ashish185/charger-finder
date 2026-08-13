export const ROLES = Object.freeze({
  CUSTOMER: "customer",
  OPERATOR: "operator",
  ADMIN: "admin",
  PRICING_MANAGER: "pricing_manager",
});

export const CHARGING_TYPES = Object.freeze({
  AC: "AC",
  DC: "DC",
});

export const CONNECTORS = Object.freeze({
  TYPE_2: "Type 2",
  CCS2: "CCS2",
});

export const CHARGER_STATUSES = Object.freeze({
  AVAILABLE: "AVAILABLE",
  IN_USE: "IN_USE",
  UNAVAILABLE: "UNAVAILABLE",
});

export const VEHICLE_SIZE = Object.freeze({
  TWO_WHEELER_SCOOTER: "two_wheeler_scooter",
  TWO_WHEELER_MOTORCYCLE: "two_wheeler_motorcycle",
  THREE_WHEELER: "three_wheeler",
  FOUR_WHEELER_HATCHBACK: "four_wheeler_hatchback",
  FOUR_WHEELER_SEDAN: "four_wheeler_sedan",
  FOUR_WHEELER_SUV: "four_wheeler_suv",
});

export const STATIONS_STATUS = Object.freeze({
  OPEN: "open",
  CLOSED: "closed",
  FULLY_BOOKED: "fully_booked",
});
