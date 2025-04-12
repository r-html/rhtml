# Reactive HTML

### Packages

| Package                                                | Description                                                            |
| ------------------------------------------------------ | ---------------------------------------------------------------------- |
| [@rhtml/di](packages/di)                               | IOC container                                                          |
| [@rhtml/component](packages/component)                 | Main reactive component for building UI                                |
| [@rhtml/components](packages/components)               | Declarative monadic approach defining WC using html                    |
| [@rhtml/operators](packages/operators)                 | Useful declarative operators like `for` `if`                           |
| [@rhtml/graphql](packages/graphql)                     | Declarative Graphql for executing `query` `mutation` or `subscription` |
| [@rhtml/hooks](packages/hooks)                         | React like hooks for use inside web components                         |
| [@rhtml/renderer](packages/renderer)                   | Main renderer for every component used also with observables           |
| [@rhtml/schematics](packages/schematics)               | Angular like schematics for component generation using DI container    |
| [@rhtml/experiments](packages/experiments)             | Declarative way of defining web components only with HTML              |
| [@rhtml/decorators](packages/decorators)               | Useful decorators @HostListener and @Input                             |
| [@rhtml/modifiers](packages/modifiers)                 | Modifiers created using Custom HTML Attributes                         |
| [@rhtml/custom-attributes](packages/custom-attributes) | Create your own custom Attributes                                      |

#### Installation

```bash
npm i @rhtml/operators @rhtml/components @rhtml/hooks @rhtml/graphql
```

#### Usage

```typescript
import { LitElement, Component, html } from '@rxdi/lit-html';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

import '@rhtml/operators';
import '@rhtml/components';
import '@rhtml/hooks';
import '@rhtml/graphql';

interface State {
  counter: number;
}
interface NotificationState {
  data: { notifications: { appUpdated: string | number } };
}
@Component({
  selector: 'r-html-view',
  template(this: RHtmlViewComponent) {
    return html`
      <r-renderer
        .options=${{
          state: new BehaviorSubject({ counter: 1 }).pipe(delay(1700)),
          render: (res: State, setState: (res: State) => State) =>
            html`
              <button
                @click=${() => setState({ counter: res.counter + res.counter })}
              >
                Increment
              </button>
              ${res.counter}
            `,
          loading: () =>
            html`
              Loading...
            `,
          error: () =>
            html`
              Error
            `
        }}
      ></r-renderer>

      <r-for .of=${['IterableItem 1', 'Iterable Item 2']}>
        <r-let
          .item=${v => html`
            ${v}
          `}
        ></r-let>
      </r-for>

      <r-part>
        <r-state .value=${'Kristiyan Tachev'}></r-state>
        <r-render
          .state=${name => html`
            <p>${name}</p>
          `}
        >
        </r-render>
      </r-part>

      <r-part>
        <r-settings .value=${{ fetchPolicy: 'cache-first' }}></r-settings>
        <r-fetch .query=${`{ continents { name } }`}></r-fetch>
        <r-render
          .state=${({ data: { continents } }) => html`
            <r-for .of=${continents}>
              <r-let .item=${({ name }) => name}></r-let>
            </r-for>
          `}
        >
        </r-render>
      </r-part>

      <r-part>
        <r-fetch .subscribe=${`{ notifications { appUpdated } }`}></r-fetch>
        <r-render
          .state=${(
            {
              data: {
                notifications: { appUpdated }
              }
            },
            setState: (s: NotificationState) => void
          ) => html`
            <p>${appUpdated}</p>
            <button
              @click=${() => {
                setState({
                  data: {
                    notifications: {
                      appUpdated: Number(appUpdated) + Number(appUpdated)
                    }
                  }
                });
              }}
            >
              Increment Subscriptions State x2
            </button>
            (will be overriten when server emit new state)
          `}
        >
        </r-render>
      </r-part>
    `;
  }
})
export class RHtmlViewComponent extends LitElement {}
```

## Setup Graphql Client

To set configuration on bundle time we need to get settings without `barrel` export,
this way we can set configuration before Graphql module loads configuration
Keep it in mind that this is the default configuration for GraphqlClient

```typescript
import { setConfig } from '@rhtml/graphql/settings';

setConfig({
  config: {
    uri: 'https://countries.trevorblades.com/',
    pubsub: 'wss://pubsub.youvolio.com/subscriptions',
    async onRequest() {
      return new Headers();
    }
  },
  defaults: {
    error: e => {
      return html`
        <p style="color: black">
          ${e}
        </p>
      `;
    },
    loading: () => {
      return html`
        <div style="text-align: center;">
          <rx-loading palette="danger"></rx-loading>
        </div>
      `;
    }
  }
});

import '@rhtml/graphql';
```

Later on you can use `r-fetch` component to specify `query`, `mutation`, `subscription`

```html
<r-part>
  <r-fetch .subscribe=${`{ notifications { appUpdated } }`}></r-fetch>
  <r-render .state=${({ data: { notifications: { appUpdated } } }, setState: (s: NotificationState) => void) => html`
    <p>${appUpdated}</p>
    <button
      @click=${() => {
        setState({
          data: {
            notifications: {
              appUpdated: Number(appUpdated) + Number(appUpdated)
            }
          }
        });
      }}
    >
      Increment Subscriptions State x2
    </button>
    (will be overriten when server emit new state)
  `}>
  </r-render>
</r-part>
```

##### Dependency Injection

```
npm i @rhtml/di
```

```ts
import '@abraham/reflection';

import { Inject, Injectable, InjectionToken } from '@rhtml/di';
import { Bootstrap, Component, Module } from '@rhtml/di/module';

type UserId = number;
const UserId = new InjectionToken<UserId>();

const now = Date.now();

@Injectable()
export class UserService {
  constructor(@Inject(UserId) public userId: number) {
    console.log('[UserService]', userId);
  }
}

@Component()
class AppComponent {
  constructor(public userService: UserService) {
    console.log('[AppComponent] ', userService.userId);
  }

  OnInit() {
    console.log('[AppComponent] Init');
  }

  OnDestroy() {
    console.log('[AppComponent] Destroy');
  }
}

@Module({
  providers: [
    UserService,
    {
      provide: UserId,
      useFactory: () =>
        new Promise<number>(resolve => setTimeout(() => resolve(1234), 1000))
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

Bootstrap(AppModule).then(() =>
  console.log('Started', `after ${Date.now() - now}`)
);
```


# AI Generated Documentation which is 95% correct


# @rhtml - Modern Web Components Framework

> A powerful, type-safe framework for building modern web applications using Web Components with the simplicity of React and the power of TypeScript.

## 🚀 Features

- 🎯 **Type-Safe Templates** - Full TypeScript support in your templates
- 🧩 **True Encapsulation** - Leveraging Web Components standards
- 🎨 **Scoped Styles** - CSS encapsulation without leaks
- ⚡ **Reactive by Design** - Efficient updates with fine-grained reactivity
- 🛠 **Powerful Modifiers** - Flexible layout system with Angular-inspired modifiers
- 🏗 **Component-First** - Everything is a component
- 📦 **Zero Configuration** - Works out of the box
- 🔍 **Developer Friendly** - Excellent IDE support and debugging experience

## 📦 Installation

```bash
npm install @rxdi/lit-html @rhtml/modifiers
```

## 🎯 Quick Start

```typescript
import { Component, css, html, LitElement } from '@rxdi/lit-html';
import { FlexLayout } from '@rhtml/modifiers';

@Component({
  selector: 'hello-world',
  styles: [
    css`
      :host {
        display: block;
      }
      .greeting {
        color: var(--primary-color, #2196f3);
      }
    `
  ],
  template(this: HelloWorld) {
    return html`
      <div class="greeting">
        Hello, ${this.name}!
      </div>
    `;
  }
})
export class HelloWorld extends LitElement {
  @property()
  name: string = 'World';
}
```

## 🎨 Key Concepts

### Type-Safe Templates

@rhtml ensures type safety in your templates by leveraging TypeScript:

```typescript
// ✅ Good Practice - Type-safe template
@Component({
  template(this: MyComponent) {
    return html`
      <div>${this.message}</div>
      <button @click=${() => this.handleClick()}>Click me</button>
    `;
  }
})
export class MyComponent extends LitElement {
  @property()
  message: string = 'Hello';

  handleClick() {
    console.log('Clicked!');
  }
}

// ❌ Bad Practice - No type checking
@Component({
  template() { // Missing type information
    return html`
      <div>${this.message}</div> // TypeScript can't verify this exists
    `;
  }
})
```

### Component Registration

Components must be explicitly registered to be used:

```typescript
@Component({
  selector: 'app-root',
  components: [ChildComponent], // Register child components
  template(this: AppRoot) {
    return html`
      <child-component></child-component>
    `;
  }
})
export class AppRoot extends LitElement {}
```

### Reactive Properties

@rhtml provides a simple yet powerful reactivity system:

```typescript
export class UserProfile extends LitElement {
  // Simple property
  @property()
  name: string = '';

  // Property with options
  @property({ 
    type: Number,
    reflect: true, // Reflects to attribute
    attribute: 'user-age' // Custom attribute name
  })
  age: number = 0;

  // Computed property
  get isAdult() {
    return this.age >= 18;
  }
}
```

### Flexible Layouts with Modifiers

@rhtml includes powerful layout modifiers inspired by Angular Flex Layout:

```typescript
@Component({
  selector: 'flex-layout-demo',
  modifiers: [...FlexLayout], // Enable flex layout modifiers
  template(this: FlexLayoutDemo) {
    return html`
      <div 
        fxLayout="row" 
        fxLayoutAlign="space-between center"
        fxLayoutGap="16px">
        <div fxFlex="1 1 auto">Flexible item</div>
        <div fxFlex="0 0 auto">Fixed width item</div>
      </div>
    `;
  }
})
```

### Scoped Styles

CSS is properly scoped to components:

```typescript
@Component({
  styles: [
    css`
      :host {
        display: block;
        padding: 16px;
      }

      /* Styles only affect this component */
      .local-class {
        color: blue;
      }

      /* Style slotted content */
      ::slotted(*) {
        margin: 8px;
      }
    `
  ]
})
```

### Event Handling

Clean and type-safe event handling:

```typescript
@Component({
  template(this: TodoItem) {
    return html`
      <div class="todo-item">
        <input 
          type="checkbox"
          .checked=${this.completed}
          @change=${this.handleToggle}
        >
        <span class=${this.completed ? 'completed' : ''}>
          ${this.text}
        </span>
        <button @click=${this.handleDelete}>Delete</button>
      </div>
    `;
  }
})
export class TodoItem extends LitElement {
  @property()
  text: string = '';

  @property()
  completed: boolean = false;

  handleToggle(e: Event) {
    const target = e.target as HTMLInputElement;
    this.completed = target.checked;
    this.dispatchEvent(new CustomEvent('toggle'));
  }

  handleDelete() {
    this.dispatchEvent(new CustomEvent('delete'));
  }
}
```

### Component Communication

Components can communicate through properties and events:

```typescript
// Parent Component
@Component({
  components: [TodoItem],
  template(this: TodoList) {
    return html`
      ${this.todos.map(todo => html`
        <todo-item
          .text=${todo.text}
          .completed=${todo.completed}
          @toggle=${() => this.toggleTodo(todo.id)}
          @delete=${() => this.deleteTodo(todo.id)}
        ></todo-item>
      `)}
    `;
  }
})
```

## 🏗 Best Practices

### 1. Component Organization

```typescript
// ✅ Good - Clear separation of concerns
@Component({
  selector: 'user-profile',
  components: [AvatarComponent, UserStatsComponent],
  styles: [css`...`],
  template(this: UserProfile) {
    return html`...`;
  }
})

// ❌ Bad - Mixed concerns
@Component({
  template() {
    return html`
      <style>
        /* Inline styles - Don't do this */
      </style>
    `;
  }
})
```

### 2. State Management

```typescript
// ✅ Good - Clear state management
export class TodoList extends LitElement {
  @property()
  todos: Todo[] = [];

  addTodo(text: string) {
    this.todos = [...this.todos, { id: Date.now(), text, completed: false }];
  }

  // State updates trigger re-render automatically
  toggleTodo(id: number) {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }
}
```

### 3. Performance Optimization

```typescript
// ✅ Good - Optimized rendering
@Component({
  template(this: ProductList) {
    return html`
      ${repeat(
        this.products,
        product => product.id, // Key function for efficient updates
        product => html`
          <product-item .product=${product}></product-item>
        `
      )}
    `;
  }
})
```

## 🔧 Advanced Features

### Custom Directives

Create reusable template functionality:

```typescript
// Create a custom directive
const timeout = directive((callback: () => void, ms: number) => (part: Part) => {
  setTimeout(callback, ms);
});

// Use in template
@Component({
  template(this: MyComponent) {
    return html`
      <div>
        ${timeout(() => this.update(), 1000)}
        Content updates after 1 second
      </div>
    `;
  }
})
```

### Async Templates

Handle asynchronous data elegantly:

```typescript
@Component({
  template(this: AsyncDemo) {
    return html`
      ${until(
        this.fetchData(),
        html`<loading-spinner></loading-spinner>`,
        html`<error-message></error-message>`
      )}
    `;
  }
})
export class AsyncDemo extends LitElement {
  async fetchData() {
    const response = await fetch('/api/data');
    const data = await response.json();
    return html`<data-display .data=${data}></data-display>`;
  }
}
```

## 🎭 Custom Attributes and Modifiers

### Custom Attributes

@rhtml provides a powerful system for creating custom attributes that can extend HTML elements:

```typescript
import { CustomAttributeRegistry, Attribute, Modifier } from '@rhtml/custom-attributes';

@Modifier({
  selector: 'background'
})
export class BackgroundColor extends Attribute {
  OnInit() {
    this.setColor();
  }

  OnDestroy() {
    this.element.style.backgroundColor = null;
  }

  OnUpdate(oldValue: string, newValue: string) {
    this.setColor();
  }

  private setColor() {
    this.element.style.backgroundColor = this.value;
  }
}

@Component({
  selector: 'my-component',
  modifiers: [BackgroundColor],
  template(this: MyComponent) {
    return html`
      <div background="red">Colored background</div>
    `;
  }
})
export class MyComponent extends LitElement {}
```

### Built-in Layout Modifiers

#### FlexLayout

Inspired by Angular's Flex Layout system:

```typescript
import { FlexLayout } from '@rhtml/modifiers';

@Component({
  selector: 'flex-demo',
  modifiers: [...FlexLayout],
  template(this: FlexDemo) {
    return html`
      <div 
        fxLayout="row" 
        fxLayoutAlign="space-between center"
        fxLayoutGap="16px"
        fxLayout.xs="column">
        <div fxFlex="1 1 auto">Responsive item</div>
        <div fxFlex="0 0 auto">Fixed width</div>
      </div>
    `;
  }
})
```

#### AngularLayout

Provides Angular-style structural directives:

```typescript
import { AngularLayout } from '@rhtml/modifiers';

@Component({
  selector: 'conditional-demo',
  modifiers: [...AngularLayout],
  template(this: ConditionalDemo) {
    return html`
      <div ngIf=${this.showContent}>
        Conditional content
      </div>
      <button @click=${() => this.toggle()}>Toggle</button>
    `;
  }
})
export class ConditionalDemo extends LitElement {
  @state()
  showContent: boolean = false;

  toggle() {
    this.showContent = !this.showContent;
  }
}
```

### Creating Custom Modifiers

You can create modifiers with various features:

#### Basic Modifier

```typescript
@Modifier({
  selector: 'hover'
})
export class Hoverable extends Attribute {
  @Input()
  effect: string;

  @HostListener('mouseenter')
  enter(event: Event) {
    this.element.classList.add(this.effect);
  }

  @HostListener('mouseleave')
  leave(event: Event) {
    this.element.classList.remove(this.effect);
  }
}
```

#### Responsive Modifier with Media Queries

```typescript
@Modifier({
  selector: 'color'
})
export class Color extends MediaQueryAttribute<Styles> {
  OnInit() {
    this.modify();
    super.OnInit();
  }

  OnEnterMediaQuery([event, attribute]: MediaQueryEvent) {
    this.value = attribute.value;
    this.modify();
  }

  OnExitMediaQuery([event, selector]: ExitMediaQueryAttributes) {
    this.value = this.originalValue;
    this.modify();
  }

  private modify() {
    this.setStyles({ color: this.value })(this.element);
  }
}

// Usage with breakpoints
<div color="red" color.xs="green" color.md="blue">
  Responsive text
</div>
```

#### Observable Properties

```typescript
@Modifier({
  selector: 'watch'
})
export class Watcher extends Attribute {
  @Input({ observe: true })
  value: string;

  OnUpdateAttribute(name: string, value: string) {
    console.log(`Property ${name} changed to: ${value}`);
  }
}
```

#### DOM Mutation Observer

```typescript
@Modifier({
  selector: 'observer',
  observe: {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-value']
  }
})
export class ContentObserver extends Attribute {
  OnChange(records: MutationRecord[]) {
    console.log('DOM changes:', records);
  }
}
```

### Available Breakpoints

Media query breakpoints for responsive modifiers:

| Breakpoint | Media Query |
|------------|-------------|
| xs | screen and (max-width: 599px) |
| sm | screen and (min-width: 600px) and (max-width: 959px) |
| md | screen and (min-width: 960px) and (max-width: 1279px) |
| lg | screen and (min-width: 1280px) and (max-width: 1919px) |
| xl | screen and (min-width: 1920px) |
| lt-sm | screen and (max-width: 599px) |
| lt-md | screen and (max-width: 959px) |
| lt-lg | screen and (max-width: 1279px) |
| lt-xl | screen and (max-width: 1919px) |
| gt-xs | screen and (min-width: 600px) |
| gt-sm | screen and (min-width: 960px) |
| gt-md | screen and (min-width: 1280px) |
| gt-lg | screen and (min-width: 1920px) |

## 🎠 Decorators

@rhtml provides powerful decorators for enhanced component functionality and DOM interaction.

### @HostListener

Listen to DOM events directly in your components or attributes:

```typescript
import { Component, LitElement } from '@rxdi/lit-html';
import { HostListener } from '@rhtml/decorators';

@Component({
  selector: 'interactive-component',
  template(this: InteractiveComponent) {
    return html`
      <div>Hover or click me!</div>
    `;
  }
})
export class InteractiveComponent extends LitElement {
  @HostListener('mouseenter')
  onEnter() {
    console.log('Mouse entered');
  }

  @HostListener('mouseleave')
  onLeave() {
    console.log('Mouse left');
  }

  @HostListener('click')
  onClick(event: MouseEvent) {
    console.log('Clicked!', event);
  }
}
```

### @HostBinding and @Input

Combine reactive properties with direct DOM bindings:

```typescript
import { Attribute, Input, Modifier } from '@rhtml/custom-attributes';
import { HostBinding } from '@rhtml/decorators';

@Modifier({
  selector: 'dynamic-styles'
})
export class DynamicStyles extends Attribute {
  @Input({ observe: true })
  @HostBinding('style.padding')
  padding: string;

  @Input({ observe: true })
  @HostBinding('style.color')
  textColor: string;

  @Input({ observe: true })
  @HostBinding('style.background')
  backgroundColor: string;
}

// Usage in template
@Component({
  modifiers: [DynamicStyles],
  template(this: StyledComponent) {
    return html`
      <div 
        dynamic-styles
        padding="16px"
        textColor="white"
        backgroundColor="blue">
        Styled content
      </div>
    `;
  }
})
```

### Combining Decorators in Modifiers

Create powerful, reactive modifiers by combining decorators:

```typescript
@Modifier({
  selector: 'interactive'
})
export class InteractiveModifier extends Attribute {
  @Input({ observe: true })
  @HostBinding('class.active')
  isActive: boolean = false;

  @Input({ observe: true })
  effect: string = 'highlight';

  @HostListener('mouseenter')
  onEnter() {
    this.element.classList.add(this.effect);
  }

  @HostListener('mouseleave')
  onLeave() {
    this.element.classList.remove(this.effect);
  }

  @HostListener('click')
  onClick() {
    this.isActive = !this.isActive;
    this.dispatchEvent(new CustomEvent('activeChange', { 
      detail: this.isActive 
    }));
  }
}

// Usage
@Component({
  modifiers: [InteractiveModifier],
  template(this: MyComponent) {
    return html`
      <div 
        interactive
        effect="pulse"
        @activeChange=${(e: CustomEvent) => this.handleActiveChange(e)}>
        Interactive Element
      </div>
    `;
  }
})
```

### Best Practices with Decorators

1. **Reactive Properties**
```typescript
// ✅ Good - Observable property with type safety
@Input({ observe: true })
@HostBinding('style.transform')
scale: string;

// ❌ Bad - Manual DOM manipulation
@HostListener('click')
onClick() {
  this.element.style.transform = 'scale(1.1)';
}
```

2. **Event Handling**
```typescript
// ✅ Good - Type-safe event handling
@HostListener('click')
onClick(event: MouseEvent) {
  event.preventDefault();
  this.handleClick();
}

// ❌ Bad - Missing event typing
@HostListener('click')
onClick(event: any) {
  // Type-unsafe code
}
```

3. **Property Observation**
```typescript
// ✅ Good - Reactive property with change detection
@Input({ observe: true })
@HostBinding('class.visible')
isVisible: boolean;

// ❌ Bad - Manual property tracking
private _isVisible: boolean;
set isVisible(value: boolean) {
  this._isVisible = value;
  this.element.classList.toggle('visible', value);
}
```

### Advanced Decorator Patterns

#### Combining Multiple Host Bindings
```typescript
@Modifier({
  selector: 'responsive'
})
export class ResponsiveModifier extends Attribute {
  @Input({ observe: true })
  @HostBinding('style.display')
  display: string = 'flex';

  @Input({ observe: true })
  @HostBinding('style.flexDirection')
  direction: string = 'row';

  @Input({ observe: true })
  @HostBinding('style.gap')
  gap: string = '8px';

  @HostListener('window:resize')
  onResize() {
    this.direction = window.innerWidth < 600 ? 'column' : 'row';
  }
}
```

## 🌌 Monadic Components

@rhtml introduces a revolutionary approach to building web components using functional programming principles and monadic composition. This experimental feature allows you to create components directly in HTML without writing controller logic.

### Core Concepts

Monadic components follow these fundamental rules:
1. They act as containers with scoped logic
2. Operators are pure components representing program settings
3. The monad container creates composable logic based on provided operators
4. Logic is cleaned up after composition
5. Components are declarative and self-contained

### Declarative Component Creation

Create components purely in HTML:

```html
<r-component>
  <r-selector>user-card</r-selector>
  <r-props>
    <r-prop key="name" type="String"></r-prop>
    <r-prop key="age" type="Number"></r-prop>
  </r-props>
  <r-render .state=${(s) => html`
    <div class="card">
      <h2>${s.name}</h2>
      <p>Age: ${s.age}</p>
    </div>
  `}>
  </r-render>
</r-component>
```

### Service Components

A revolutionary concept of "fire and forget" components that self-destruct after initialization:

```typescript
import { LitServiceElement } from '@rhtml/experiments';

@Component({
  selector: 'user-service'
})
export class UserService extends LitServiceElement {
  async getUserById(id: number) {
    return { id, name: 'John Doe' };
  }
}

// Usage in template
html`
  <user-service .run=${async function(this: UserService) {
    const user = await this.getUserById(123);
    console.log(user);
  }}></user-service>
`
```

### Stateful Components

Create components with built-in state management:

```html
<r-part>
  <r-state .value=${{ loading: true, userId: 1, user: {} }}></r-state>
  <r-render .state=${({ userId, loading, user }, setState) => html`
    <user-service .run=${async function() {
      const userData = await this.getUserById(userId);
      setState({
        userId,
        user: userData,
        loading: false
      });
    }}></user-service>

    ${loading ? html`
      <loading-spinner></loading-spinner>
    ` : html`
      <div class="user-info">
        <h2>${user.name}</h2>
        <p>ID: ${user.id}</p>
      </div>
    `}
  `}>
  </r-render>
</r-part>
```

### Component Hydration

Convert HTML templates to Web Components:

```typescript
import { Hydrate } from '@rhtml/experiments';

const UserProfile = html`
  <r-component>
    <r-selector>user-profile</r-selector>
    <r-props>
      <r-prop key="userId" type="String"></r-prop>
    </r-props>
    <r-render .state=${({ loading, userId, user }) => html`
      <user-service .run=${async function() {
        const userData = await this.getUserById(userId);
        this.setState({ user: userData, loading: false });
      }}></user-service>
      
      ${loading ? 'Loading...' : html`
        <div class="profile">
          <img src=${user.avatar} alt="Profile">
          <h2>${user.name}</h2>
        </div>
      `}
    `}>
    </r-render>
  </r-component>
`;

// Hydrate and type
Hydrate(UserProfile);

// TypeScript interface
export declare class UserProfileComponent extends LitElement {
  userId: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'user-profile': UserProfileComponent;
  }
}
```

### Monadic Component Structure

The hierarchical structure of monadic components:

```
┌─────────────────────────────────────────┐
│              r-component                │
│            (Root Container)             │
│                  │                      │
├──────────┬───────┴─────────┬───────────┤
│          │                 │           │
│  r-selector          r-template    r-props
│  (Operator)          (Operator)    (Monad)
│                                        │
│                                   r-prop
│                                   (Monad)
│                                        │
│                              ┌────────┴────────┐
│                              │                 │
│                           r-key            r-value
│                        (Operator)         (Operator)
└─────────────────────────────────────────────────┘
```

### Benefits of Monadic Components

1. **Declarative Development**
   - Write components directly in HTML
   - Clear separation of concerns
   - Self-documenting structure

2. **Service Integration**
   - Components as services
   - Clean up after execution
   - Reusable API integrations

3. **State Management**
   - Built-in state handling
   - Reactive updates
   - Predictable data flow

4. **Type Safety**
   - Full TypeScript support
   - Compile-time checking
   - IDE autocompletion

## 🔮 GraphQL Integration

@rhtml provides a revolutionary approach to GraphQL integration, allowing you to write queries directly in your HTML templates using monadic components.

### Declarative Data Fetching

Query your GraphQL API directly in templates:

```typescript
import '@rhtml/components';
import '@rhtml/operators';
import '@rhtml/graphql';

@Component({
  selector: 'continent-list',
  template(this: ContinentList) {
    return html`
      <r-part>
        <r-settings .value=${{ fetchPolicy: 'cache-first' }}></r-settings>
        <r-fetch query="{
          continents {
            name
            countries {
              code
              name
            }
          }
        }"></r-fetch>
        <r-render .state=${({ data: { continents } }) => html`
          <div class="continents">
            ${continents.map(continent => html`
              <div class="continent">
                <h2>${continent.name}</h2>
                <ul>
                  ${continent.countries.map(country => html`
                    <li>${country.name} (${country.code})</li>
                  `)}
                </ul>
              </div>
            `)}
          </div>
        `}>
        </r-render>
      </r-part>
    `;
  }
})
```

### Real-time Subscriptions

Handle GraphQL subscriptions seamlessly:

```typescript
@Component({
  template(this: NotificationComponent) {
    return html`
      <r-part>
        <r-fetch .subscribe=${`
          subscription {
            notifications {
              message
              timestamp
            }
          }
        `}></r-fetch>
        <r-render .state=${({ data: { notifications } }, setState) => html`
          <div class="notification">
            <p>${notifications.message}</p>
            <small>${new Date(notifications.timestamp).toLocaleString()}</small>
          </div>
        `}>
        </r-render>
      </r-part>
    `;
  }
})
```

### Mutations with State Updates

Execute mutations and update local state:

```typescript
@Component({
  template(this: TodoComponent) {
    return html`
      <r-part>
        <r-state .value=${{ todos: [] }}></r-state>
        <r-fetch .mutation=${`
          mutation AddTodo($text: String!) {
            addTodo(text: $text) {
              id
              text
              completed
            }
          }
        `}></r-fetch>
        <r-render .state=${({ todos }, setState) => html`
          <form @submit=${async (e: Event) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const text = new FormData(form).get('todo');
            
            const result = await this.addTodo({ text });
            setState({
              todos: [...todos, result.data.addTodo]
            });
            form.reset();
          }}>
            <input name="todo" placeholder="New todo...">
            <button type="submit">Add</button>
          </form>
          
          <ul>
            ${todos.map(todo => html`
              <li class=${todo.completed ? 'completed' : ''}>
                ${todo.text}
              </li>
            `)}
          </ul>
        `}>
        </r-render>
      </r-part>
    `;
  }
})
```

### Fetch Policies and Caching

Configure how data is fetched and cached:

```typescript
@Component({
  template(this: UserProfile) {
    return html`
      <r-part>
        <r-settings .value=${{
          fetchPolicy: 'cache-first',
          errorPolicy: 'all',
          notifyOnNetworkStatusChange: true
        }}></r-settings>
        <r-fetch query=${`
          query GetUser($id: ID!) {
            user(id: $id) {
              name
              email
              avatar
            }
          }
        `} .variables=${{ id: this.userId }}></r-fetch>
        <r-render .state=${({ loading, error, data }) => html`
          ${loading ? html`
            <loading-spinner></loading-spinner>
          ` : error ? html`
            <error-message .error=${error}></error-message>
          ` : html`
            <div class="profile">
              <img src=${data.user.avatar} alt=${data.user.name}>
              <h2>${data.user.name}</h2>
              <p>${data.user.email}</p>
            </div>
          `}
        `}>
        </r-render>
      </r-part>
    `;
  }
})
```

### Benefits of Template-First GraphQL

1. **Seamless Integration**
   - Write queries directly in templates
   - Immediate visibility of data structure
   - No context switching between files

2. **Type Safety**
   - Full TypeScript support
   - Automatic type inference from queries
   - Compile-time validation

3. **Developer Experience**
   - Clear data dependencies
   - Collocated queries and UI
   - Easy to understand and maintain

4. **Performance**
   - Smart caching out of the box
   - Optimized network requests
   - Real-time updates with subscriptions

### Best Practices

1. **Query Organization**
```typescript
// ✅ Good - Clear query structure
<r-fetch query=${`
  query {
    users {
      id
      name
      # Clear field selection
      profile {
        avatar
        bio
      }
    }
  }
`}></r-fetch>

// ❌ Bad - Messy query
<r-fetch query="{ users { id name profile { avatar bio } } }">
</r-fetch>
```

2. **Error Handling**
```typescript
// ✅ Good - Comprehensive error handling
<r-render .state=${({ loading, error, data }) => html`
  ${error ? html`
    <error-display 
      .message=${error.message}
      .code=${error.extensions?.code}>
    </error-display>
  ` : null}
`}>
</r-render>

// ❌ Bad - No error handling
<r-render .state=${({ data }) => html`
  ${data.users.map(user => html`...`)}
`}>
</r-render>
```

3. **Loading States**
```typescript
// ✅ Good - Handle all states
<r-render .state=${({ loading, error, data }) => html`
  ${loading ? html`
    <loading-spinner></loading-spinner>
  ` : error ? html`
    <error-message></error-message>
  ` : html`
    <data-display .data=${data}></data-display>
  `}
`}>
</r-render>
```

### Advanced GraphQL Patterns

#### Pagination with Cursor

```typescript
@Component({
  template(this: PaginatedList) {
    return html`
      <r-part>
        <r-state .value=${{
          items: [],
          pageInfo: { hasNextPage: true },
          cursor: null
        }}></r-state>
        <r-fetch query=${`
          query GetItems($cursor: String) {
            items(first: 10, after: $cursor) {
              edges {
                node {
                  id
                  title
                  description
                }
                cursor
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `} .variables=${{ cursor: this.cursor }}></r-fetch>
        <r-render .state=${({ items, pageInfo }, setState) => html`
          <div class="items-list">
            ${items.map(item => html`
              <item-card .data=${item}></item-card>
            `)}
            
            ${pageInfo.hasNextPage ? html`
              <button @click=${() => setState({ 
                cursor: pageInfo.endCursor 
              })}>
                Load More
              </button>
            ` : null}
          </div>
        `}>
        </r-render>
      </r-part>
    `;
  }
})
```

#### Real-time Chat with Subscriptions and Optimistic Updates

```typescript
@Component({
  template(this: ChatRoom) {
    return html`
      <r-part>
        <r-state .value=${{ messages: [], currentUser: null }}></r-state>
        
        <!-- Subscribe to new messages -->
        <r-fetch .subscribe=${`
          subscription OnNewMessage($roomId: ID!) {
            messageAdded(roomId: $roomId) {
              id
              text
              sender {
                id
                name
                avatar
              }
              timestamp
            }
          }
        `} .variables=${{ roomId: this.roomId }}></r-fetch>

        <!-- Mutation for sending messages -->
        <r-fetch .mutation=${`
          mutation SendMessage($roomId: ID!, $text: String!) {
            sendMessage(roomId: $roomId, text: $text) {
              id
              text
              sender {
                id
                name
                avatar
              }
              timestamp
            }
          }
        `}></r-fetch>

        <r-render .state=${({ messages, currentUser }, setState) => html`
          <div class="chat-container">
            <div class="messages">
              ${messages.map(msg => html`
                <message-bubble 
                  .message=${msg}
                  ?is-mine=${msg.sender.id === currentUser.id}>
                </message-bubble>
              `)}
            </div>

            <form @submit=${async (e: Event) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const text = new FormData(form).get('message');

              // Optimistic update
              const optimisticMsg = {
                id: 'temp-' + Date.now(),
                text,
                sender: currentUser,
                timestamp: new Date().toISOString(),
                __typename: 'Message'
              };

              setState({
                messages: [...messages, optimisticMsg]
              });

              try {
                await this.sendMessage({
                  roomId: this.roomId,
                  text
                });
                form.reset();
              } catch (error) {
                // Revert optimistic update on error
                setState({
                  messages: messages.filter(m => m.id !== optimisticMsg.id)
                });
              }
            }}>
              <input name="message" placeholder="Type a message...">
              <button type="submit">Send</button>
            </form>
          </div>
        `}>
        </r-render>
      </r-part>
    `;
  }
})
```

#### Complex Data Dependencies with Fragment Composition

```typescript
@Component({
  template(this: Dashboard) {
    return html`
      <r-part>
        <r-fetch query=${`
          query DashboardData($userId: ID!) {
            user(id: $userId) {
              ...UserProfile
              teams {
                ...TeamInfo
                projects {
                  ...ProjectStats
                  tasks {
                    ...TaskDetails
                  }
                }
              }
            }
          }

          fragment UserProfile on User {
            id
            name
            role
            avatar
          }

          fragment TeamInfo on Team {
            id
            name
            membersCount
            leader {
              ...UserProfile
            }
          }

          fragment ProjectStats on Project {
            id
            name
            status
            progress
            deadline
            metrics {
              completedTasks
              totalTasks
              hoursLogged
            }
          }

          fragment TaskDetails on Task {
            id
            title
            status
            priority
            assignee {
              ...UserProfile
            }
          }
        `} .variables=${{ userId: this.currentUserId }}></r-fetch>
        <r-render .state=${({ data: { user } }) => html`
          <dashboard-layout>
            <user-profile 
              slot="sidebar"
              .user=${user}>
            </user-profile>

            <team-overview
              slot="main"
              .teams=${user.teams}>
            </team-overview>

            <project-grid
              slot="content"
              .projects=${user.teams.flatMap(t => t.projects)}>
            </project-grid>

            <task-list
              slot="sidebar-right"
              .tasks=${user.teams
                .flatMap(t => t.projects)
                .flatMap(p => p.tasks)}>
            </task-list>
          </dashboard-layout>
        `}>
        </r-render>
      </r-part>
    `;
  }
})
```

#### Error Boundaries and Retry Logic

```typescript
@Component({
  template(this: ResilientQuery) {
    return html`
      <r-part>
        <r-settings .value=${{
          errorPolicy: 'all',
          retryPolicy: {
            maxAttempts: 3,
            backoff: attempt => Math.min(1000 * Math.pow(2, attempt), 30000)
          },
          notifyOnNetworkStatusChange: true
        }}></r-settings>
        <r-fetch query=${this.query} .variables=${this.variables}></r-fetch>
        <r-render .state=${({ loading, error, data, networkStatus }, setState) => html`
          <error-boundary>
            ${networkStatus === 'retry' ? html`
              <retry-notice 
                .attempt=${networkStatus.attempt}
                .nextRetry=${networkStatus.nextRetryMs}>
              </retry-notice>
            ` : null}

            ${error ? html`
              <error-display
                .error=${error}
                @retry=${() => setState({ refetch: true })}>
              </error-display>
            ` : loading ? html`
              <loading-spinner></loading-spinner>
            ` : html`
              <query-result .data=${data}></query-result>
            `}
          </error-boundary>
        `}>
        </r-render>
      </r-part>
    `;
  }
})
```

## @rhtml/component: Advanced Component Architecture

`@rhtml/component` provides a powerful abstraction layer over `@rxdi/lit-html` components, enabling advanced features like dependency injection, reactive state management, and Redux integration.

### Core Features

- **Dependency Injection Container Agnostic**: Not tied to any specific DI container
- **Reactive State Management**: Built-in support for async operations and RxJS observables
- **Immutable State Updates**: Components can update state immutably
- **Redux Integration**: Support for dispatching events and listening to store changes
- **Type-Safe Component Definition**: Full TypeScript support

### Basic Usage

```typescript
import { DefineDependencies, Component } from '@rhtml/component';
import { Container, Injectable } from '@rxdi/core';
import { html, LitElement, property } from '@rxdi/lit-html';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
class CounterService {
  counter = 55;
}

const Providers = DefineDependencies(CounterService)(Container);

@Component<{ counter: number }, typeof Providers, CounterComponent>({
  Settings: {
    selector: 'counter-component'
  },
  Providers,
  State: function(this, [counterService]) {
    return interval(1000).pipe(
      map(value => ({ counter: this.counter + counterService.counter + value }))
    );
  },
  Render: ([counterService]) =>
    function(this, { counter }) {
      return html`
        ${counter} ${counterService.counter}
      `;
    }
})
export class CounterComponent extends LitElement {
  @property({ type: Number })
  counter: number;
}
```

### Functional Composition

```typescript
import { Partial } from '@rhtml/component';

const compose = <T, D = []>(selector: string, styles?: CSSResult[], deps?: D) =>
  Partial<T, D>({
    selector,
    styles
  })(deps);

const state = () => interval(1000).pipe(map(() => new Date().getSeconds()));

@(compose<number>('date-component')(state)(() => date => date))
export class DateComponent extends LitElement {}
```

### Reactive State with Observables

```typescript
@Component<{ counter: number }, [], CounterComponent>({
  Settings: {
    selector: 'counter-component',
    style: css`
      .counter {
        background: red;
        color: white;
      }
    `
  },
  Providers: [],
  State: function(this) {
    return combineLatest([this.counter, this.mega]).pipe(
      map(([value, v2]) => ({ counter: value + v2 }))
    );
  },
  Render: () =>
    function(this, { counter }, setState) {
      return html`
        <p>${counter}</p>
        <button @click=${() => setState({ counter: counter + counter })}>
          CLICK ME
        </button>
      `;
    }
})
export class CounterComponent extends LitElement {
  @property({ type: Object })
  counter: Observable<number>;

  @property({ type: Object })
  mega: Observable<number>;
}
```

### Redux Integration Example

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { Store } from '@ngrx/store';
import { selectCounter, selectLoading, selectError } from './counter.selectors';
import { Container } from '@rxdi/core';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

// Define Redux actions
const increment = () => ({ type: 'INCREMENT' });
const decrement = () => ({ type: 'DECREMENT' });

// Async action creators
const fetchCounter = () => ({ type: 'FETCH_COUNTER_REQUEST' });
const fetchCounterSuccess = (value: number) => ({ 
  type: 'FETCH_COUNTER_SUCCESS',
  payload: value 
});
const fetchCounterFailure = (error: string) => ({ 
  type: 'FETCH_COUNTER_FAILURE',
  payload: error 
});

// Async action with side effects
const incrementAsync = () => ({ type: 'INCREMENT_ASYNC' });

// Define Redux reducer with async state
const counterReducer = (state = { 
  value: 0, 
  loading: false, 
  error: null 
}, action: { type: string, payload?: any }) => {
  switch (action.type) {
    case 'FETCH_COUNTER_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_COUNTER_SUCCESS':
      return { ...state, value: action.payload, loading: false };
    case 'FETCH_COUNTER_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'INCREMENT':
      return { ...state, value: state.value + 1 };
    case 'DECREMENT':
      return { ...state, value: state.value - 1 };
    case 'INCREMENT_ASYNC':
      return { ...state, loading: true };
    default:
      return state;
  }
};

// Create store with reducer and middleware
const store = createStore(
  counterReducer,
  applyMiddleware(
    thunkMiddleware, // For async actions
    loggerMiddleware // For debugging
  )
);

const Providers = DefineDependencies(Store)(Container);

@Component<{ counter: number }, typeof Providers, CounterComponent>({
  Settings: {
    selector: 'redux-counter'
  },
  Providers,
  State: function(this, [store]) {
    return combineLatest([
      store.select(selectCounter),
      store.select(selectLoading),
      store.select(selectError)
    ]).pipe(
      map(([counter, loading, error]) => ({ 
        counter,
        loading,
        error
      }))
    );
  },
  Render: () =>
    function(this, { counter, loading, error }, setState) {
      return html`
        <div class="counter-container">
          ${error ? html`
            <error-message .message=${error}></error-message>
          ` : null}
          
          <div class="counter-display">
            ${loading ? html`
              <loading-spinner></loading-spinner>
            ` : html`
              <span>Counter: ${counter}</span>
            `}
          </div>

          <div class="counter-controls">
            <button 
              @click=${() => this.dispatch(increment())}
              ?disabled=${loading}>
              +
            </button>
            <button 
              @click=${() => this.dispatch(decrement())}
              ?disabled=${loading}>
              -
            </button>
            <button 
              @click=${() => this.dispatch(incrementAsync())}
              ?disabled=${loading}>
              Increment Async
            </button>
            <button 
              @click=${() => this.dispatch(fetchCounter())}
              ?disabled=${loading}>
              Fetch Counter
            </button>
          </div>
        </div>
      `;
    }
})
export class ReduxCounterComponent extends LitElement {}
```

### Redux Middleware Example

```typescript
// Custom middleware for handling async actions
const asyncMiddleware = store => next => action => {
  if (action.type === 'INCREMENT_ASYNC') {
    setTimeout(() => {
      store.dispatch(increment());
    }, 1000);
  }
  return next(action);
};

// API middleware for handling API calls
const apiMiddleware = store => next => action => {
  if (action.type === 'FETCH_COUNTER_REQUEST') {
    // Simulate API call
    fetch('/api/counter')
      .then(response => response.json())
      .then(data => store.dispatch(fetchCounterSuccess(data.value)))
      .catch(error => store.dispatch(fetchCounterFailure(error.message)));
  }
  return next(action);
};

// Create store with custom middleware
const store = createStore(
  counterReducer,
  applyMiddleware(
    asyncMiddleware,
    apiMiddleware,
    thunkMiddleware
  )
);
```

### Redux Thunk Example

```typescript
// Thunk action creator
const fetchCounterWithRetry = () => {
  return async (dispatch, getState) => {
    dispatch(fetchCounter());
    
    try {
      const response = await fetch('/api/counter');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to fetch counter');
      }
      
      dispatch(fetchCounterSuccess(data.value));
    } catch (error) {
      // Retry logic
      if (getState().retryCount < 3) {
        setTimeout(() => {
          dispatch(fetchCounterWithRetry());
        }, 1000);
      } else {
        dispatch(fetchCounterFailure(error.message));
      }
    }
  };
};

// Usage in component
@Component({
  // ... component configuration
  Render: () =>
    function(this, { counter, loading, error }, setState) {
      return html`
        <button 
          @click=${() => this.dispatch(fetchCounterWithRetry())}
          ?disabled=${loading}>
          Fetch with Retry
        </button>
      `;
    }
})
```

## 📚 Resources

- [Official Documentation](#)
- [API Reference](#)
- [Examples Repository](#)
- [Community Chat](#)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

@rhtml is MIT licensed.

