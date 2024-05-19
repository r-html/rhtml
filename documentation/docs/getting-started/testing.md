---
sidebar_position: 4
---

# Testing

## Testing a `@Controller`

```typescript
import { Bootstrap, get, Module } from '@rhtml/di';
import { FastifyModule } from '@rhtml/fastify';
import fastify from 'fastify';

import { HealthCheckController } from './healthcheck.controller';
import { HealthCheckService } from './healthcheck.service';
import { HealthCheckStatus } from './types';

describe('healthcheck controller', () => {
  let healthCheckController: HealthCheckController;
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    @Module({
      imports: [
        FastifyModule.forRoot(fastify, {
          logger: true,
        }),
      ],
      providers: [HealthCheckService],
      bootstrap: [HealthCheckController],
    })
    class AppModule {}

    await Bootstrap(AppModule);
    healthCheckController = get(HealthCheckController);
    healthCheckService = get(HealthCheckService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(healthCheckController).toBeDefined();
  });

  it('should call the healthcheck service', async () => {
    const response = {
      server: { status: HealthCheckStatus.WORKING },
      database: { status: 'ok' },
    } as never;
    const spy = jest
      .spyOn(healthCheckService, 'checkServicesStatus')
      .mockResolvedValue(response);
    const result = await healthCheckController.healthCheck();
    expect(spy).toHaveBeenCalled();
    expect(result).toEqual(response);
  });
});
```

The provided TypeScript code is a test suite written using the Jest framework for testing. It tests a controller called `HealthCheckController`, which utilizes `@rhtml/di` for dependency injection and `@rhtml/fastify` for web server functionality.

### Imports:

- `@rhtml/di`: Used for dependency injection.
- `@rhtml/fastify`: Used for integrating Fastify with the application.
- `fastify`: Represents the Fastify instance.
- `jest`: Testing framework.

### Describing Test Suite:

- The `describe()` function is used to group test cases related to the "healthcheck controller".

### Test Setup:

- `healthCheckController` and `healthCheckService` are declared outside the `beforeEach()` block to make them accessible across test cases.
- Inside `beforeEach()`, a module (`AppModule`) is defined using `@Module` decorator from `@rhtml/di`. It imports `FastifyModule.forRoot()` from `@rhtml/fastify` to configure Fastify.
- `HealthCheckService` is registered as a provider within the module.
- `Bootstrap(AppModule)` is awaited to initialize the module.
- Instances of `HealthCheckController` and `HealthCheckService` are obtained using `get()` function from `@rhtml/di` and assigned to `healthCheckController` and `healthCheckService` respectively.

### Test Teardown:

- `jest.restoreAllMocks()` is used in the `afterEach()` block to restore all mocked functions after each test case.

### Test Cases:

- The first test case checks if `healthCheckController` is defined.
- The second test case verifies if the `healthCheck()` method of `HealthCheckController` calls the `checkServicesStatus()` method of `HealthCheckService`. It mocks the `checkServicesStatus()` method using `jest.spyOn()` and verifies if it's called.
- It also checks if the result returned by `healthCheckController.healthCheck()` matches the expected response.

Overall, this code tests the behavior of the `HealthCheckController` by mocking its dependencies and ensuring that it interacts correctly with the `HealthCheckService`. It validates that the controller functions as expected when handling health check requests.

## Testing a `@Service`

```typescript
import { Bootstrap, Module, set } from '@rhtml/di';

import { HealthCheckService } from './healthcheck.service';
import { HealthCheckStatus } from './types';

describe('health check service', () => {
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    @Module({
      providers: [HealthCheckService],
    })
    class AppModule {}

    await Bootstrap(AppModule);

    healthCheckService = set(HealthCheckService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return WORKING status for the server and the correct status for the database', () => {
    const response = {
      server: {
        status: HealthCheckStatus.WORKING,
      },
    } as never;

    const result = healthCheckService.checkServicesStatus();

    expect(result).toEqual(response);
  });
});
```

The provided TypeScript code is a test suite written using the Jest framework for testing. It tests a service called `HealthCheckService`, which utilizes `@rhtml/di` for dependency injection.

### Imports:

- The code imports necessary modules and libraries from `@rhtml/di`.

### Describing Test Suite:

- The `describe()` function is used to group test cases related to the "health check service".

### Test Setup:

- `healthCheckService` is declared outside the `beforeEach()` block to make it accessible across test cases.
- Inside `beforeEach()`, a module (`AppModule`) is defined using `@Module` decorator from `@rhtml/di`. It only provides the `HealthCheckService` as a provider.
- `Bootstrap(AppModule)` is awaited to initialize the module.
- The `set()` function from `@rhtml/di` is used to obtain an instance of `HealthCheckService` and assign it to `healthCheckService`.

### Test Teardown:

- `jest.restoreAllMocks()` is used in the `afterEach()` block to restore all mocked functions after each test case.

### Test Case:

- The test case verifies that the `checkServicesStatus()` method of `HealthCheckService` returns the expected response.
- It defines a `response` object with the expected structure and values.
- It calls the `checkServicesStatus()` method and assigns the result to `result`.
- It asserts that the `result` matches the `response` object using `expect().toEqual()`.

Overall, this code tests the behavior of the `HealthCheckService` by verifying that its `checkServicesStatus()` method returns the expected response. It ensures that the service functions correctly when checking the status of services.
