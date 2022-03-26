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
  static options(this: HTMLElement) {
    return {
      selector: 'myAttribute'
    };
  }

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
