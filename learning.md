# Learning: Why Dependency Injection and Repository Pattern

This project recently moved the `StationService` to use constructor-based Dependency Injection (DI) and introduced repository classes for database access. This note explains the motivation and practical benefits.

Why DI and Repository Pattern?

- Testability: Services depend on abstract repositories (or plain objects) rather than concrete Mongoose models. During unit tests you can inject `MockStationRepository` or a stub, keeping tests fast and focused on business rules.
- Separation of concerns: Business rules belong in services. Database queries, schema validation and Mongoose specifics belong in repository classes. This keeps each layer small and focused.
- Replaceability: If you later move from Mongoose to another DB or introduce caching, only repository implementations need to change.
- Clearer dependencies: Constructor injection documents what a class needs to operate and avoids hidden, hard-to-find globals or singletons.

How it was applied here

- `services/station-service.js` now accepts `stationRepository` and `chargerRepository` in its constructor and uses `this.stationRepository` / `this.chargerRepository`.
- `repositories/station-repository.js` and `repositories/station-charger-repository.js` now export repository classes instead of singleton instances. That allows creating test doubles or alternate implementations.

How to wire in existing code

In application bootstrap or wherever `stationService` is created, instantiate and inject real repositories:

```js
import StationService from "./services/station-service.js";
import StationRepository from "./repositories/station-repository.js";
import StationChargerRepository from "./repositories/station-charger-repository.js";

const stationService = new StationService(
  new StationRepository(),
  new StationChargerRepository(),
);

export default stationService;
```

For tests, pass mocks/fakes instead:

```js
const mockRepo = {
  create: jest.fn(),
  findByIdForOperator: jest.fn(),
  findPortfolio: jest.fn(),
  updateForOperator: jest.fn(),
};
const mockChargerRepo = { create: jest.fn(), findByStation: jest.fn() };
const service = new StationService(mockRepo, mockChargerRepo);
```

Next steps

- Replace any remaining singleton service exports with explicit factory/bootstrap code that injects dependencies.
- Add a small integration test that wires the real repositories and runs one endpoint flow.

If you want, I can wire a simple `services/index.js` or a bootstrap file that instantiates and exports `stationService` with the real repositories, and update imports across controllers to use the new instance.
