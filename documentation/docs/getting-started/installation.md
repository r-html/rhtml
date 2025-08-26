---
sidebar_position: 1
---

# Installation

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (version 18 or higher)
- npm (version 7 or higher)
- TypeScript (version 5.2 or higher)

## Quick Installation

The easiest way to get started is by using the official starter template:

```bash
git clone https://github.com/rxdi/starter-client-side-lit-html
cd starter-client-side-lit-html
npm install
npm start
```

## Manual Installation

If you prefer to start from scratch, follow these steps:

1. Create a new project directory:

```bash
mkdir my-rhtml-app
cd my-rhtml-app
```

2. Initialize a new npm project:

```bash
npm init -y
```

3. Install the core dependencies:

```bash
npm install @rhtml/core @rhtml/component @rhtml/operators @rhtml/di
```

4. Install development dependencies:

```bash
npm install --save-dev typescript @types/node
```

5. Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

6. Create a basic project structure:

```bash
mkdir -p src/components src/services src/app
```

7. Create your first component (`src/components/app.component.ts`):

```typescript
import { Component } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'app-root',
  template: () => html`
    <div>
      <h1>Welcome to @rhtml!</h1>
      <p>This is your first component.</p>
    </div>
  `
})
export class AppComponent extends LitElement {}
```

8. Create your main application file (`src/app/main.ts`):

```typescript
import '@rhtml/operators';
import '@rhtml/components';
import { AppComponent } from './components/app.component';

// Register your component
customElements.define('app-root', AppComponent);
```

9. Create an HTML entry point (`src/index.html`):

```html
<!DOCTYPE html>
<html>
  <head>
    <title>@rhtml Application</title>
  </head>
  <body>
    <app-root></app-root>
    <script type="module" src="./app/main.ts"></script>
  </body>
</html>
```

10. Add scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "parcel src/index.html",
    "build": "parcel build src/index.html",
    "test": "jest"
  }
}
```

11. Install Parcel for development:

```bash
npm install --save-dev parcel
```

## Development Server

To start the development server:

```bash
npm start
```

This will start a development server at `http://localhost:1234`.

## Building for Production

To build your application for production:

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

## Next Steps

Now that you have your basic setup ready, you can:

1. Learn about [Components](/docs/getting-started/components)
2. Explore [Services](/docs/getting-started/services)
3. Understand [Dependency Injection](/docs/getting-started/dependency-injection)
4. Check out [State Management](/docs/getting-started/state-management)

## Troubleshooting

If you encounter any issues during installation:

1. Make sure all dependencies are installed correctly
2. Check that your TypeScript version is compatible
3. Verify that your Node.js version is supported
4. Check the [GitHub Issues](https://github.com/r-html/rhtml/issues) for known problems

## Need Help?

- Join our [Discord Community](https://discord.gg/rhtml)
- Check the [Documentation](/docs)
- Search [Stack Overflow](https://stackoverflow.com/questions/tagged/rhtml)
- Open an [Issue](https://github.com/r-html/rhtml/issues) 