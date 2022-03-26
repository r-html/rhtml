# @rhtml/decorators

#### Installation

```bash
npm i @rhtml/decorators
```

#### Usage

```typescript
import { Attribute, Options } from '@rhtml/custom-attributes';
import { Input, HostListener } from '@rhtml/decorators';

export class TestDirective extends Attribute {
  @Input()
  myProperty: string;

  public static options(this: HTMLElement): Options {
    return {
      name: 'test'
    };
  }

  @HostListener('mouseenter')
  enter(event: Event) {
    console.log('ENTER', this, event);
    console.log(this.myProperty);
  }

  @HostListener('mouseleave')
  leave(event: Event) {
    console.log('LEAVE', this, event);
    console.log(this.myProperty);
  }
}
```

```html
<div test myProperty="12312">
  111
</div>
```

#### Usage inside @rxdi/lit-html

```typescript
import { Component, html, LitElement } from '@rxdi/lit-html';

import { HostListener } from '@rhtml/decorators';

/**
 * @customElement home-component
 */
@Component({
  selector: 'home-component',
  template(this) {
    return html`
      Home Component
    `;
  }
})
export class HomeComponent extends LitElement {
  @HostListener('mouseenter') onEnter() {
    console.log('Enter home');
  }

  @HostListener('mouseleave') onLeave() {
    console.log('Leave home');
  }
}
```
