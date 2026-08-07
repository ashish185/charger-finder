# Chargefinder MVP PRD

## 1. Product summary

Chargefinder is an EV charging booking app for India that helps EV owners search, reserve, navigate to, pay for, and complete charging sessions at compatible stations. It also provides CPOs with a dedicated portal to manage station data, status, pricing, and daily acknowledgement.

## 2. Problem statement

EV drivers lose time and trust when charger data is stale, unclear, or incompatible with their vehicle. CPOs lose revenue when stations are not discoverable, not updated, or not managed through a reliable operating workflow.

## 3. MVP goal

Prove that users will book and pay in-app if the app reliably answers three questions: Can I charge here? Is it working now? What will it cost? The MVP should also prove that operators will keep station data updated if the platform makes them accountable.

## 4. Target users

- Primary: urban EV two-wheeler and four-wheeler owners in one launch city.
- Secondary: EV drivers planning short city trips.
- Supply-side user: CPOs and station owners who need bookings, visibility, and a structured operating workflow.

## 5. Product principles

- Trust first.
- Booking-first, not browsing-first.
- Show useful information before commitment.
- Design for non-technical users as well as operators.
- Keep driver workflows separate from CPO workflows.
- Make accountability visible in the product.

## 6. Supported vehicle types

For MVP, support only the vehicle categories needed for charging compatibility and simple user selection:

- Two-wheeler scooter.
- Two-wheeler motorcycle.
- Three-wheeler passenger or cargo EV.
- Four-wheeler hatchback, sedan, or SUV.

The app should map each vehicle type to connector compatibility, charging speed expectation, and charger relevance. Vehicle-to-charger matching should be standards-based, not brand-based.

## 7. Core scope

### Must have

- Phone OTP login.
- Add vehicle by manual selection.
- Optional vehicle number lookup if available.
- Add vehicle to My Vehicles.
- Show only saved vehicles in the app.
- Live map with nearby chargers.
- 2W / 4W toggle.
- Compatibility filtering by connector and vehicle type.
- On charger click, show estimated outcome before booking.
- Open with maps.
- Charger detail page with availability, price, power label, ETA, and booking option.
- Booking and payment inside the app.
- Fault reporting with timestamp and reason.
- If a fault is reported, ask whether someone on site can confirm current working status.
- Freshness label for live data such as 3 mins ago or 3 days ago.

### Should have

- Save favorite chargers.
- User history of visited chargers and bookings.
- Community trust badge based on recent confirmations.
- Basic estimate calculator for time, cost, and availability confidence.
- Receipt or invoice after payment.
- Booking and session history.

### Not in MVP

- Full multi-network wallet.
- Trip planner.
- Advanced route prediction.
- Multi-city rollout.
- Complex loyalty or gamification.
- Deep analytics dashboards for users.

## 8. Key user flows

### Flow 1: Book a charger

Open app -> login -> set vehicle -> save to My Vehicles -> view map -> apply 2W/4W filter -> inspect charger -> see live status, price, ETA, and booking slot -> book -> pay -> navigate.

### Flow 2: Start charging

Arrive at station -> authenticate via booking or QR -> start session -> track live status -> complete payment or confirm completed session -> receive invoice.

### Flow 3:Adding reviews

Open charger detail -> tap report issue -> choose problem type -> submit timestamped report -> if the user is physically at location, confirm whether the charger is actually working -> charger status confidence updates.

CPO Flow

## Chargefinder MVP Flow

### 1. CPO Registration & Login

- CPO logs into the **Chargefinder CPO Portal**.
- Only verified CPOs can access and manage their charging stations.

### 2. Station Management (CPO Portal)

The CPO creates and manages charging stations by:

- Adding new charging stations.
- Configuring charger details (connector type, power output, etc.).
- Setting pricing.
- Updating real-time availability.
- Enabling/disabling maintenance mode.
- Updating operating hours and amenities.

### 3. Daily Station Acknowledgement

- Every day, the CPO confirms that the station information is accurate.
- If no acknowledgement is received within the configured period, the station can be flagged as **"Status Not Verified"** for EV users.

### 4. Station Status Updates

Whenever something changes, the CPO updates:

- Available / Occupied
- Out of Service
- Maintenance Mode
- Pricing changes
- Temporary closure

These updates are immediately reflected in the Chargefinder platform.

###Flow1:

## 9. Estimation logic

The charger detail page should show an estimated result before booking. The estimate can include:

- travel time to the charger,
- expected waiting time,
- approximate charging duration,
- approximate cost.

For MVP, use a rule-based calculator driven by charger power, connector type, and vehicle class. The calculator should help the user decide whether the booking is worth making.

## 10. Data strategy

### Static data

- Station name.
- Address.
- GPS location.
- Connector types.
- Max power.
- Amenities.
- Booking rules.
- Payment support.
- Operating hours.

### Dynamic data

- Available / in-use / unavailable status.
- Pricing.
- Session state.
- Slot availability.
- Fault status.
- Last-updated timestamp.
- Booking confirmation status.
- Payment status.

### Data sources

- Manual station data entry through the Chargefinder CPO portal.
- Manual backfill for missing static data.
- User reports for fault signals.
- Operator confirmations through the portal.

### Data freshness rules

- Show last updated time on every charger card and detail page.
- Mark stale data explicitly when the last update is old.
- Prefer operator-confirmed data over community-only data.
- Decay old fault reports over time unless confirmed again.

## 11. CPO portal strategy

Chargefinder will provide a dedicated CPO portal instead of relying on external operator software. The portal will be used only for operator management in MVP, while EV owners continue to use the Chargefinder app for discovery, booking, payment, and charging.

### CPO portal goals

- Help CPOs increase charger discoverability.
- Improve station utilization.
- Reduce support calls from confused drivers.
- Make live pricing and availability visible in Chargefinder.
- Keep the first rollout simple and fast.
- Hold operators accountable for daily status updates.

### CPO portal flow

1. Partner outreach.
2. Intro call and station discovery.
3. Station onboarding.
4. Data mapping.
5. Portal training.
6. Pilot go-live.
7. Daily status acknowledgement.
8. Monitoring and support.
9. Expansion to additional stations.

### What Chargefinder asks from a CPO

- Station metadata.
- Charger count.
- Connector types.
- Power ratings.
- Pricing rules.
- Manual daily availability update.
- Maintenance or fault status.
- Support contact for station issues.

### What Chargefinder gives the CPO

- Visibility in the driver app.
- More nearby searches and bookings.
- Station analytics at a basic level.
- A simple way to update station status.
- Better trust signals from verified data.
- Option to rank higher if they keep data fresh and compliant.

## 12. CPO accountability model

Every CPO must acknowledge station status at least once per day. If no acknowledgement is received, the station should be marked lower confidence or stale. If a station is repeatedly shown as available but fails at the location, Chargefinder should reduce visibility, log discrepancy history, and apply commercial penalties if included in the contract.

### Accountability rules

- Daily acknowledgement required.
- Freshness threshold defined per station.
- Repeated discrepancy lowers trust score.
- Serious or repeated mismatch can lead to reduced ranking or temporary delisting.
- Discrepancy history visible to internal ops and CPOs.

## 13. Driver UX strategy

The app must speak in user language, not technical language. Use:

- Book now instead of reserve slot.
- Working now instead of sync status.
- Pay and charge instead of session settlement.
- Confirm station is open instead of operator acknowledgement.

The product should feel like a booking app, not a developer tool.

## 14. CPO discoverability strategy

CPO discoverability is both a sales motion and a supply growth loop. Chargefinder should proactively discover and recruit operators through outbound partnerships instead of waiting for CPOs to find the app on their own.

### Discovery channels

- Direct outreach to CPOs.
- LinkedIn and founder network intros.
- EV ecosystem events and community groups.
- Charger installers and hardware vendors.
- Parking operators, malls, hotels, and campus property managers.
- Partnerships with regional EV ecosystem companies.

### CPO pitch

- More station visibility.
- Better quality leads from drivers who are already nearby.
- Higher utilization from live status and upfront pricing.
- Less friction from broken or outdated station information.
- A low-effort pilot in one city.

## 15. CPO integration model

For MVP, Chargefinder will use its own CPO portal as the only operator management model. CPOs will use this portal to update station status, pricing, maintenance mode, and daily acknowledgement. EV owners will still use the Chargefinder app to discover chargers, check compatibility, book sessions, make payments, and navigate to the station.

### What this means

- Driver side stays live in MVP.
- Operator side is managed only through Chargefinder’s own portal.
- No external CPO system integration is required in MVP.
- No dependency on OSPP, OSPI, or similar external backoffice systems.
- Chargefinder owns the operator workflow and data freshness process.

### Operator portal must-have fields

- Station list.
- Connector list.
- Live status toggle.
- Pricing field.
- Maintenance mode.
- Out-of-service reason.
- Last updated timestamp.
- Booking calendar.
- Payment settlement summary.
- Station preview in the driver app.

## 16. Operator strategy

Start with 3 to 5 pilot CPOs in one city. Prioritize operators who are open to using the portal daily and who can respond quickly during the pilot. Expand only after data quality, uptime reporting, and operator responsiveness are stable.

## 17. Monetization model

### Primary revenue

- Booking fee or convenience fee on successful app bookings.
- CPO subscription for discovery, station listings, and operator portal access.
- Operator dashboard subscription for higher-value tools.

### Secondary revenue

- Top placement fee for CPOs that want higher ranking in search results.
- Featured station / sponsored slot placement.
- Relevant vendor ads such as accessories, batteries, insurance, or EV services.

### Later revenue

- Consumer premium subscription for ad-free usage, priority booking, or saved preferences.
- Premium analytics for large operators or fleets.

### Avoid in MVP

- Coins per hour as the core business model.
- Consumer-only subscription as the main revenue path.
- Generic ads that weaken trust.

The strongest model is to charge the side that gets direct commercial value: the CPO.

## 18. Launch strategy

Launch city-first in a dense EV market with enough charger supply to make booking useful. Start with one or two network partners and expand only after live data quality and booking reliability are proven.

## 19. Success metrics

- Activation: percentage of users who add a vehicle and book a charger.
- Trust: percentage of charger pages with fresh live status and pricing.
- Engagement: repeat searches per user per week.
- Reliability: report rate vs confirmed faulty stations.
- Conversion: booking confirmations and completed payment rate.
- Supply: number of partner stations onboarded.
- Operator adoption: number of CPOs onboarded and actively updating data.
- Data freshness: percentage of stations updated within the freshness threshold.

## 20. Risks

- Stale or inaccurate live data.
- Too little supply in the first city.
- Low operator participation.
- Users losing trust after one bad charging experience.
- Scope creep into full wallet, planning, or payments too early.
- CPOs not adopting the portal or not updating data consistently.

## 21. MVP delivery plan

### Week 1-2

- Finalize target city and segment.
- Identify 10-20 operators/stations.
- Define data fields and partner pitch.
- Design core user flows.
- Define operator portal fields and onboarding steps.

### Week 3-5

- Build login, vehicle setup, map, detail page, booking, and reporting.
- Build the operator portal for manual station updates.
- Add freshness timestamps and compatibility logic.
- Add payment and booking confirmation flow.

### Week 6-7

- Pilot with limited users.
- Pilot with selected CPOs.
- Collect feedback on trust, data quality, usability, booking success, and payment friction.
- Fix gaps in station data, portal flow, and report flow.

### Week 8

- Launch public MVP in the chosen city.
- Track activation, search volume, bookings, payment completion, and CPO update frequency.

## 22. Open questions

- Which city should be the first launch market?
- Which operator will provide the first reliable live data feed?
- Which stations should be managed manually versus through the portal?
- Will the MVP support booking-only or booking plus charging initiation?
- What is the minimum useful pricing coverage threshold?
- What penalty policy will be written into CPO agreements?
