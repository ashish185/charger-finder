**As a developer I want to create apis**
GET /chargers/nearby?lat&lng&radiusKm&vehicleId&type=2W|4W
-> [{ stationId, chargerId, distance, status, price, powerKw, freshness }]

GET /chargers/:chargerId -> full detail (status, price, power, ETA)
GET /chargers/:chargerId/estimate?vehicleId -> { travelTimeMin, waitTimeMin, chargeTimeMin, estimatedCost }

**Sample Data**
[./mo](../mock-database-data.js)

**Create the corresponding model**

- name of instance will be ChargerRepository.
- Add the swagger the routes
