# Chargefinder MVP PRD

## 1. Product summary

Chargefinder is a city-first EV charging discovery app for India that helps riders find compatible, working chargers with upfront pricing and live availability before they leave home.

## 2. Problem statement

EV riders waste time and lose trust because charger information is fragmented, stale, hidden, or not relevant to their vehicle. The MVP should reduce uncertainty around where to go, whether the charger works, and how much it will cost.

## 3. MVP goal

Prove that users will return to an EV charging app if it reliably answers three questions: Can I charge here? Is it working now? What will it cost?

## 4. Target users

- Primary: urban EV two-wheeler and four-wheeler owners in one launch city.
- Secondary: EV drivers planning short city trips.
- Supply-side user: CPOs who own and operate charging stations and need more discoverability and better station utilization.


## 5. Product principles

- Trust first.
- Show useful information before commitment.
- Design for Indian EV reality, especially two-wheelers.
- Start narrow, then expand.
- Keep operator workflows separate from driver workflows.


## 6. Supported vehicle types

For MVP, support only the vehicle categories needed for charging compatibility and simple user selection:

- Two-wheeler scooter.
- Two-wheeler motorcycle.
- Three-wheeler passenger or cargo EV.
- Four-wheeler hatchback, sedan, or SUV.

The app should map each vehicle type to expected connector compatibility, charging speed expectation, and charger relevance. The system should not expose every technical detail to the user; it should use the vehicle profile to filter charger results automatically.[^2][^4][^5]

## 7. Core scope

### Must have

- Phone OTP login.
- Add vehicle by manual selection.
- Optional vehicle number lookup if available.
- Add vehicle to “My Vehicles.”
- Show only saved vehicles in the app.
- Live map with nearby chargers.
- 2W / 4W toggle.
- Compatibility filtering by connector and vehicle type.
- On charger click, show estimated outcome before navigation.
- Open with maps.
- Charger detail page with availability, price, power label, and ETA.
- Fault reporting with timestamp and reason.
- After fault reporting, if someone is physically at the location, ask whether it is actually working.
- Freshness label for live data such as “3 mins ago” or “3 days ago.”


### Should have

- Save favorite chargers.
- Booking request for stations that support reservations.
- User history of visited chargers and reports.
- Community trust badge based on recent confirmations.
- Basic estimate calculator for time, cost, and availability confidence.


### Not in MVP

- Full multi-network wallet.
- Trip planner.
- Advanced route prediction.
- Multi-city rollout.
- Complex loyalty or gamification.
- Deep analytics dashboards for users.


## 8. Key user flows

### Flow 1: Find a charger

Open app -> login -> set vehicle -> save to My Vehicles -> view map -> apply 2W/4W filter -> inspect charger -> see live status, price, and power -> view ETA estimate -> navigate.

### Flow 2: Report a problem

Open charger detail -> tap report issue -> choose problem type -> submit timestamped report -> if the user is at location, confirm whether the charger is actually working -> charger status confidence updates.

### Flow 3: Booking-supported charger

Open charger detail -> view slot availability -> request booking -> receive confirmation -> navigate.

## 9. Estimation logic

The charger detail page should show an estimated result before navigation. The estimate can include:

- travel time to the charger,
- expected waiting time,
- approximate charging duration,
- approximate cost.

For MVP, use a rule-based calculator driven by charger power, connector type, and vehicle class. The calculator should be good enough to help the user decide whether the charger is worth visiting.

## 10. Data strategy

### Static data

- Station name.
- Address.
- GPS location.
- Connector types.
- Max power.
- Amenities.


### Dynamic data

- Available / in-use / unavailable status.
- Pricing.
- Session state.
- Slot availability.
- Fault status.
- Last-updated timestamp.


### Data sources

- Direct operator integrations for pilot partners.
- Manual backfill for missing static data.
- User reports for fault signals.
- Operator confirmations where possible.


### Data freshness rules

- Show last updated time on every charger card and detail page.
- Mark stale data explicitly when the last update is old.
- Prefer operator-synced data over community-only data.
- Decay old fault reports over time unless confirmed again.


## 11. CPO onboarding strategy

Chargefinder will onboard CPOs through a guided partnership process. The goal is to make it easy for a charging operator to join, share station data, and start getting discovered without heavy operational burden.

### CPO onboarding goals

- Help CPOs increase charger discoverability.
- Improve station utilization.
- Reduce support calls from confused drivers.
- Make live pricing and availability visible in Chargefinder.
- Keep the first integration small and fast.


### CPO onboarding flow

1. Partner outreach.
2. Intro call and station discovery.
3. Technical and data assessment.
4. Data mapping.
5. Sandbox or test feed validation.
6. Pilot go-live with a limited set of chargers.
7. Monitoring and support.
8. Expansion to additional stations.

### What Chargefinder asks from a CPO

- Station metadata.
- Charger count.
- Connector types.
- Power ratings.
- Pricing rules.
- Live availability feed.
- Maintenance or fault status.
- Support contact for station issues.


### What Chargefinder gives the CPO

- Visibility in the driver app.
- More nearby searches and navigation clicks.
- Station analytics at a basic level.
- A simple way to update station status if needed.
- Better trust signals from verified data.


## 12. CPO discoverability strategy

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


### First sales wedge

Start with one city and a small set of operators. The first pitch should be about proving value in a dense local market, not promising national coverage.

## 13. CPO integration model

Chargefinder should support two integration modes so the MVP can launch quickly and still scale later.

### Mode 1: Operator portal

This is the fastest MVP path.

- The CPO gets a separate web dashboard.
- The operator can update pricing, status, and maintenance mode.
- The portal shows a preview of how the station appears in Chargefinder.
- This is ideal when the CPO does not have a strong backend system.


### Mode 2: API sync

This is the scalable path.

- Chargefinder connects to the CPO’s backend or charger management system.
- Live status and pricing sync automatically.
- Manual portal updates become fallback only.
- This works best for more advanced CPOs.


### Operator portal must-have fields

- Station list.
- Connector list.
- Live status toggle.
- Pricing field.
- Maintenance mode.
- Out-of-service reason.
- Last updated timestamp.
- Station preview in the driver app.


## 14. Operator strategy

Start with 3 to 5 pilot CPOs in one city. Prioritize operators who are open to sharing live data and who can respond quickly during the pilot. Expand only after data quality, uptime reporting, and operator responsiveness are stable.

## 15. Monetization hypothesis

### Primary

CPO subscription for discovery, station listings, and operator dashboard access.

### Secondary

Promoted station placement or sponsored vendor placements once traffic exists.

### Later

Consumer premium subscription only if the app develops strong repeat usage.

### Avoid in MVP

- Coins per hour.
- App-managed charging payments as the main business model.
- “10% + ads” consumer pricing as the primary revenue strategy.

The simplest and strongest MVP revenue path is to charge the CPO, because that is the side getting immediate commercial value from discoverability and better utilization.[^3]

## 16. Launch strategy

Launch city-first in a dense EV market with enough charger supply to make discovery useful. Start with one or two network partners and expand only after live data quality is proven.

## 17. Success metrics

- Activation: percentage of users who add a vehicle and view a charger.
- Trust: percentage of charger pages with fresh live status and pricing.
- Engagement: repeat searches per user per week.
- Reliability: report rate vs confirmed faulty stations.
- Conversion: navigation clicks or booking confirmations.
- Supply: number of partner stations onboarded.
- Operator adoption: number of CPOs onboarded and actively updating data.
- Data freshness: percentage of stations updated within the freshness threshold.


## 18. Risks

- Stale or inaccurate live data.
- Too little supply in the first city.
- Low operator participation.
- Users losing trust after one bad charging experience.
- Scope creep into full wallet, planning, or payments too early.
- CPOs not adopting the portal or not updating data consistently.


## 19. MVP delivery plan

### Week 1-2

- Finalize target city and segment.
- Identify 10-20 operators/stations.
- Define data fields and partner pitch.
- Design core user flows.
- Define operator portal fields and onboarding steps.


### Week 3-5

- Build login, vehicle setup, map, detail page, and reporting.
- Build the operator portal for manual station updates.
- Integrate first live data feed or manual admin panel.
- Add freshness timestamps and compatibility logic.


### Week 6-7

- Pilot with limited users.
- Pilot with selected CPOs.
- Collect feedback on trust, data quality, and usability.
- Fix gaps in station data, portal flow, and report flow.


### Week 8

- Launch public MVP in the chosen city.
- Track activation, search volume, report quality, and CPO update frequency.


## 20. Open questions

- Which city should be the first launch market?
- Which operator will provide the first reliable live data feed?
- Which stations should be managed manually versus through API sync?
- Will the MVP support booking or only discovery?
- What is the minimum useful pricing coverage threshold?

