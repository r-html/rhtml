---
sidebar_position: 1
---

# Installation

Get started with @rhtml by setting up your development environment and creating your first project.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **Git** (for cloning starter templates)

## 🚀 Quick Start Options

### Option 1: Frontend Development

For frontend applications, use the official starter template:

```bash
# Clone the frontend starter
git clone https://github.com/rxdi/starter-client-side-lit-html my-app
cd my-app

# Install dependencies
npm install

# Start development server
npm start
```

### Option 2: Backend Development

For backend applications, use the Fastify starter template:

```bash
# Clone the backend starter
git clone https://github.com/r-html/fastify-starter my-backend
cd my-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

### Option 3: Manual Setup

If you prefer to start from scratch:

```bash
# Create a new directory
mkdir my-rhtml-project
cd my-rhtml-project

# Initialize package.json
npm init -y

# Install core dependencies
npm install @rhtml/component @rxdi/lit-html @rhtml/di rxjs
npm install --save-dev typescript @types/node
```

## 📦 Package Installation

### Core Frontend Packages

```bash
# Component system
npm install @rhtml/component @rxdi/lit-html

# Reactive programming
npm install rxjs

# Dependency injection
npm install @rhtml/di

# Additional frontend packages
npm install @rhtml/operators @rhtml/decorators @rhtml/hooks
```

### Backend Packages

```bash
# Fastify integration
npm install @rhtml/fastify fastify

# Database integration
npm install @rhtml/mongoose mongoose

# Message queue
npm install @rhtml/amqp amqplib

# GraphQL support
npm install @rhtml/graphql graphql
```

### Development Tools

```bash
# TypeScript
npm install --save-dev typescript @types/node

# Build tools
npm install --save-dev webpack webpack-cli webpack-dev-server

# Testing
npm install --save-dev jest @types/jest

# Code quality
npm install --save-dev eslint prettier
```

## ⚙️ Configuration

### TypeScript Configuration

Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Environment Variables

For backend projects, create a `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/myapp

# AMQP Configuration
AMQP_URL=amqp://localhost

# GraphQL Configuration
GRAPHQL_ENDPOINT=/graphql
```

## 🏗️ Project Structure

### Frontend Project Structure

```
my-app/
├── src/
│   ├── components/
│   │   ├── app.component.ts
│   │   └── user.component.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── styles/
│   │   └── global.css
│   └── main.ts
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
└── webpack.config.js
```

### Backend Project Structure

```
my-backend/
├── src/
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── modules/
│   │   └── app.module.ts
│   ├── models/
│   │   └── user.model.ts
│   └── main.ts
├── tests/
├── .env
├── package.json
└── tsconfig.json
```

## 🚀 Development Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

## 🔧 IDE Setup

### VS Code Extensions

Install these recommended extensions:

- **TypeScript and JavaScript Language Features**
- **ESLint**
- **Prettier**
- **LitElement Language Support**
- **Web Components**

### VS Code Settings

Add to your `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 🧪 Testing Setup

### Jest Configuration

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### Test Setup File

Create `src/test-setup.ts`:

```typescript
import '@testing-library/jest-dom';

// Mock Web Components
customElements.define('test-element', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<div>Test Element</div>';
  }
});
```

## 🌐 Browser Support

@rhtml supports all modern browsers:

- **Chrome** (v88+)
- **Firefox** (v85+)
- **Safari** (v14+)
- **Edge** (v88+)

For older browsers, you may need polyfills:

```bash
npm install @webcomponents/webcomponentsjs
```

## 📚 Next Steps

Now that you have @rhtml installed, you can:

1. Learn about [Components](/docs/getting-started/components)
2. Explore [State Management](/docs/getting-started/state-management)
3. Check out [Controllers](/docs/getting-started/controllers)
4. Understand [Modules](/docs/getting-started/modules)

## Troubleshooting

### Common Issues

**TypeScript Decorator Errors**
```bash
# Make sure experimentalDecorators is enabled in tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

**Web Components Not Working**
```bash
# Install polyfills for older browsers
npm install @webcomponents/webcomponentsjs
```

**Fastify Server Issues**
```bash
# Check if port is already in use
lsof -i :3000
# Kill process if needed
kill -9 <PID>
```

## Need Help?

- Join our [Discord Community](https://discord.gg/rhtml)
- Check the [Documentation](/docs/intro)
- Search [Stack Overflow](https://stackoverflow.com/questions/tagged/rhtml)
- Open an [Issue](https://github.com/r-html/rhtml/issues)
