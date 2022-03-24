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

#### Interface of class Attribute

```typescript
export abstract class Attribute {
  public element: HTMLElement;
  public value: string;
  public name: string;

  OnInit(): void {
    /* */
  }

  OnDestroy(): void {
    /* */
  }

  OnUpdate(_oldValue: string, _newValue: string) {
    /* */
  }
}
```
