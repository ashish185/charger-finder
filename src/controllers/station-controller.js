import stationService from "../services/station-service.js";
import {
  validateChargerPayload,
  validatePagination,
  validatePricingPayload,
  validateStationPayload,
} from "../validators/station-validator.js";

function operatorId(req) {
  return (
    req.user?.id || req.user?._id || req.user?.sub || "6a75f01a440d1688108bb0ec"
  );
}

function sendError(res, error) {
  return res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || "INTERNAL_ERROR",
      message: error.message || "Something went wrong",
    },
  });
}

function handler(callback) {
  return async (req, res) => {
    try {
      await callback(req, res);
    } catch (error) {
      sendError(res, error);
    }
  };
}

export const createStation = handler(async (req, res) => {
  validateStationPayload(req.body);
  const station = await stationService.create(operatorId(req), req.body);
  res.status(201).json({ success: true, data: station });
});

export const listStations = handler(async (req, res) => {
  const pagination = validatePagination(req.query);
  const data = await stationService.list(operatorId(req), {
    ...req.query,
    ...pagination,
  });
  res.json({ success: true, data });
});

export const getStation = handler(async (req, res) => {
  const data = await stationService.get(operatorId(req), req.params.stationId);
  res.json({ success: true, data });
});

export const updateStation = handler(async (req, res) => {
  validateStationPayload(req.body, { partial: true });
  const data = await stationService.update(
    operatorId(req),
    req.params.stationId,
    req.body,
  );
  res.json({ success: true, data });
});

export const deleteStation = handler(async (req, res) => {
  await stationService.delist(operatorId(req), req.params.stationId);
  res.status(204).send();
});

export const createCharger = handler(async (req, res) => {
  validateChargerPayload(req.body);
  const data = await stationService.createCharger(
    operatorId(req),
    req.params.stationId,
    req.body,
  );
  res.status(201).json({ success: true, data });
});

export const updateCharger = handler(async (req, res) => {
  validateChargerPayload(req.body, { partial: true });
  const data = await stationService.updateCharger(
    operatorId(req),
    req.params.stationId,
    req.params.chargerId,
    req.body,
  );
  res.json({ success: true, data });
});

export const deleteCharger = handler(async (req, res) => {
  await stationService.deleteCharger(
    operatorId(req),
    req.params.stationId,
    req.params.chargerId,
  );
  res.status(204).send();
});

export const updatePricing = handler(async (req, res) => {
  validatePricingPayload(req.body);
  const data = await stationService.updatePricing(
    operatorId(req),
    req.params.stationId,
    req.params.chargerId,
    req.body,
  );
  res.json({ success: true, data });
});

export const updateOperatingHours = handler(async (req, res) => {
  validateStationPayload({ operatingHours: req.body }, { partial: true });
  const data = await stationService.update(
    operatorId(req),
    req.params.stationId,
    { operatingHours: req.body },
  );
  res.json({ success: true, data });
});

export const updateAmenities = handler(async (req, res) => {
  validateStationPayload({ amenities: req.body.amenities }, { partial: true });
  const data = await stationService.update(
    operatorId(req),
    req.params.stationId,
    { amenities: req.body.amenities },
  );
  res.json({ success: true, data });
});
