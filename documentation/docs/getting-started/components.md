---
sidebar_position: 2
---

# Components

Components are the building blocks of @rhtml applications. @rhtml provides two distinct component systems that serve different purposes and complexity levels.

## 🎯 Component Systems Overview

### First Generation: @rxdi/lit-html

`@rxdi/lit-html` is the foundational package that provides the core Web Components functionality. It's a pure Web Components implementation using [lit-html](https://lit.dev/) and `LitElement`, offering maximum flexibility for component definition.

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';

@Component({
  selector: 'basic-component',
  template: () => html`
    <div>
      <h1>Hello, ${this.name}!</h1>
      <p>This is a basic component using @rxdi/lit-html</p>
    </div>
  `,
})
export class BasicComponent extends LitElement {
  @property({ type: String })
  name = 'World';
}
```

**Key Characteristics:**

- Pure Web Components with lit-html templating
- Direct inheritance from `LitElement`
- Maximum flexibility and control
- Foundation for more advanced component systems
- Used when you need complete control over component behavior

### Second Generation: @rhtml/component

`@rhtml/component` is an advanced functional reactive component system that provides a completely different approach to building components. It exports only the `Component` function and uses a functional, declarative API with reactive state management.

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { Container, Injectable } from '@rxdi/core';
import { html, LitElement, property } from '@rxdi/lit-html';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
class CounterService {
  counter = 55;
}

@Component<{ counter: number }, typeof Providers, CounterComponent>({
  Settings: {
    selector: 'reactive-counter',
  },
  Providers: DefineDependencies(CounterService)(Container),
  State: function (this, [counterService]) {
    return interval(1000).pipe(
      map((value) => ({
        counter: this.counter + counterService.counter + value,
      }))
    );
  },
  Render: ([counterService]) =>
    function (this, { counter }) {
      return html`
        <div>
          <h2>Counter: ${counter}</h2>
          <p>Service Counter: ${counterService.counter}</p>
        </div>
      `;
    },
})
export class CounterComponent extends LitElement {
  @property({ type: Number })
  counter: number = 0;
}
```

**Key Characteristics:**

- Functional, declarative component definition
- Reactive state management with RxJS observables
- Dependency injection integration
- Advanced state composition
- Different API structure from traditional components
- Built on top of `@rxdi/lit-html` infrastructure

## 🔄 Framework Evolution

The @rhtml framework has evolved through two generations:

1. **@rxdi/lit-html** (First Generation)

   - Pure Web Components implementation
   - Foundation for the entire framework
   - Provides the core `@Component` decorator, `html`, `LitElement`, `property`, etc.
   - Uses lit-html for templating
   - Maximum flexibility and control

2. **@rhtml/component** (Second Generation)
   - Advanced functional reactive component system
   - Only exports `Component` function and related types
   - Uses `@rxdi/lit-html` for all other imports (`html`, `LitElement`, `property`, etc.)
   - Provides functional composition patterns
   - Enhanced reactive programming capabilities

## 📦 Package Dependencies

```typescript
// First Generation - Core Foundation (exports everything)
import { Component, html, LitElement, property } from '@rxdi/lit-html';

// Second Generation - Functional Reactive Components (only exports Component)
import { Component, DefineDependencies } from '@rhtml/component';
import { html, LitElement, property } from '@rxdi/lit-html'; // Still from @rxdi/lit-html
```

The `@rhtml/component` package extends `@rxdi/lit-html` by:

- Providing a functional component API
- Adding reactive state management with observables
- Integrating with the dependency injection system
- Supporting advanced functional composition patterns
- Better integration with RxJS and reactive programming

## 🎨 Component Examples

### Basic Component (First Generation)

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';

@Component({
  selector: 'app-greeting',
  template: () => html`
    <div>
      <h1>Hello, ${this.name}!</h1>
      <p>Welcome to @rhtml.</p>
    </div>
  `,
})
export class GreetingComponent extends LitElement {
  @property()
  name = 'World';
}
```

### Functional Reactive Component (Second Generation)

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { Container, Injectable } from '@rxdi/core';
import { html, LitElement, property } from '@rxdi/lit-html';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
class UserService {
  getUser() {
    return { name: 'John Doe', email: 'john@example.com' };
  }
}

const Providers = DefineDependencies(UserService)(Container);

@Component<{ user: any; time: number }, typeof Providers, UserComponent>({
  Settings: {
    selector: 'app-user',
  },
  Providers,
  State: function (this, [userService]) {
    return interval(1000).pipe(
      map(() => ({
        user: userService.getUser(),
        time: new Date().getSeconds(),
      }))
    );
  },
  Render: ([userService]) =>
    function (this, { user, time }) {
      return html`
        <div>
          <h2>${user.name}</h2>
          <p>Email: ${user.email}</p>
          <p>Current time: ${time}</p>
        </div>
      `;
    },
})
export class UserComponent extends LitElement {
  @property({ type: String })
  userId = '';
}
```

### Functional Composition Pattern

```typescript
import { Partial } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

const compose = <T, D = []>(selector: string, styles?: any[], deps?: D) =>
  Partial<T, D>({
    selector,
    styles,
  })(deps);

const state = () => interval(1000).pipe(map(() => new Date().getSeconds()));

@compose<number>('date-component')(state)(
  () => (date) =>
    html`
      <div>
        <p>Current seconds: ${date}</p>
      </div>
    `
)
export class DateComponent extends LitElement {}
```

## 🔧 Advanced Functional Patterns

### Component with Complex State Management

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { Container, Injectable } from '@rxdi/core';
import { html, LitElement, property } from '@rxdi/lit-html';
import { combineLatest, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
class DataService {
  getData() {
    return interval(2000).pipe(map((i) => ({ id: i, value: `Data ${i}` })));
  }
}

const Providers = DefineDependencies(DataService)(Container);

@Component<{ data: any[]; counter: number }, typeof Providers, DataComponent>({
  Settings: {
    selector: 'app-data',
  },
  Providers,
  State: function (this, [dataService]) {
    return combineLatest([dataService.getData(), interval(1000)]).pipe(
      map(([data, counter]) => ({
        data: Array.isArray(data) ? data : [data],
        counter,
      }))
    );
  },
  Render: ([dataService]) =>
    function (this, { data, counter }, setState) {
      return html`
        <div>
          <h2>Data Component</h2>
          <p>Counter: ${counter}</p>
          <button @click=${() => setState({ data, counter: counter + 1 })}>
            Increment
          </button>
          <ul>
            ${data.map(
              (item) => html` <li>${item.value} (ID: ${item.id})</li> `
            )}
          </ul>
        </div>
      `;
    },
})
export class DataComponent extends LitElement {
  @property({ type: String })
  filter = '';
}
```

### Component with Error Handling

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { Container, Injectable } from '@rxdi/core';
import { html, LitElement, property } from '@rxdi/lit-html';
import { of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
class ApiService {
  fetchData() {
    return Math.random() > 0.5
      ? of({ success: true, data: 'API Data' })
      : throwError(() => new Error('API Error'));
  }
}

const Providers = DefineDependencies(ApiService)(Container);

@Component<{ data: any; error: string | null }, typeof Providers, ApiComponent>(
  {
    Settings: {
      selector: 'app-api',
    },
    Providers,
    State: function (this, [apiService]) {
      return apiService.fetchData().pipe(
        map((data) => ({ data, error: null })),
        catchError((error) => of({ data: null, error: error.message }))
      );
    },
    Loading: () => html`<p>Loading...</p>`,
    Error: (error) => html`<p>Error: ${error}</p>`,
    Render: ([apiService]) =>
      function (this, { data, error }) {
        if (error) {
          return html`<p>Error: ${error}</p>`;
        }
        return html`
          <div>
            <h2>API Data</h2>
            <p>${data}</p>
          </div>
        `;
      },
  }
)
export class ApiComponent extends LitElement {}
```

## 🎯 When to Use Each System

### Use @rxdi/lit-html when:

- You need maximum flexibility and control
- Building simple, standalone components
- Working with pure Web Components
- You want minimal dependencies
- Learning the fundamentals of the framework
- Need traditional component patterns

### Use @rhtml/component when:

- Building complex reactive applications
- Need advanced state management with observables
- Working with functional programming patterns
- Require dependency injection integration
- Building components with complex state composition
- Need sophisticated reactive data flow

## 🔄 Migration Path

If you're starting with `@rxdi/lit-html` and want to upgrade to `@rhtml/component`:

```typescript
// Before (First Generation)
import { Component, html, LitElement, property } from '@rxdi/lit-html';

// After (Second Generation) - Note the different import structure
import { Component, DefineDependencies } from '@rhtml/component';
import { html, LitElement, property } from '@rxdi/lit-html'; // Still from @rxdi/lit-html
```

The migration requires understanding the functional API structure since `@rhtml/component` uses a completely different approach.

## 📚 Component Properties

Properties work differently in each system:

### @rxdi/lit-html Properties

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';

@Component({
  selector: 'app-user',
  template: () => html`
    <div>
      <h2>${this.user.name}</h2>
      <p>Email: ${this.user.email}</p>
    </div>
  `,
})
export class UserComponent extends LitElement {
  @property({ type: Object })
  user = {
    name: '',
    email: '',
  };
}
```

### @rhtml/component Properties

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { html, LitElement, property } from '@rxdi/lit-html';

@Component<{ displayName: string }, [], UserComponent>({
  Settings: {
    selector: 'app-user',
  },
  State: function (this) {
    return { displayName: `${this.user.name} (${this.user.email})` };
  },
  Render: () =>
    function (this, { displayName }) {
      return html`
        <div>
          <h2>${displayName}</h2>
        </div>
      `;
    },
})
export class UserComponent extends LitElement {
  @property({ type: Object })
  user = {
    name: '',
    email: '',
  };
}
```

## 🎨 Component Events

### @rxdi/lit-html Events

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';

@Component({
  selector: 'app-counter',
  template: () => html`
    <div>
      <p>Count: ${this.count}</p>
      <button @click=${() => this.increment()}>Increment</button>
    </div>
  `,
})
export class CounterComponent extends LitElement {
  @property({ type: Number })
  count = 0;

  increment() {
    this.count++;
    this.dispatchEvent(
      new CustomEvent('count-changed', {
        detail: { count: this.count },
      })
    );
  }
}
```

### @rhtml/component Events

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { html, LitElement, property } from '@rxdi/lit-html';

@Component<{ count: number }, [], CounterComponent>({
  Settings: {
    selector: 'app-counter',
  },
  State: function (this) {
    return { count: this.count };
  },
  Render: () =>
    function (this, { count }, setState) {
      return html`
        <div>
          <p>Count: ${count}</p>
          <button
            @click=${() => {
              const newCount = count + 1;
              setState({ count: newCount });
              this.dispatchEvent(
                new CustomEvent('count-changed', {
                  detail: { count: newCount },
                })
              );
            }}
          >
            Increment
          </button>
        </div>
      `;
    },
})
export class CounterComponent extends LitElement {
  @property({ type: Number })
  count = 0;
}
```

## 🔄 Component Lifecycle

### @rxdi/lit-html Lifecycle

```typescript
import { Component, html, LitElement, OnInit, OnDestroy } from '@rxdi/lit-html';

@Component({
  selector: 'app-lifecycle',
  template: () => html`
    <div>
      <h2>Lifecycle Component</h2>
      <p>Initialized: ${this.initialized}</p>
      <p>Destroyed: ${this.destroyed}</p>
    </div>
  `,
})
export class LifecycleComponent
  extends LitElement
  implements OnInit, OnDestroy
{
  @property({ type: Boolean })
  initialized = false;

  @property({ type: Boolean })
  destroyed = false;

  OnInit() {
    console.log('Component initialized');
    this.initialized = true;
  }

  OnDestroy() {
    console.log('Component destroyed');
    this.destroyed = true;
  }
}
```

### @rhtml/component Lifecycle

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { html, LitElement, property } from '@rxdi/lit-html';
import { of } from 'rxjs';

@Component({
  Settings: {
    selector: 'app-lifecycle',
  },
  State: function (this: LifecycleComponent) {
    return of({ initialized: true });
  },
  Render: () =>
    function (this, { initialized }) {
      return html`
        <div>
          <h2>Lifecycle Component</h2>
          <p>Initialized: ${initialized}</p>
        </div>
      `;
    },
})
export class LifecycleComponent extends LitElement {
  OnInit() {
    console.log('Component initialized');
  }

  OnDestroy() {
    console.log('Component destroyed');
  }
}
```

## 🎨 Component Styling

### @rxdi/lit-html Styling

```typescript
import { Component, css } from '@rxdi/lit-html';
import { html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'app-styled',
  styles: [
    css`
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .title {
        color: #2196f3;
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }
      .content {
        color: #333;
        line-height: 1.6;
      }
    `,
  ],
  template: () => html`
    <div>
      <h1 class="title">${this.title}</h1>
      <div class="content">${this.content}</div>
    </div>
  `,
})
export class StyledComponent extends LitElement {
  @property({ type: String })
  title = 'Styled Component';

  @property({ type: String })
  content = 'This component has its own styles.';
}
```

### @rhtml/component Styling

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { css } from '@rxdi/lit-html';
import { html, LitElement, property } from '@rxdi/lit-html';

@Component<{ displayTitle: string }, [], StyledComponent>({
  Settings: {
    selector: 'app-styled',
    styles: [
      css`
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .title {
          color: #2196f3;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        .content {
          color: #333;
          line-height: 1.6;
        }
      `,
    ],
  },
  State: function (this) {
    return { displayTitle: `${this.title} (Styled)` };
  },
  Render: () =>
    function (this, { displayTitle }) {
      return html`
        <div>
          <h1 class="title">${displayTitle}</h1>
          <div class="content">${this.content}</div>
        </div>
      `;
    },
})
export class StyledComponent extends LitElement {
  @property({ type: String })
  title = 'Styled Component';

  @property({ type: String })
  content = 'This component has its own styles.';
}
```

## 🧩 Component Composition

### @rxdi/lit-html Composition

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';

@Component({
  selector: 'app-dashboard',
  template: (this: DashboardComponent) => html`
    <div class="dashboard">
      <header>
        <h1>Dashboard</h1>
        <app-user-profile .user=${this.currentUser}></app-user-profile>
      </header>
      <main>
        <app-counter
          @count-changed=${(e) => this.handleCountChange(e)}
        ></app-counter>
        <app-styled
          title="Welcome"
          content="This is a composed dashboard component."
        >
        </app-styled>
      </main>
    </div>
  `,
})
export class DashboardComponent extends LitElement {
  @property({ type: Object })
  currentUser = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  handleCountChange(event: CustomEvent) {
    console.log('Count changed:', event.detail.count);
  }
}
```

### @rhtml/component Composition

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { html, LitElement, property } from '@rxdi/lit-html';

@Component({
  Settings: {
    selector: 'app-dashboard',
  },
  State: function (this: DashboardComponent) {
    return {
      userDisplay: `${this.currentUser.name} (${this.currentUser.email})`,
    };
  },
  Render: () =>
    function (this, { userDisplay }) {
      return html`
        <div class="dashboard">
          <header>
            <h1>Dashboard</h1>
            <p>User: ${userDisplay}</p>
          </header>
          <main>
            <app-counter
              @count-changed=${(e) => this.handleCountChange(e)}
            ></app-counter>
            <app-styled
              title="Welcome"
              content="This is a composed dashboard component."
            >
            </app-styled>
          </main>
        </div>
      `;
    },
})
export class DashboardComponent extends LitElement {
  @property({ type: Object })
  currentUser = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  handleCountChange(event: CustomEvent) {
    console.log('Count changed:', event.detail.count);
  }
}
```

## 🧪 Component Testing

### @rxdi/lit-html Testing

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';

@Component({
  selector: 'app-testable',
  template: () => html`
    <div>
      <h2>${this.title}</h2>
      <button @click=${() => this.handleClick()}>Click me</button>
      <p>Clicks: ${this.clickCount}</p>
    </div>
  `,
})
export class TestableComponent extends LitElement {
  @property({ type: String })
  title = 'Testable Component';

  @property({ type: Number })
  clickCount = 0;

  handleClick() {
    this.clickCount++;
    this.dispatchEvent(
      new CustomEvent('clicked', {
        detail: { count: this.clickCount },
      })
    );
  }
}

// Test file
describe('TestableComponent', () => {
  let component: TestableComponent;

  beforeEach(() => {
    component = document.createElement('app-testable') as TestableComponent;
    document.body.appendChild(component);
  });

  afterEach(() => {
    document.body.removeChild(component);
  });

  it('should increment click count', () => {
    const button = component.shadowRoot?.querySelector('button');
    const clickSpy = jest.fn();

    component.addEventListener('clicked', clickSpy);
    button?.click();

    expect(component.clickCount).toBe(1);
    expect(clickSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { count: 1 },
      })
    );
  });
});
```

### @rhtml/component Testing

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { html, LitElement, property } from '@rxdi/lit-html';
import { of } from 'rxjs';

@Component<{ clickCount: number }, [], TestableComponent>({
  Settings: {
    selector: 'app-testable',
  },
  State: function (this) {
    return of({ clickCount: this.clickCount });
  },
  Render: () =>
    function (this, { clickCount }, setState) {
      return html`
        <div>
          <h2>${this.title}</h2>
          <button
            @click=${() => {
              const newCount = clickCount + 1;
              setState({ clickCount: newCount });
              this.dispatchEvent(
                new CustomEvent('clicked', {
                  detail: { count: newCount },
                })
              );
            }}
          >
            Click me
          </button>
          <p>Clicks: ${clickCount}</p>
        </div>
      `;
    },
})
export class TestableComponent extends LitElement {
  @property({ type: String })
  title = 'Testable Component';

  @property({ type: Number })
  clickCount = 0;
}

// Test file
describe('TestableComponent', () => {
  let component: TestableComponent;

  beforeEach(() => {
    component = document.createElement('app-testable') as TestableComponent;
    document.body.appendChild(component);
  });

  afterEach(() => {
    document.body.removeChild(component);
  });

  it('should increment click count', async () => {
    await component.updateComplete;
    const button = component.shadowRoot?.querySelector('button');
    const clickSpy = jest.fn();

    component.addEventListener('clicked', clickSpy);
    button?.click();

    expect(clickSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { count: 1 },
      })
    );
  });
});
```

## 🎯 Advanced Component Patterns

### Monadic Components

For the most advanced use cases, you can use monadic components:

```typescript
import { Component } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'app-monadic',
  template: () => html`
    <r-component>
      <r-selector>monadic-counter</r-selector>
      <r-props>
        <r-prop key="initialValue" type="Number"></r-prop>
      </r-props>
      <r-state .value=${{ count: 0 }}></r-state>
      <r-render
        .state=${(s, setState) => html`
          <div>
            <h3>Count: ${s.count}</h3>
            <button @click=${() => setState({ count: s.count + 1 })}>
              Increment
            </button>
          </div>
        `}
      >
      </r-render>
    </r-component>
  `,
})
export class MonadicComponent extends LitElement {}
```

## 🎯 Best Practices

1. **Choose the Right System**

   - Use `@rxdi/lit-html` for traditional Web Components
   - Use `@rhtml/component` for functional reactive components

2. **Component Design**

   - Keep components small and focused
   - Use composition over inheritance
   - Implement proper lifecycle management
   - Follow single responsibility principle

3. **State Management**

   - Use reactive patterns for complex state in `@rhtml/component`
   - Keep component state local when possible
   - Use services for shared state
   - Implement proper cleanup

4. **Performance**
   - Use efficient rendering strategies
   - Implement proper memoization
   - Avoid expensive operations in templates
   - Use virtual scrolling for large lists

## 🚀 Next Steps

- Learn about [State Management](/docs/getting-started/state-management) for managing application state
- Explore [GraphQL Integration](/docs/advanced/graphql) for data fetching
- Check out [Custom Decorators](/docs/advanced/decorators) for extending functionality
- Understand [Testing Strategies](/docs/getting-started/testing) for testing components
