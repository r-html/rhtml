# @rhtml/decorators

#### Installation

```bash
npm i @rhtml/decorators
```

#### Usage

```typescript
import { Attribute, Options, Input } from '@rhtml/custom-attributes';
import { HostListener } from '@rhtml/decorators';

@Modifier({
  selector: 'test'
})
export class TestDirective extends Attribute {
  @Input()
  myProperty: string;

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

#### @HostBinding and @Input decorators

Specifiyng Input and HostBinding decorator gives you an reactive ability to assign styles directly to input properties
This way by editing `padding`, `color` or `background` will reflect to the style associated with
By doing this we can skip `OnInit`, `OnDestroy`, `OnUpdate` manual assign inside hooks

```typescript
import { Attribute, Input, Modifier } from '@rhtml/custom-attributes';
import { HostBinding } from '@rhtml/decorators';

@Modifier({
  selector: 'layout'
})
export class CustomLayout extends Attribute {
  @Input({ observe: true })
  @HostBinding('style.padding')
  padding: string;

  @Input({ observe: true })
  @HostBinding('style.color')
  color: string;

  @Input({ observe: true })
  @HostBinding('style.background')
  background: string;
}
```
