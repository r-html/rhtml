# @rhtml/custom-attributes

#### Installation

```bash
npm i @rhtml/custom-attributes
```

#### Usage

```typescript
import { CustomAttributeRegistry, Attribute } from '@rhtml/custom-attributes';

const customAttributes = new CustomAttributeRegistry(document);

class BackgroundColor extends Attribute {
  OnInit() {
    console.log('Attribute initialized');
    this.setColor();
  }

  OnDestroy() {
    console.log('Attribute destroyed');
    this.element.style.backgroundColor = null;
  }

  OnUpdate(oldValue: string, newValue: string) {
    console.log('Attribute updated');
    this.setColor();
  }

  private setColor() {
    this.element.style.backgroundColor = this.value;
  }
}

customAttributes.define('background', BackgroundColor);
```

#### Usage inside @rxdi/lit-html with custom registry and @Modifier decorator

```typescript
import { Component, LitElement, html } from '@rxdi/lit-html';
import { Modifier, CustomAttributeRegistry } from '@rhtml/custom-attributes';

@Modifier({
  selector: 'background',
  registry(this) {
    return new CustomAttributeRegistry(this.shadowRoot);
  }
})
export class BackgroundColor extends Attribute {
  OnInit() {
    console.log('Attribute initialized');
    this.setColor();
  }

  OnDestroy() {
    console.log('Attribute destroyed');
    this.element.style.backgroundColor = null;
  }

  OnUpdate(oldValue: string, newValue: string) {
    console.log('Attribute updated');
    this.setColor();
  }

  private setColor() {
    this.element.style.backgroundColor = this.value;
  }
}

@Component({
  selector: 'home-component',
  modifiers: [BackgroundColor],
  template(this: HomeComponent) {
    return html`
      <div background="red">Background</div>
    `;
  }
})
export class HomeComponent extends LitElement {}
```

#### Usage with per component registry

```typescript
import { Component, LitElement, html } from '@rxdi/lit-html';
import { CustomAttributeRegistry } from '@rhtml/custom-attributes';

export class BackgroundColor extends Attribute {
  static options = {
    selector: 'myAttribute'
  };

  OnInit() {
    console.log('Attribute initialized');
    this.setColor();
  }

  OnDestroy() {
    console.log('Attribute destroyed');
    this.element.style.backgroundColor = null;
  }

  OnUpdate(oldValue: string, newValue: string) {
    console.log('Attribute updated');
    this.setColor();
  }

  private setColor() {
    this.element.style.backgroundColor = this.value;
  }
}

@Component<HomeComponent>({
  selector: 'home-component',
  registry(this) {
    return new CustomAttributeRegistry(this.shadowRoot);
  },
  modifiers: [BackgroundColor],
  template(this) {
    return html`
      <div myAttribute="red">Background</div>
    `;
  }
})
export class HomeComponent extends LitElement {}
```

#### Decorator @CustomAttribute or @Modifier there are the same

There is a way to define `options` static method as a typescript decorator

```typescript
import { CustomAttribute, Modifier } from '@rhtml/custom-attributes';

@CustomAttribute({
  selector: 'background'
})
export class BackgroundColor extends Attribute {}

@Modifier({
  selector: 'background'
})
export class BackgroundColor extends Attribute {}
```

#### Modifier accepts also decorators from @rhtml/decorators

```typescript
import { Modifier, Input } from '@rhtml/custom-attributes';
import { HostListener } from '@rhtml/decorators';

@Modifier({
  selector: 'hover'
})
export class Hoverable extends Attribute {
  @Input()
  myProperty: string;

  @HostListener('mouseenter')
  enter(event: Event) {
    console.log('Enter', event);
  }

  @HostListener('mouseleave')
  leave(event: Event) {
    console.log('Leave', event);
  }
}
```

```html
<div hover myProperty="123">Lorem ipsum dolor</div>
```

#### Observing properties defined with @Input decorator

Sometimes we want our Modifier to be more extensible and we want to create complex
logic like for example to listen for specific property changes inside of our modifier

```typescript
import { Modifier, Input } from '@rhtml/custom-attributes';
import { HostListener } from '@rhtml/decorators';

@Modifier({
  selector: 'hover'
})
export class Hoverable extends Attribute {
  @Input({ observe: true })
  myProperty: string;

  OnUpdateAttribute(name: string, value: string) {
    /* This will be triggered on every update of the attribute myProperty */
    console.log(this.myProperty);
  }
}
```

#### Advanced usage without Decorators

```typescript
import { Attribute, CustomAttributeRegistry } from '@rhtml/custom-attributes';

export class Animation extends Attribute {
  static options = {
    selector: 'animated',
    registry(this: HTMLElement) {
      return new CustomAttributeRegistry(this);
    },
    observedAttributes: ['delay']
  };

  get delay() {
    return this.element.getAttribute('delay');
  }

  OnInit() {
    this.modify();
  }

  OnDestroy() {
    this.element.classList.remove('animated', this.value);
    this.element.style.animationDelay = null;
  }

  OnUpdate() {
    this.modify();
  }

  OnUpdateAttribute() {
    this.modify();
  }

  private modify() {
    this.element.classList.add('animated', this.value);
    this.element.style.animationDelay = this.delay;
  }
}
```

#### Same example but with Decorators

```typescript
import {
  Attribute,
  CustomAttributeRegistry,
  Input,
  Modifier
} from '@rhtml/custom-attributes';
import { Animations, AnimationsType } from './animate.css';

interface Styles {
  animationDelay: string;
}

@Modifier({
  selector: 'animated',
  registry(this: HTMLElement) {
    return new CustomAttributeRegistry(this);
  }
})
export class Animation extends Attribute<Styles> {
  @Input({ observe: true })
  delay: string;

  value: AnimationsType;

  OnInit() {
    this.pushStylesToParent();
    this.modify();
  }

  OnDestroy() {
    this.element.classList.remove('animated', this.value);
    this.setStyles({ animationDelay: null })(this.element);
  }

  OnUpdate() {
    this.modify();
  }

  OnUpdateAttribute() {
    this.modify();
  }

  private modify() {
    this.element.classList.add('animated', this.value);
    this.setStyles({ animationDelay: this.delay })(this.element);
  }

  private pushStylesToParent() {
    const style = document.createElement('style');
    style.innerHTML = `${Animations}`;
    const root = this.parent.shadowRoot ?? this.parent;
    root.prepend(style);
  }
}
```

By changing `delay` attribute because we use `observe: true` method `OnUpdateAttribute` will be triggered

```html
<h2 animated="slideInLeft" delay="1s">
  My Animated Element
</h2>
```
