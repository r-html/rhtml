---
sidebar_position: 4
---

# State Management

@rhtml provides several ways to manage state in your application, from simple component state to complex global state management.

## Component State

The simplest form of state management is component-level state:

```typescript
import { Component, property } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'app-counter',
  template: () => html`
    <div>
      <p>Count: ${this.count}</p>
      <button @click=${() => this.increment()}>Increment</button>
    </div>
  `
})
export class CounterComponent extends LitElement {
  @property({ type: Number })
  count = 0;

  increment() {
    this.count++;
  }
}
```

## Service State

For state that needs to be shared between components, use services:

```typescript
import { Injectable } from '@rhtml/di';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CounterService {
  private countSubject = new BehaviorSubject<number>(0);
  count$ = this.countSubject.asObservable();

  increment() {
    this.countSubject.next(this.countSubject.value + 1);
  }

  decrement() {
    this.countSubject.next(this.countSubject.value - 1);
  }
}
```

## Using Service State in Components

```typescript
import { Component, Inject } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';
import { CounterService } from './counter.service';
import { async } from '@rxdi/lit-html';

@Component({
  selector: 'app-counter-display',
  template: () => html`
    <div>
      <p>Count: ${async(this.counterService.count$)}</p>
      <button @click=${() => this.counterService.increment()}>Increment</button>
      <button @click=${() => this.counterService.decrement()}>Decrement</button>
    </div>
  `
})
export class CounterDisplayComponent extends LitElement {
  @Inject(CounterService)
  private counterService: CounterService;
}
```

## State Management with Redux Pattern

For more complex state management, you can implement a Redux-like pattern:

```typescript
import { Injectable } from '@rhtml/di';
import { BehaviorSubject } from 'rxjs';

interface AppState {
  counter: number;
  user: User | null;
}

@Injectable()
export class StoreService {
  private stateSubject = new BehaviorSubject<AppState>({
    counter: 0,
    user: null
  });
  state$ = this.stateSubject.asObservable();

  dispatch(action: Action) {
    const newState = this.reducer(this.stateSubject.value, action);
    this.stateSubject.next(newState);
  }

  private reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
      case 'INCREMENT':
        return { ...state, counter: state.counter + 1 };
      case 'SET_USER':
        return { ...state, user: action.payload };
      default:
        return state;
    }
  }
}
```

## Using Store in Components

```typescript
import { Component, Inject } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';
import { StoreService } from './store.service';
import { async } from '@rxdi/lit-html';

@Component({
  selector: 'app-store-example',
  template: () => html`
    <div>
      <p>Count: ${async(this.store.state$.pipe(map(state => state.counter)))}</p>
      <p>User: ${async(this.store.state$.pipe(map(state => state.user?.name)))}</p>
      <button @click=${() => this.increment()}>Increment</button>
    </div>
  `
})
export class StoreExampleComponent extends LitElement {
  @Inject(StoreService)
  private store: StoreService;

  increment() {
    this.store.dispatch({ type: 'INCREMENT' });
  }
}
```

## State Management with GraphQL

@rhtml provides built-in support for GraphQL state management:

```typescript
import { Component } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'app-graphql-example',
  template: () => html`
    <r-part>
      <r-fetch query="{
        user(id: 1) {
          name
          email
          posts {
            title
            content
          }
        }
      }"></r-fetch>
      <r-render .state=${({ data }) => html`
        <div>
          <h2>${data.user.name}</h2>
          <p>${data.user.email}</p>
          <div class="posts">
            ${data.user.posts.map(post => html`
              <div class="post">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
              </div>
            `)}
          </div>
        </div>
      `}>
      </r-render>
    </r-part>
  `
})
export class GraphQLExampleComponent extends LitElement {}
```

## State Management Best Practices

1. **Choose the Right Approach**
   - Use component state for local UI state
   - Use services for shared state
   - Use Redux pattern for complex state
   - Use GraphQL for server state

2. **Keep State Immutable**
   - Always create new state objects
   - Use spread operator for updates
   - Avoid direct mutations

3. **Normalize State**
   - Keep state flat
   - Use IDs for relationships
   - Avoid nested state

4. **Use Selectors**
   - Derive computed state
   - Memoize expensive calculations
   - Keep selectors pure

5. **Handle Side Effects**
   - Use services for side effects
   - Keep components pure
   - Handle errors properly

## State Management Patterns

### Container/Presenter Pattern

```typescript
// Container Component
@Component({
  selector: 'app-user-container',
  template: () => html`
    <app-user-presenter
      .user=${this.user}
      .loading=${this.loading}
      .error=${this.error}
      @save=${(e) => this.handleSave(e.detail)}
    ></app-user-presenter>
  `
})
export class UserContainerComponent extends LitElement {
  @Inject(UserService)
  private userService: UserService;

  private user: User | null = null;
  private loading = false;
  private error: Error | null = null;

  async handleSave(user: User) {
    this.loading = true;
    try {
      await this.userService.saveUser(user);
      this.user = user;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  }
}

// Presenter Component
@Component({
  selector: 'app-user-presenter',
  template: () => html`
    <div>
      ${this.loading ? html`<p>Loading...</p>` : ''}
      ${this.error ? html`<p>Error: ${this.error.message}</p>` : ''}
      ${this.user ? html`
        <form @submit=${(e) => this.handleSubmit(e)}>
          <input .value=${this.user.name} @input=${(e) => this.updateName(e.target.value)}>
          <button type="submit">Save</button>
        </form>
      ` : ''}
    </div>
  `
})
export class UserPresenterComponent extends LitElement {
  @property({ type: Object })
  user: User | null = null;

  @property({ type: Boolean })
  loading = false;

  @property({ type: Object })
  error: Error | null = null;

  @event()
  save = new CustomEvent('save', {
    detail: this.user
  });

  updateName(name: string) {
    this.user = { ...this.user, name };
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    this.dispatchEvent(this.save);
  }
}
```

### State Machine Pattern

```typescript
import { Injectable } from '@rhtml/di';
import { BehaviorSubject } from 'rxjs';

type State = 'idle' | 'loading' | 'success' | 'error';

@Injectable()
export class StateMachineService {
  private stateSubject = new BehaviorSubject<State>('idle');
  state$ = this.stateSubject.asObservable();

  transition(state: State) {
    this.stateSubject.next(state);
  }
}
```

## Next Steps

- Learn about [Components](/docs/getting-started/components)
- Explore [Services](/docs/getting-started/services)
- Check out [Advanced Patterns](/docs/advanced/patterns)
- Understand [Testing](/docs/advanced/testing) 