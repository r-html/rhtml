---
sidebar_position: 2
---

# Components

Components are the building blocks of @rhtml applications. They are self-contained, reusable pieces of UI that can be composed together to build complex applications.

## Basic Component

Here's a simple example of a component:

```typescript
import { Component } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';

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

## Component Properties

Properties allow components to receive data from their parent components:

```typescript
import { Component, property } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'app-user',
  template: () => html`
    <div>
      <h2>${this.user.name}</h2>
      <p>Email: ${this.user.email}</p>
      <p>Age: ${this.user.age}</p>
    </div>
  `,
})
export class UserComponent extends LitElement {
  @property({ type: Object })
  user = {
    name: '',
    email: '',
    age: 0,
  };
}
```

## Component Events

Components can emit events to communicate with their parent components:

```typescript
import { Component, property, event } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';

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

  @event()
  countChanged = new CustomEvent('count-changed', {
    detail: { count: this.count },
  });

  increment() {
    this.count++;
    this.dispatchEvent(this.countChanged);
  }
}
```

## Component Lifecycle

Components have several lifecycle hooks:

```typescript
import { Component, OnInit, OnDestroy } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'app-lifecycle',
  template: () => html`
    <div>
      <p>Component Lifecycle Demo</p>
    </div>
  `,
})
export class LifecycleComponent
  extends LitElement
  implements OnInit, OnDestroy
{
  OnInit() {
    console.log('Component initialized');
  }

  OnDestroy() {
    console.log('Component destroyed');
  }
}
```

## Component Styling

Components can have their own styles:

```typescript
import { Component, property } from '@rhtml/component';
import { html, LitElement, css } from '@rxdi/lit-html';

@Component({
  selector: 'app-styled',
  template: () => html`
    <div class="container">
      <h1 class="title">Styled Component</h1>
      <p class="content">This component has its own styles.</p>
    </div>
  `,
  styles: css`
    .container {
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    .title {
      color: #333;
      font-size: 24px;
    }
    .content {
      color: #666;
      font-size: 16px;
    }
  `,
})
export class StyledComponent extends LitElement {}
```

## Component Composition

Components can be composed together:

```typescript
import { Component } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'app-dashboard',
  template: () => html`
    <div class="dashboard">
      <app-header></app-header>
      <div class="content">
        <app-sidebar></app-sidebar>
        <app-main-content></app-main-content>
      </div>
      <app-footer></app-footer>
    </div>
  `,
})
export class DashboardComponent extends LitElement {}
```

## Component Testing

Components can be tested using testing utilities:

```typescript
import { Component } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';
import { expect } from 'chai';
import { fixture } from '@open-wc/testing';

@Component({
  selector: 'app-test',
  template: () => html`
    <div>
      <h1>Test Component</h1>
    </div>
  `,
})
export class TestComponent extends LitElement {}

describe('TestComponent', () => {
  it('renders correctly', async () => {
    const element = await fixture(html`<app-test></app-test>`);
    expect(element).to.exist;
    expect(element.shadowRoot?.querySelector('h1')).to.exist;
  });
});
```

## Advanced Component Patterns

### Monadic Components

@rhtml supports monadic components for advanced composition:

```typescript
import { Component } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'app-monadic',
  template: () => html`
    <r-component>
      <r-selector>app-monadic</r-selector>
      <r-props>
        <r-prop key="data" type="Object"></r-prop>
      </r-props>
      <r-render
        .state=${(state) => html`
          <div>
            <h1>${state.data.title}</h1>
            <p>${state.data.content}</p>
          </div>
        `}
      >
      </r-render>
    </r-component>
  `,
})
export class MonadicComponent extends LitElement {}
```

### Reactive Components

Components can be reactive using observables:

```typescript
import { Component } from '@rhtml/component';
import { property, html, LitElement } from '@rxdi/lit-html';
import { BehaviorSubject } from 'rxjs';

@Component({
  Settings: {
    selector: 'app-reactive',
  },
  State: function (this, []) {
    return this.data$;
  },
  Render: () =>
    function (this: ReactiveComponent, state, setState) {
      return html`
        <div>
          <h1>${state}</h1>
          <button @click=${() => this.updateData()}>Update</button>
        </div>
      `;
    },
})
export class ReactiveComponent extends LitElement {
  data$ = new BehaviorSubject('Initial Data');

  updateData() {
    this.data$.next('Updated Data');
  }
}
```

## Best Practices

1. **Keep Components Small and Focused**

   - Each component should have a single responsibility
   - Break down complex components into smaller ones

2. **Use TypeScript**

   - Leverage TypeScript's type system
   - Define interfaces for component props
   - Use strict type checking

3. **Follow Naming Conventions**

   - Use PascalCase for component names
   - Use kebab-case for selectors
   - Prefix component selectors with app-

4. **Document Components**

   - Add JSDoc comments
   - Document props and events
   - Include usage examples

5. **Test Components**
   - Write unit tests
   - Test component behavior
   - Test edge cases

## Common Pitfalls

1. **Avoid Complex Logic in Templates**

   - Move complex logic to methods
   - Use computed properties
   - Keep templates simple

2. **Don't Mutate Props**

   - Props should be immutable
   - Use events to communicate changes
   - Follow one-way data flow

3. **Handle Memory Leaks**

   - Clean up subscriptions
   - Remove event listeners
   - Use OnDestroy hook

4. **Optimize Performance**
   - Use shouldUpdate
   - Implement proper change detection
   - Avoid unnecessary re-renders

## Next Steps

- Learn about [Services](/docs/getting-started/services)
- Explore [Dependency Injection](/docs/getting-started/dependency-injection)
- Understand [State Management](/docs/getting-started/state-management)
- Check out [Advanced Patterns](/docs/advanced/patterns)
