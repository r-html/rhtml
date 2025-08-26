---
sidebar_position: 1
---

# Introduction to @rhtml

@rhtml is a modern, reactive web framework that combines the power of Web Components, RxJS, and dependency injection to create scalable, maintainable applications. Built with TypeScript and designed for both frontend and backend development, @rhtml provides a unified development experience.

## 🚀 Quick Start

### Frontend Development

```bash
# Create a new @rhtml project
git clone https://github.com/rxdi/starter-client-side-lit-html my-frontend
cd my-frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Backend Development

```bash
# Clone the fastify starter template
git clone https://github.com/r-html/fastify-starter my-backend
cd my-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

## ✨ Core Features

- **Reactive Programming**: Native RxJS integration for reactive data flows
- **Web Components**: Build reusable components with Web Components standards
- **Dependency Injection**: Powerful DI container inspired by Angular
- **TypeScript First**: Full TypeScript support with excellent IDE integration
- **Full Stack**: Frontend and backend development in one framework
- **Performance**: Built on Web Components and LitElement for optimal performance
- **Developer Experience**: Excellent tooling and debugging support

## 📦 Core Packages

### Frontend Packages

| Package | Description | Repository |
|---------|-------------|------------|
| **@rhtml/component** | Functional reactive components | [Core Repository](https://github.com/r-html/core/tree/master/packages/component) |
| **@rxdi/lit-html** | First generation Web Components | [RxDI Repository](https://github.com/rxdi/rxdi/tree/master/packages/lit-html) |
| **@rhtml/components** | Pre-built UI components | [Core Repository](https://github.com/r-html/core/tree/master/packages/components) |
| **@rhtml/renderer** | Component rendering engine | [Core Repository](https://github.com/r-html/core/tree/master/packages/renderer) |
| **@rhtml/hooks** | React-like hooks for components | [Core Repository](https://github.com/r-html/core/tree/master/packages/hooks) |
| **@rhtml/operators** | Reactive operators (r-for, r-if, etc.) | [Core Repository](https://github.com/r-html/core/tree/master/packages/operators) |
| **@rhtml/decorators** | Host bindings and listeners | [Core Repository](https://github.com/r-html/core/tree/master/packages/decorators) |
| **@rhtml/custom-attributes** | Custom HTML attributes | [Core Repository](https://github.com/r-html/core/tree/master/packages/custom-attributes) |
| **@rhtml/modifiers** | Layout and animation modifiers | [Core Repository](https://github.com/r-html/core/tree/master/packages/modifiers) |
| **@rhtml/experiments** | Monadic components and patterns | [Core Repository](https://github.com/r-html/core/tree/master/packages/experiments) |

### Backend Packages

| Package | Description | Repository |
|---------|-------------|------------|
| **@rhtml/di** | IOC container for dependency injection | [Core Repository](https://github.com/r-html/core/tree/master/packages/di) |
| **@rhtml/fastify** | Fastify server integration with decorators | [Core Repository](https://github.com/r-html/core/tree/master/packages/fastify) |
| **@rhtml/fastify-starter** | Starter template for backend development | [Fastify Starter](https://github.com/r-html/fastify-starter) |
| **@rhtml/mongoose** | MongoDB integration with reactive patterns | [Core Repository](https://github.com/r-html/core/tree/master/packages/mongoose) |
| **@rhtml/amqp** | AMQP message queue integration | [Core Repository](https://github.com/r-html/core/tree/master/packages/amqp) |
| **@rhtml/schematics** | Angular-like schematics for component generation | [Core Repository](https://github.com/r-html/core/tree/master/packages/schematics) |

## 🏗️ Architecture Overview

@rhtml follows a modular architecture that separates concerns while maintaining tight integration:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Shared        │
│                 │    │                 │    │                 │
│ • Components    │    │ • Controllers   │    │ • DI Container  │
│ • Reactive      │    │ • Services      │    │ • Types         │
│ • Web Components│    │ • Fastify       │    │ • Utilities     │
│ • Operators     │    │ • GraphQL       │    │ • Schematics    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Key Concepts

### 1. **Reactive Programming**
@rhtml embraces reactive programming with RxJS, allowing you to build responsive applications with declarative data flows.

### 2. **Web Components**
Build truly reusable components that work across frameworks and can be shared between projects.

### 3. **Dependency Injection**
Manage application state and services with a powerful DI container that promotes testability and maintainability.

### 4. **Functional Reactive Components**
Advanced component system that combines functional programming with reactive state management.

### 5. **Full-Stack Development**
Write both frontend and backend code using the same patterns and tools.

## 📚 Documentation Structure

### 1. **Getting Started**
- [Installation](/docs/getting-started/installation) - Setup and configuration
- [Components](/docs/getting-started/components) - Building components
- [State Management](/docs/getting-started/state-management) - Managing application state
- [Controllers](/docs/getting-started/controllers) - Backend API development
- [Modules](/docs/getting-started/modules) - Organizing your application
- [Providers](/docs/getting-started/providers) - Service registration
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

1. **Start with Installation** - Set up your development environment
2. **Learn Components** - Understand the component systems
3. **Explore State Management** - Master reactive state patterns
4. **Build Backend APIs** - Create controllers and services
5. **Advanced Patterns** - Dive into GraphQL, decorators, and optimization

## 🤔 Why Choose @rhtml?

- **Reactive by Design**: Built for reactive programming from the ground up
- **Component Based**: True Web Components with excellent composition
- **Dependency Injection**: Enterprise-grade service management
- **TypeScript First**: Full type safety and excellent IDE support
- **Performance**: Minimal overhead with maximum efficiency
- **Developer Experience**: Excellent tooling and debugging
- **Comprehensive**: Frontend and backend in one framework
- **Standards Based**: Built on Web Components and modern standards

## 🚀 Next Steps

- **Frontend**: Start with the [Component Guide](/docs/getting-started/components)
- **Backend**: Use the [Fastify Starter Template](https://github.com/r-html/fastify-starter)
- **Full Stack**: Explore [State Management](/docs/getting-started/state-management)
- **Community**: Join our [Discord Community](https://discord.gg/rhtml)

Ready to build something amazing? Let's get started! 🚀
