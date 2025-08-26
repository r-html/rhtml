---
sidebar_position: 1
---

# Introduction to @rhtml

@rhtml (Reactive HyperText Markup Language) is a revolutionary framework for building modern web applications with a focus on reactive programming, declarative development, and dependency injection. It combines the best practices from various frameworks while maintaining simplicity and flexibility.

## 🚀 Quick Start

The fastest way to get started is by using the official starter template:

```bash
git clone https://github.com/rxdi/starter-client-side-lit-html
cd starter-client-side-lit-html
npm install
npm start
```

## 🎯 Core Features

### 1. **Declarative Development**
- Write components directly in HTML using monadic approach
- Clear separation of concerns with self-documenting structure
- Functional programming principles with monadic composition
- Zero JavaScript components using pure HTML

### 2. **Reactive Programming**
- Built-in RxJS integration for reactive state management
- Observable patterns for data flow
- Stream-based architecture with fine-grained reactivity
- Event-driven component communication

### 3. **Cross-Platform Architecture**
- Works seamlessly in both Frontend and Backend
- Share code between platforms using unified API
- Fastify integration for server-side development
- Consistent development experience across platforms

### 4. **Type Safety**
- Full TypeScript support with compile-time checking
- Runtime type validation
- IDE autocompletion and IntelliSense
- Interface-based design patterns

### 5. **Modern Web Standards**
- Web Components based architecture
- Custom Elements and Shadow DOM
- LitElement integration for efficient rendering
- Progressive Web App support

## 📦 Core Packages

@rhtml is built on a modular architecture with specialized packages:

### Frontend Packages

| Package | Description | Link |
|---------|-------------|------|
| **@rhtml/component** | Main reactive component system for building UI | [Core Repository](https://github.com/r-html/core/tree/master/packages/component) |
| **@rhtml/components** | Declarative monadic approach defining Web Components using HTML | [Core Repository](https://github.com/r-html/core/tree/master/packages/components) |
| **@rhtml/operators** | Useful declarative operators like `for`, `if`, `let` | [Core Repository](https://github.com/r-html/core/tree/master/packages/operators) |
| **@rhtml/graphql** | Declarative GraphQL for executing queries, mutations, and subscriptions | [Core Repository](https://github.com/r-html/core/tree/master/packages/graphql) |
| **@rhtml/hooks** | React-like hooks for use inside web components | [Core Repository](https://github.com/r-html/core/tree/master/packages/hooks) |
| **@rhtml/renderer** | Main renderer for every component used with observables | [Core Repository](https://github.com/r-html/core/tree/master/packages/renderer) |
| **@rhtml/experiments** | Declarative way of defining web components only with HTML | [Core Repository](https://github.com/r-html/core/tree/master/packages/experiments) |
| **@rhtml/decorators** | Useful decorators `@HostListener` and `@Input` | [Core Repository](https://github.com/r-html/core/tree/master/packages/decorators) |
| **@rhtml/modifiers** | Modifiers created using Custom HTML Attributes | [Core Repository](https://github.com/r-html/core/tree/master/packages/modifiers) |
| **@rhtml/custom-attributes** | Create your own custom Attributes | [Core Repository](https://github.com/r-html/core/tree/master/packages/custom-attributes) |

### Backend Packages

| Package | Description | Link |
|---------|-------------|------|
| **@rhtml/di** | IOC container for dependency injection | [Core Repository](https://github.com/r-html/core/tree/master/packages/di) |
| **@rhtml/fastify** | Fastify server integration with decorators | [Core Repository](https://github.com/r-html/core/tree/master/packages/fastify) |
| **@rhtml/mongoose** | MongoDB integration with reactive patterns | [Core Repository](https://github.com/r-html/core/tree/master/packages/mongoose) |
| **@rhtml/amqp** | AMQP message queue integration | [Core Repository](https://github.com/r-html/core/tree/master/packages/amqp) |
| **@rhtml/schematics** | Angular-like schematics for component generation | [Core Repository](https://github.com/r-html/core/tree/master/packages/schematics) |

## 🏗️ Architecture Overview

@rhtml follows a modular architecture that promotes:

### 1. **Separation of Concerns**
- Clear component boundaries with single responsibility
- Service-based architecture for business logic
- Dependency injection for loose coupling
- Modular design for scalability

### 2. **Reactive Programming**
- Observable patterns for data flow
- Stream-based architecture
- Event-driven component communication
- State management with RxJS

### 3. **Monadic Components**
- Functional programming principles
- Declarative component composition
- Self-contained logic with cleanup
- Pure HTML component definition

### 4. **Cross-Platform Support**
- Unified API across platforms
- Shared codebase capabilities
- Platform-specific adapters
- Consistent development experience

## 🎨 Key Concepts

### Monadic Components
@rhtml introduces a revolutionary approach using functional programming principles:

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

### Declarative GraphQL
Write GraphQL queries directly in templates:

```typescript
@Component({
  template: () => html`
    <r-part>
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
            </div>
          `)}
        </div>
      `}>
      </r-render>
    </r-part>
  `
})
```

### Reactive Operators
Use declarative operators for common patterns:

```typescript
@Component({
  template: () => html`
    <r-for .of=${['Item 1', 'Item 2', 'Item 3']}>
      <r-let .item=${item => html`
        <div class="item">${item}</div>
      `}></r-let>
    </r-for>
  `
})
```

## 📚 Documentation Structure

This documentation is organized into several sections:

### 1. **Getting Started**
- [Installation](/docs/getting-started/installation) - Setup and configuration
- [Components](/docs/getting-started/components) - Building UI components
- [State Management](/docs/getting-started/state-management) - Managing application state
- [Controllers](/docs/getting-started/controllers) - Backend API development
- [Modules](/docs/getting-started/modules) - Application organization
- [Providers](/docs/getting-started/providers) - Dependency injection
- [Testing](/docs/getting-started/testing) - Testing strategies

### 2. **Core Concepts**
- [Reactive Operators](/docs/core-concepts/reactive-operators) - Declarative operators
- [Monadic Components](/docs/core-concepts/monadic-components) - Functional components

### 3. **Advanced Topics**
- [GraphQL Integration](/docs/advanced/graphql) - Data fetching and mutations
- [Custom Decorators](/docs/advanced/decorators) - Creating custom decorators
- [Host Bindings and Listeners](/docs/advanced/host-bindings-listeners) - DOM event handling
- [Mongoose Integration](/docs/advanced/mongoose) - MongoDB integration
- [AMQP Integration](/docs/advanced/amqp) - Message queue integration
- [Performance Optimization](/docs/advanced/performance) - Optimization techniques



## 🎓 Learning Path

### Beginner Level
1. **Basic Components** - Creating simple UI components
2. **Template Syntax** - Understanding HTML templates
3. **Properties and Events** - Component communication
4. **Basic Services** - Simple dependency injection

### Intermediate Level
1. **Advanced Components** - Complex component patterns
2. **State Management** - Reactive state handling
3. **GraphQL Integration** - Data fetching and mutations
4. **Testing Strategies** - Component and service testing

### Advanced Level
1. **Monadic Patterns** - Functional programming concepts
2. **Custom Decorators** - Extending framework capabilities
3. **Performance Optimization** - Advanced optimization techniques
4. **Cross-Platform Development** - Platform-agnostic code

## 🌟 Why Choose @rhtml?

### 1. **Modern Architecture**
- Built on Web Components standards
- Reactive programming with RxJS
- Functional programming principles
- Type-safe development with TypeScript

### 2. **Developer Experience**
- Excellent IDE support with IntelliSense
- Comprehensive debugging tools
- Rich ecosystem of packages
- Extensive documentation and examples

### 3. **Performance**
- Efficient rendering with LitElement
- Fine-grained reactivity
- Minimal bundle sizes
- Optimized for modern browsers

### 4. **Flexibility**
- Modular package architecture
- Cross-platform compatibility
- Extensible through custom decorators
- Framework-agnostic approach

## 🚀 Next Steps

Ready to get started? Choose your path:

- **[Quick Start Guide](/docs/getting-started/installation)** - Get up and running in minutes
- **[Component Tutorial](/docs/getting-started/components)** - Build your first component
- **[Backend Development](/docs/getting-started/controllers)** - Create API endpoints
- **[GraphQL Integration](/docs/advanced/graphql)** - Connect to your data layer

For more information, visit the [GitHub repository](https://github.com/r-html/core) or join our community discussions.
