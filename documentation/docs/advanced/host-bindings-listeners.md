---
sidebar_position: 4
---

# Host Bindings and Host Listeners

@rhtml provides powerful decorators for handling DOM events and property bindings directly on the host element. These decorators simplify event handling and property management in your components.

## 🚀 Installation

```bash
npm install @rhtml/decorators
```

## 🎯 @HostListener

The `@HostListener` decorator allows you to listen to DOM events directly on the host element of your component. This eliminates the need for manual `addEventListener` calls and provides a clean, declarative way to handle events.

### Basic Usage

```typescript
import { Component, html, LitElement } from '@rxdi/lit-html';
import { HostListener } from '@rhtml/decorators';

@Component({
  selector: 'interactive-component',
  template: () => html` <div>Hover or click me!</div> `,
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


#### Add window event listener

```typescript
import { Component, html, LitElement } from '@rxdi/lit-html';

import { HostListener } from '@rhtml/decorators';

/**
 * @customElement home-component
 */
@Component({
  selector: 'home-component',
  template(this) {
    return html` Home Component `;
  },
})
export class HomeComponent extends LitElement {
  @HostListener('window:mouseenter')
  onEnter() {
    console.log('Enter home');
  }

  @HostListener('window:mouseleave')
  onLeave() {
    console.log('Leave home');
  }
}
```

### Advanced Event Handling

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';
import { HostListener } from '@rhtml/decorators';

@Component({
  selector: 'advanced-listener',
  template: () => html`
    <div>
      <h2>${this.title}</h2>
      <p>Click count: ${this.clickCount}</p>
      <p>Last key pressed: ${this.lastKey}</p>
    </div>
  `,
})
export class AdvancedListenerComponent extends LitElement {
  @property({ type: String })
  title = 'Interactive Component';

  @property({ type: Number })
  clickCount = 0;

  @property({ type: String })
  lastKey = '';

  @HostListener('click')
  handleClick(event: MouseEvent) {
    this.clickCount++;
    console.log(`Clicked ${this.clickCount} times`);
  }

  @HostListener('keydown')
  handleKeyDown(event: KeyboardEvent) {
    this.lastKey = event.key;
    console.log(`Key pressed: ${event.key}`);
  }

  @HostListener('focus')
  handleFocus() {
    console.log('Component focused');
  }

  @HostListener('blur')
  handleBlur() {
    console.log('Component lost focus');
  }
}
```

### Event Options

You can pass additional options to customize event handling:

```typescript
import { Component, html, LitElement } from '@rxdi/lit-html';
import { HostListener } from '@rhtml/decorators';

@Component({
  selector: 'event-options',
  template: () => html` <div>Scroll or resize to see events</div> `,
})
export class EventOptionsComponent extends LitElement {
  @HostListener('scroll', { passive: true })
  handleScroll(event: Event) {
    console.log('Scrolled', event);
  }

  @HostListener('resize', { capture: true })
  handleResize(event: Event) {
    console.log('Resized', event);
  }

  @HostListener('keydown', { once: true })
  handleFirstKeyDown(event: KeyboardEvent) {
    console.log('First key pressed:', event.key);
  }
}
```

## 🎨 @HostBinding

The `@HostBinding` decorator allows you to bind component properties directly to host element attributes, properties, or styles. This provides a reactive way to update the host element based on component state.

### Basic Property Binding

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';
import { HostBinding } from '@rhtml/decorators';

@Component({
  selector: 'host-binding-demo',
  template: () => html` <div>This component has dynamic host bindings</div> `,
})
export class HostBindingDemoComponent extends LitElement {
  @property({ type: String })
  @HostBinding('attr.data-status')
  status = 'active';

  @property({ type: Boolean })
  @HostBinding('attr.disabled')
  disabled = false;

  @property({ type: String })
  @HostBinding('attr.role')
  role = 'button';
}
```

### Style Binding

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';
import { HostBinding } from '@rhtml/decorators';

@Component({
  selector: 'style-binding',
  template: () => html` <div>Dynamic styling based on state</div> `,
})
export class StyleBindingComponent extends LitElement {
  @property({ type: String })
  @HostBinding('style.color')
  textColor = 'black';

  @property({ type: String })
  @HostBinding('style.background-color')
  backgroundColor = 'white';

  @property({ type: String })
  @HostBinding('style.padding')
  padding = '10px';

  @property({ type: String })
  @HostBinding('style.border')
  border = '1px solid #ccc';
}
```

### Class Binding

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';
import { HostBinding } from '@rhtml/decorators';

@Component({
  selector: 'class-binding',
  template: () => html` <div>Dynamic classes based on state</div> `,
})
export class ClassBindingComponent extends LitElement {
  @property({ type: Boolean })
  @HostBinding('class.active')
  isActive = false;

  @property({ type: Boolean })
  @HostBinding('class.disabled')
  isDisabled = false;

  @property({ type: Boolean })
  @HostBinding('class.loading')
  isLoading = false;

  @property({ type: String })
  @HostBinding('class.theme')
  theme = 'light';
}
```

## 🔧 Combining @HostListener and @HostBinding

You can combine both decorators to create interactive components that respond to events by updating their host element:

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';
import { HostListener, HostBinding } from '@rhtml/decorators';

@Component({
  selector: 'interactive-host',
  template: () => html`
    <div>
      <h3>Interactive Host Component</h3>
      <p>Click, hover, or focus to see changes</p>
      <p>State: ${this.state}</p>
    </div>
  `,
})
export class InteractiveHostComponent extends LitElement {
  @property({ type: String })
  state = 'idle';

  @property({ type: String })
  @HostBinding('style.background-color')
  backgroundColor = '#f0f0f0';

  @property({ type: String })
  @HostBinding('style.color')
  textColor = '#333';

  @property({ type: String })
  @HostBinding('style.border')
  border = '2px solid transparent';

  @property({ type: Boolean })
  @HostBinding('class.interactive')
  isInteractive = true;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.state = 'hovered';
    this.backgroundColor = '#e3f2fd';
    this.border = '2px solid #2196f3';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.state = 'idle';
    this.backgroundColor = '#f0f0f0';
    this.border = '2px solid transparent';
  }

  @HostListener('click')
  onClick() {
    this.state = 'clicked';
    this.backgroundColor = '#c8e6c9';
    this.textColor = '#2e7d32';
  }

  @HostListener('focus')
  onFocus() {
    this.state = 'focused';
    this.border = '2px solid #ff9800';
  }

  @HostListener('blur')
  onBlur() {
    this.state = 'idle';
    this.border = '2px solid transparent';
  }
}
```

## 🎯 Advanced Patterns

### Conditional Host Bindings

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';
import { HostBinding } from '@rhtml/decorators';

@Component({
  selector: 'conditional-binding',
  template: () => html` <div>Conditional host bindings</div> `,
})
export class ConditionalBindingComponent extends LitElement {
  @property({ type: String })
  status = 'pending';

  @property({ type: Boolean })
  @HostBinding('class.error')
  get hasError() {
    return this.status === 'error';
  }

  @property({ type: Boolean })
  @HostBinding('class.success')
  get isSuccess() {
    return this.status === 'success';
  }

  @property({ type: Boolean })
  @HostBinding('class.loading')
  get isLoading() {
    return this.status === 'loading';
  }

  @property({ type: String })
  @HostBinding('style.border-color')
  get borderColor() {
    switch (this.status) {
      case 'error':
        return 'red';
      case 'success':
        return 'green';
      case 'loading':
        return 'orange';
      default:
        return 'gray';
    }
  }
}
```

### Custom Event Handling

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';
import { HostListener } from '@rhtml/decorators';

@Component({
  selector: 'custom-events',
  template: () => html`
    <div>
      <h3>Custom Event Handling</h3>
      <p>Last event: ${this.lastEvent}</p>
      <p>Event count: ${this.eventCount}</p>
    </div>
  `,
})
export class CustomEventsComponent extends LitElement {
  @property({ type: String })
  lastEvent = 'none';

  @property({ type: Number })
  eventCount = 0;

  @HostListener('touchstart')
  onTouchStart(event: TouchEvent) {
    this.lastEvent = 'touchstart';
    this.eventCount++;
    console.log('Touch started', event.touches.length);
  }

  @HostListener('touchend')
  onTouchEnd(event: TouchEvent) {
    this.lastEvent = 'touchend';
    this.eventCount++;
    console.log('Touch ended');
  }

  @HostListener('gesturestart')
  onGestureStart(event: Event) {
    this.lastEvent = 'gesturestart';
    this.eventCount++;
    console.log('Gesture started');
  }

  @HostListener('gestureend')
  onGestureEnd(event: Event) {
    this.lastEvent = 'gestureend';
    this.eventCount++;
    console.log('Gesture ended');
  }
}
```

## 🧪 Testing Host Bindings and Listeners

```typescript
import { Component, html, LitElement, property } from '@rxdi/lit-html';
import { HostListener, HostBinding } from '@rhtml/decorators';

@Component({
  selector: 'testable-host',
  template: () => html` <div>Testable component</div> `,
})
export class TestableHostComponent extends LitElement {
  @property({ type: String })
  @HostBinding('attr.data-testid')
  testId = 'testable-host';

  @property({ type: Boolean })
  @HostBinding('class.clicked')
  isClicked = false;

  @property({ type: Number })
  clickCount = 0;

  @HostListener('click')
  handleClick(event: MouseEvent) {
    this.isClicked = true;
    this.clickCount++;
    this.dispatchEvent(
      new CustomEvent('host-clicked', {
        detail: { count: this.clickCount },
      })
    );
  }
}

// Test file
describe('TestableHostComponent', () => {
  let component: TestableHostComponent;

  beforeEach(() => {
    component = document.createElement(
      'testable-host'
    ) as TestableHostComponent;
    document.body.appendChild(component);
  });

  afterEach(() => {
    document.body.removeChild(component);
  });

  it('should update host bindings on click', async () => {
    await component.updateComplete;

    expect(component.getAttribute('data-testid')).toBe('testable-host');
    expect(component.classList.contains('clicked')).toBe(false);

    component.click();
    await component.updateComplete;

    expect(component.classList.contains('clicked')).toBe(true);
    expect(component.clickCount).toBe(1);
  });

  it('should dispatch custom event on click', async () => {
    await component.updateComplete;
    const clickSpy = jest.fn();

    component.addEventListener('host-clicked', clickSpy);
    component.click();

    expect(clickSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { count: 1 },
      })
    );
  });
});
```

## 🎯 Best Practices

### 1. **Event Naming Conventions**

```typescript
// Good
@HostListener('click')
onClick() { }

@HostListener('mouseenter')
onMouseEnter() { }

// Avoid
@HostListener('click')
handleClick() { } // Less descriptive
```

### 2. **Binding Performance**

```typescript
// Good - Use getters for computed values
@HostBinding('class.active')
get isActive() {
  return this.status === 'active';
}

// Avoid - Direct property binding for computed values
@HostBinding('class.active')
isActive = false; // Won't update automatically
```

### 3. **Event Cleanup**

```typescript
// Host listeners are automatically cleaned up when the component is destroyed
// No manual cleanup needed
@HostListener('scroll')
onScroll() {
  // This will be automatically removed when component is destroyed
}
```

### 4. **Type Safety**

```typescript
// Good - Type your event parameters
@HostListener('keydown')
onKeyDown(event: KeyboardEvent) {
  console.log(event.key);
}

// Avoid - Untyped events
@HostListener('keydown')
onKeyDown(event: any) {
  console.log(event.key); // No type safety
}
```

## 🚀 Next Steps

- Learn about [Custom Decorators](/docs/advanced/decorators) for creating your own decorators
- Explore [State Management](/docs/getting-started/state-management) for reactive state handling
- Check out [Testing Strategies](/docs/getting-started/testing) for testing components with host bindings
- Understand [Performance Optimization](/docs/advanced/performance) for optimizing host binding updates
