/* eslint-disable no-undef */
import Pricing from "../models/pricing.js";

class PricingRepository {
  findActiveByCharger(chargerId) {
    return Pricing.findOne({ charger_id: chargerId, is_active: true }).lean();
  }

  upsertByCharger(chargerId, data) {
    return Pricing.findOneAndUpdate(
      { charger_id: chargerId },
      { $set: data },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).lean();
  }
}

export default PricingRepository;
