---
sidebar_position: 3
---

# Monadic Components

@rhtml introduces a revolutionary approach to building web components using functional programming principles and monadic composition. This experimental feature allows you to create components directly in HTML without writing controller logic.

## 🚀 Installation

```bash
npm install @rhtml/experiments
```

## 🎯 Core Concepts

Monadic components follow these fundamental rules:

1. **Containers with Scoped Logic** - Components act as containers with scoped logic inside
2. **Pure Operators** - Operators are empty pure components representing program settings
3. **Composable Logic** - Monad container creates composable logic based on provided operators
4. **Automatic Cleanup** - Logic is cleaned up after composition (removing operators from DOM Tree)
5. **Declarative Structure** - Components are declarative and self-contained

## 📦 Basic Monadic Components

### Simple Component Creation

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

<!-- Usage -->
<user-card name="John Doe" age="30"></user-card>
```

### Component with Multiple Properties

```html
<r-component>
  <r-selector>product-item</r-selector>
  <r-props>
    <r-prop key="title" type="String"></r-prop>
    <r-prop key="price" type="Number"></r-prop>
    <r-prop key="description" type="String"></r-prop>
    <r-prop key="inStock" type="Boolean"></r-prop>
  </r-props>
  <r-render .state=${(s) => html`
    <div class="product-item ${s.inStock ? 'in-stock' : 'out-of-stock'}">
      <h3>${s.title}</h3>
      <p class="price">$${s.price.toFixed(2)}</p>
      <p class="description">${s.description}</p>
      <span class="status">
        ${s.inStock ? 'In Stock' : 'Out of Stock'}
      </span>
    </div>
  `}>
  </r-render>
</r-component>

<!-- Usage -->
<product-item
  title="Wireless Headphones"
  price="99.99"
  description="High-quality wireless headphones with noise cancellation"
  inStock="true">
</product-item>
```

## 🔧 Advanced Monadic Patterns

### Service Components

A revolutionary concept of "fire and forget" components that self-destruct after initialization:

```typescript
import { LitServiceElement } from '@rhtml/experiments';

@Component({
  selector: 'user-service',
})
export class UserService extends LitServiceElement {
  async getUserById(id: number) {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }

  async updateUser(id: number, data: any) {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// Usage in template
html`
  <user-service
    .run=${async function (this: UserService) {
      const user = await this.getUserById(1);
      console.log('User loaded:', user);

      // Component will self-destruct after execution
    }}
  ></user-service>
`;
```

### Stateful Monadic Components

Create components with internal state management:

```html
<r-component>
  <r-selector>counter-widget</r-selector>
  <r-props>
    <r-prop key="initialValue" type="Number"></r-prop>
  </r-props>
  <r-state .value=${{ count: 0, loading: false }}></r-state>
  <r-render .state=${(s, setState) => html`
    <div class="counter">
      <h3>Counter: ${s.count}</h3>
      <button @click=${() => setState({ count: s.count + 1 })}>
        Increment
      </button>
      <button @click=${() => setState({ count: s.count - 1 })}>
        Decrement
      </button>
      <button @click=${() => setState({ count: s.initialValue })}>
        Reset
      </button>
    </div>
  `}>
  </r-render>
</r-component>

<!-- Usage -->
<counter-widget initialValue="10"></counter-widget>
```

### Conditional Rendering

```html
<r-component>
  <r-selector>conditional-display</r-selector>
  <r-props>
    <r-prop key="condition" type="Boolean"></r-prop>
    <r-prop key="message" type="String"></r-prop>
  </r-props>
  <r-render .state=${(s) => html`
    ${s.condition ? html`
      <div class="success">
        <span class="icon">✅</span>
        <span class="message">${s.message}</span>
      </div>
    ` : html`
      <div class="hidden">
        <span class="icon">⏸️</span>
        <span class="message">Content hidden</span>
      </div>
    `}
  `}>
  </r-render>
</r-component>

<!-- Usage -->
<conditional-display
  condition="true"
  message="This content is visible">
</conditional-display>
```

## 🎨 Complex Monadic Patterns

### List Components with Filtering

```html
<r-component>
  <r-selector>filterable-list</r-selector>
  <r-props>
    <r-prop key="items" type="Array"></r-prop>
    <r-prop key="filter" type="String"></r-prop>
  </r-props>
  <r-state .value=${{ filteredItems: [] }}></r-state>
  <r-render .state=${(s, setState) => html`
    <div class="filterable-list">
      <input
        type="text"
        placeholder="Filter items..."
        .value=${s.filter}
        @input=${(e) => {
          const filter = e.target.value;
          const filtered = s.items.filter(item =>
            item.name.toLowerCase().includes(filter.toLowerCase())
          );
          setState({ filteredItems: filtered });
        }}>

      <ul class="items">
        ${s.filteredItems.map(item => html`
          <li class="item">
            <span class="name">${item.name}</span>
            <span class="description">${item.description}</span>
          </li>
        `)}
      </ul>

      <div class="summary">
        Showing ${s.filteredItems.length} of ${s.items.length} items
      </div>
    </div>
  `}>
  </r-render>
</r-component>

<!-- Usage -->
<filterable-list
  .items=${[
    { name: 'Apple', description: 'Red fruit' },
    { name: 'Banana', description: 'Yellow fruit' },
    { name: 'Orange', description: 'Orange fruit' }
  ]}
  filter="">
</filterable-list>
```

### Form Components with Validation

```html
<r-component>
  <r-selector>validated-form</r-selector>
  <r-props>
    <r-prop key="fields" type="Array"></r-prop>
    <r-prop key="onSubmit" type="Function"></r-prop>
  </r-props>
  <r-state .value=${{
    formData: {},
    errors: {},
    isValid: false
  }}></r-state>
  <r-render .state=${(s, setState) => html`
    <form @submit=${(e) => {
      e.preventDefault();
      if (s.isValid) {
        s.onSubmit(s.formData);
      }
    }}>
      ${s.fields.map(field => html`
        <div class="field">
          <label for="${field.name}">${field.label}</label>
          <input
            type="${field.type}"
            id="${field.name}"
            name="${field.name}"
            .value=${s.formData[field.name] || ''}
            @input=${(e) => {
              const newData = { ...s.formData, [field.name]: e.target.value };
              const newErrors = { ...s.errors };

              // Validation
              if (field.required && !e.target.value) {
                newErrors[field.name] = 'This field is required';
              } else if (field.pattern && !field.pattern.test(e.target.value)) {
                newErrors[field.name] = field.errorMessage || 'Invalid format';
              } else {
                delete newErrors[field.name];
              }

              const isValid = Object.keys(newErrors).length === 0;
              setState({
                formData: newData,
                errors: newErrors,
                isValid
              });
            }}>
          ${s.errors[field.name] ? html`
            <span class="error">${s.errors[field.name]}</span>
          ` : ''}
        </div>
      `)}

      <button type="submit" ?disabled=${!s.isValid}>
        Submit
      </button>
    </form>
  `}>
  </r-render>
</r-component>

<!-- Usage -->
<validated-form
  .fields=${[
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMessage: 'Please enter a valid email'
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      pattern: /.{8,}/,
      errorMessage: 'Password must be at least 8 characters'
    }
  ]}
  .onSubmit=${(data) => console.log('Form submitted:', data)}>
</validated-form>
```

## 🔄 Monadic Component Lifecycle (Not implemented just a concept)

### Lifecycle Hooks

```html
<r-component>
  <r-selector>lifecycle-demo</r-selector>
  <r-props>
    <r-prop key="message" type="String"></r-prop>
  </r-props>
  <r-state .value=${{ count: 0 }}></r-state>

  <!-- OnInit hook -->
  <r-on-init .run=${(s, setState) => {
    console.log('Component initialized');
    setState({ count: 1 });
  }}></r-on-init>

  <!-- OnUpdate hook -->
  <r-on-update .run=${(s, setState) => {
    console.log('Component updated:', s);
  }}></r-on-update>

  <!-- OnDestroy hook -->
  <r-on-destroy .run=${() => {
    console.log('Component destroyed');
  }}></r-on-destroy>

  <r-render .state=${(s) => html`
    <div class="lifecycle-demo">
      <h3>${s.message}</h3>
      <p>Count: ${s.count}</p>
    </div>
  `}>
  </r-render>
</r-component>
```

### Async Operations (Currently not implemented on-init)

```html
<r-component>
  <r-selector>async-component</r-selector>
  <r-props>
    <r-prop key="url" type="String"></r-prop>
  </r-props>
  <r-state .value=${{
    data: null,
    loading: true,
    error: null
  }}></r-state>

  <r-on-init .run=${async (s, setState) => {
    try {
      setState({ loading: true });
      const response = await fetch(s.url);
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ error: error.message, loading: false });
    }
  }}></r-on-init>

  <r-render .state=${(s) => html`
    <div class="async-component">
      ${s.loading ? html`
        <div class="loading">Loading...</div>
      ` : ''}

      ${s.error ? html`
        <div class="error">Error: ${s.error}</div>
      ` : ''}

      ${s.data ? html`
        <div class="data">
          <pre>${JSON.stringify(s.data, null, 2)}</pre>
        </div>
      ` : ''}
    </div>
  `}>
  </r-render>
</r-component>
```

## 🎯 Monadic Logic Map

The monadic component structure follows this hierarchy:

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

### Operator Types

1. **r-component** (Monad) - Stores logic for working with operators
2. **r-selector** (Operator) - Defines component selector
3. **r-template** (Operator) - Defines component template
4. **r-props** (Monad) - Container for component properties
5. **r-prop** (Monad) - Individual property definition
6. **r-key** (Operator) - Property key
7. **r-value** (Operator) - Property value

## 🔧 Advanced Monadic Features

### Custom Operators

Create your own monadic operators:

```html
<r-component>
  <r-selector>custom-operator-demo</r-selector>

  <!-- Custom operator for theming -->
  <r-theme .value=${'dark'}></r-theme>

  <!-- Custom operator for localization -->
  <r-locale .value=${'en-US'}></r-locale>

  <!-- Custom operator for analytics -->
  <r-analytics .event=${'component-viewed'}></r-analytics>

  <r-render .state=${(s) => html`
    <div class="custom-operator-demo">
      <h3>Custom Operators Demo</h3>
      <p>Theme: ${s.theme}</p>
      <p>Locale: ${s.locale}</p>
    </div>
  `}>
  </r-render>
</r-component>
```

### Monadic Composition

Compose multiple monadic components:

```html
<r-component>
  <r-selector>composed-dashboard</r-selector>

  <!-- Compose user profile component -->
  <r-compose selector="user-profile" .props=${{ userId: 1 }}></r-compose>

  <!-- Compose notification component -->
  <r-compose selector="notification-center" .props=${{ maxNotifications: 5 }}></r-compose>

  <!-- Compose data visualization component -->
  <r-compose selector="data-chart" .props=${{ data: [1, 2, 3, 4, 5] }}></r-compose>

  <r-render .state=${(s) => html`
    <div class="dashboard">
      <div class="sidebar">
        <slot name="user-profile"></slot>
      </div>
      <div class="main">
        <slot name="notification-center"></slot>
        <slot name="data-chart"></slot>
      </div>
    </div>
  `}>
  </r-render>
</r-component>
```

## 🎯 Best Practices

### 1. **Component Design**

- Keep components focused and single-purpose
- Use descriptive selectors and property names
- Implement proper validation for properties
- Handle edge cases gracefully

### 2. **State Management**

- Use local state for component-specific data
- Avoid global state in monadic components
- Implement proper state initialization
- Handle state updates efficiently

### 3. **Performance Optimization**

- Minimize DOM manipulations
- Use efficient rendering strategies
- Implement proper cleanup in lifecycle hooks
- Avoid expensive operations in render functions

### 4. **Error Handling**

- Implement comprehensive error boundaries
- Provide meaningful error messages
- Handle async operation failures
- Validate input data

## 🚀 Next Steps

- Learn about [Reactive Operators](/docs/core-concepts/reactive-operators) for data transformation
- Explore [GraphQL Integration](/docs/advanced/graphql) for data fetching
- Check out [Custom Decorators](/docs/advanced/decorators) for extending functionality
- Understand [State Management](/docs/getting-started/state-management) for complex state handling
