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

customAttributes.define('red', BackgroundColor);
```

#### Usage inside @rxdi/lit-html with custom registry

```typescript
import { Component, LitElement, html } from '@rxdi/lit-html';
import { CustomAttributeRegistry } from '@rhtml/custom-attributes';

export class BackgroundColor extends Attribute {
  static options(this: HTMLElement) {
    return {
      name: 'myAttribute',
      registry: new CustomAttributeRegistry(this.shadowRoot)
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

@Component({
  selector: 'home-component',
  modifiers: [BackgroundColor],
  template(this: HomeComponent) {
    return html`
      <div myAttribute="red">Background</div>
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
      name: 'myAttribute'
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

@Component({
  selector: 'home-component',
  registry(this: HomeComponent) {
    return new CustomAttributeRegistry(this.shadowRoot);
  },
  modifiers: [BackgroundColor],
  template(this: HomeComponent) {
    return html`
      <div myAttribute="red">Background</div>
    `;
  }
})
export class HomeComponent extends LitElement {}
```
