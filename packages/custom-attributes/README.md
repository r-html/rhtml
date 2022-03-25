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

  setColor() {
    this.element.style.backgroundColor = this.value;
  }
}

customAttributes.define('red', BackgroundColor);
```

#### Usage inside @rxdi/lit-html

```typescript
import { Component, LitElement, html } from '@rxdi/lit-html';

export class BackgroundColor extends Attribute {
  static options(this: HTMLElement) {
    return {
      name: 'myAttribute',
      registry: CustomAttributeRegistry
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

  setColor() {
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
