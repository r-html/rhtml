---
sidebar_position: 2
---

# Custom Decorators

@rhtml provides a powerful decorator system that allows you to extend component functionality and create reusable patterns. This guide covers built-in decorators and how to create custom ones.

## 🚀 Built-in Decorators

### @HostListener

Listen to DOM events directly in your components:

```typescript
import { Component } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';
import { HostListener } from '@rhtml/decorators';

@Component({
  selector: 'interactive-component',
  template: () => html`
    <div>Hover or click me!</div>
  `
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

  @HostListener('window:resize')
  onResize() {
    console.log('Window resized');
  }
}
```

### @HostBinding

Bind component properties directly to DOM attributes and styles:

```typescript
import { Component, property } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';
import { HostBinding } from '@rhtml/decorators';

@Component({
  selector: 'dynamic-component',
  template: () => html`
    <div>Dynamic content</div>
  `
})
export class DynamicComponent extends LitElement {
  @property({ type: Boolean })
  @HostBinding('class.active')
  isActive = false;

  @property({ type: String })
  @HostBinding('style.color')
  textColor = 'black';

  @property({ type: String })
  @HostBinding('style.background')
  backgroundColor = 'white';

  @property({ type: String })
  @HostBinding('attr.data-status')
  status = 'idle';
}
```

### @Input

Create reactive input properties with automatic observation:

```typescript
import { Component } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';
import { Input } from '@rhtml/decorators';

@Component({
  selector: 'reactive-input',
  template: () => html`
    <div>Value: ${this.value}</div>
  `
})
export class ReactiveInputComponent extends LitElement {
  @Input({ observe: true })
  value: string = '';

  @Input({ observe: true, type: Number })
  count: number = 0;

  @Input({ observe: true, type: Boolean })
  enabled: boolean = true;
}
```

## 🎨 Custom Decorators

### Creating Custom Decorators

Create your own decorators to extend component functionality:

```typescript
// decorators/logger.decorator.ts
export function Logger(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`[${target.constructor.name}] ${propertyKey} called with:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`[${target.constructor.name}] ${propertyKey} returned:`, result);
    return result;
  };

  return descriptor;
}

// decorators/validate.decorator.ts
export function Validate(validationFn: (value: any) => boolean) {
  return function (target: any, propertyKey: string) {
    let value: any;

    const getter = function () {
      return value;
    };

    const setter = function (newValue: any) {
      if (!validationFn(newValue)) {
        throw new Error(`Invalid value for ${propertyKey}: ${newValue}`);
      }
      value = newValue;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

// decorators/throttle.decorator.ts
export function Throttle(delay: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let timeoutId: NodeJS.Timeout;

    descriptor.value = function (...args: any[]) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };

    return descriptor;
  };
}
```

### Using Custom Decorators

```typescript
import { Component } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';
import { Logger, Validate, Throttle } from './decorators';

@Component({
  selector: 'custom-decorator-demo',
  template: () => html`
    <div>
      <input 
        type="text" 
        .value=${this.name}
        @input=${(e) => this.updateName(e.target.value)}>
      <button @click=${() => this.handleClick()}>Click me</button>
    </div>
  `
})
export class CustomDecoratorDemoComponent extends LitElement {
  @Validate((value: string) => value.length > 0)
  @Input({ observe: true })
  name: string = '';

  @Logger
  updateName(value: string) {
    this.name = value;
  }

  @Throttle(1000)
  @Logger
  handleClick() {
    console.log('Button clicked!');
  }
}
```

## 🔧 Advanced Decorator Patterns

### Method Decorators with Parameters

Create decorators that accept configuration:

```typescript
// decorators/retry.decorator.ts
export function Retry(attempts: number = 3, delay: number = 1000) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: Error;

      for (let i = 0; i < attempts; i++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error;
          console.warn(`Attempt ${i + 1} failed:`, error.message);
          
          if (i < attempts - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError;
    };

    return descriptor;
  };
}

// decorators/cache.decorator.ts
export function Cache(ttl: number = 60000) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, { value: any; timestamp: number }>();

    descriptor.value = function (...args: any[]) {
      const key = JSON.stringify(args);
      const cached = cache.get(key);

      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.value;
      }

      const result = originalMethod.apply(this, args);
      cache.set(key, { value: result, timestamp: Date.now() });
      return result;
    };

    return descriptor;
  };
}
```

### Property Decorators with Metadata

Create decorators that store metadata:

```typescript
// decorators/observable.decorator.ts
import { BehaviorSubject } from 'rxjs';

export function Observable() {
  return function (target: any, propertyKey: string) {
    const symbol = Symbol(propertyKey);
    
    Object.defineProperty(target, propertyKey, {
      get() {
        if (!this[symbol]) {
          this[symbol] = new BehaviorSubject(undefined);
        }
        return this[symbol];
      },
      set(value: any) {
        if (!this[symbol]) {
          this[symbol] = new BehaviorSubject(value);
        } else {
          this[symbol].next(value);
        }
      },
      enumerable: true,
      configurable: true
    });
  };
}

// decorators/format.decorator.ts
export function Format(formatter: (value: any) => string) {
  return function (target: any, propertyKey: string) {
    const symbol = Symbol(propertyKey);
    
    Object.defineProperty(target, propertyKey, {
      get() {
        return this[symbol];
      },
      set(value: any) {
        this[symbol] = formatter(value);
      },
      enumerable: true,
      configurable: true
    });
  };
}
```

### Class Decorators

Create decorators that modify entire classes:

```typescript
// decorators/component.decorator.ts
export function AutoRegister(selector: string) {
  return function (constructor: Function) {
    // Register the component automatically
    if (!customElements.get(selector)) {
      customElements.define(selector, constructor as any);
    }
  };
}

// decorators/singleton.decorator.ts
export function Singleton() {
  return function (constructor: Function) {
    const instances = new Map();
    
    const originalConstructor = constructor as any;
    
    const newConstructor = function (...args: any[]) {
      if (!instances.has(constructor)) {
        instances.set(constructor, new originalConstructor(...args));
      }
      return instances.get(constructor);
    };
    
    newConstructor.prototype = originalConstructor.prototype;
    return newConstructor as any;
  };
}
```

## 🎯 Practical Examples

### Form Validation Decorator

```typescript
// decorators/form-validation.decorator.ts
export function Required(message: string = 'This field is required') {
  return function (target: any, propertyKey: string) {
    const symbol = Symbol(propertyKey);
    
    Object.defineProperty(target, propertyKey, {
      get() {
        return this[symbol];
      },
      set(value: any) {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          throw new Error(message);
        }
        this[symbol] = value;
      },
      enumerable: true,
      configurable: true
    });
  };
}

export function MinLength(min: number, message?: string) {
  return function (target: any, propertyKey: string) {
    const symbol = Symbol(propertyKey);
    
    Object.defineProperty(target, propertyKey, {
      get() {
        return this[symbol];
      },
      set(value: any) {
        if (typeof value === 'string' && value.length < min) {
          throw new Error(message || `Minimum length is ${min} characters`);
        }
        this[symbol] = value;
      },
      enumerable: true,
      configurable: true
    });
  };
}

// Usage
@Component({
  selector: 'user-form',
  template: () => html`
    <form @submit=${(e) => this.handleSubmit(e)}>
      <input 
        type="text" 
        placeholder="Username"
        @input=${(e) => this.username = e.target.value}>
      <input 
        type="email" 
        placeholder="Email"
        @input=${(e) => this.email = e.target.value}>
      <button type="submit">Submit</button>
    </form>
  `
})
export class UserFormComponent extends LitElement {
  @Required('Username is required')
  @MinLength(3, 'Username must be at least 3 characters')
  username: string = '';

  @Required('Email is required')
  email: string = '';

  handleSubmit(e: Event) {
    e.preventDefault();
    try {
      // Validation will be triggered when setting properties
      console.log('Form submitted:', { username: this.username, email: this.email });
    } catch (error) {
      console.error('Validation error:', error.message);
    }
  }
}
```

### API Call Decorator

```typescript
// decorators/api.decorator.ts
export function ApiCall(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: method !== 'GET' ? JSON.stringify(args[0]) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`API call failed for ${propertyKey}:`, error);
        throw error;
      }
    };

    return descriptor;
  };
}

// Usage
@Component({
  selector: 'api-component',
  template: () => html`
    <div>
      <button @click=${() => this.fetchUsers()}>Fetch Users</button>
      <button @click=${() => this.createUser({ name: 'John' })}>Create User</button>
    </div>
  `
})
export class ApiComponent extends LitElement {
  @ApiCall('/api/users')
  async fetchUsers() {
    // Method will be replaced with API call
  }

  @ApiCall('/api/users', 'POST')
  async createUser(userData: any) {
    // Method will be replaced with API call
  }
}
```

### Event Emitter Decorator

```typescript
// decorators/event-emitter.decorator.ts
export function EventEmitter(eventName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args);
      
      this.dispatchEvent(new CustomEvent(eventName, {
        detail: { result, args },
        bubbles: true,
        composed: true
      }));

      return result;
    };

    return descriptor;
  };
}

// Usage
@Component({
  selector: 'event-demo',
  template: () => html`
    <div>
      <button @click=${() => this.handleClick()}>Click me</button>
    </div>
  `
})
export class EventDemoComponent extends LitElement {
  @EventEmitter('custom-click')
  handleClick() {
    console.log('Button clicked!');
  }
}

// Listening to the event
document.addEventListener('custom-click', (e: CustomEvent) => {
  console.log('Custom event received:', e.detail);
});
```

## 🎨 Combining Decorators

### Multiple Decorators on Single Property

```typescript
@Component({
  selector: 'combined-decorators',
  template: () => html`
    <div>
      <input 
        type="text" 
        .value=${this.name}
        @input=${(e) => this.updateName(e.target.value)}>
    </div>
  `
})
export class CombinedDecoratorsComponent extends LitElement {
  @Required('Name is required')
  @MinLength(2, 'Name must be at least 2 characters')
  @Format((value: string) => value.toUpperCase())
  @Input({ observe: true })
  name: string = '';

  @Logger
  @Throttle(500)
  updateName(value: string) {
    this.name = value;
  }
}
```

### Decorator Composition

```typescript
// decorators/composed.decorator.ts
export function Composed(...decorators: Function[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    return decorators.reduce((desc, decorator) => {
      return decorator(target, propertyKey, desc) || desc;
    }, descriptor);
  };
}

// Usage
@Component({
  selector: 'composed-decorators',
  template: () => html`
    <div>Content</div>
  `
})
export class ComposedDecoratorsComponent extends LitElement {
  @Composed(Logger, Throttle(1000), EventEmitter('data-updated'))
  async fetchData() {
    // This method will be logged, throttled, and emit events
    return await fetch('/api/data').then(r => r.json());
  }
}
```

## 🎯 Best Practices

### 1. **Decorator Design**
- Keep decorators focused and single-purpose
- Use descriptive names that clearly indicate functionality
- Provide sensible defaults for configuration options
- Handle errors gracefully

### 2. **Performance Considerations**
- Avoid expensive operations in property decorators
- Use caching for expensive computations
- Consider the impact on component lifecycle
- Profile decorator performance in production

### 3. **Type Safety**
- Use TypeScript generics for better type inference
- Provide proper type definitions for decorator parameters
- Use interface constraints where appropriate
- Document expected types and return values

### 4. **Testing**
- Test decorators in isolation
- Mock dependencies appropriately
- Test edge cases and error conditions
- Ensure decorators work with component lifecycle

## 🚀 Next Steps

- Learn about [GraphQL Integration](/docs/advanced/graphql) for data fetching
- Explore [Performance Optimization](/docs/advanced/performance) for optimizing decorators
- Check out [Testing Strategies](/docs/getting-started/testing) for testing decorated components
- Understand [State Management](/docs/getting-started/state-management) for reactive decorators
