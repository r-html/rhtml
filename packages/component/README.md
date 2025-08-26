# Strange component representing more functional approach of defining decorators

```typescript
import { DefineDependencies, Component } from '@rhtml/component';
import { Container, Injectable } from '@rxdi/core';
import { html, LitElement, property } from '@rxdi/lit-html';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
class CounterService {
  counter = 55;
}

const Providers = DefineDependencies(CounterService)(Container);

@Component({
  Settings: {
    selector: 'counter-component'
  },
  Providers,
  State: function(this: CounterComponent, [counterService]) {
    return interval(1000).pipe(
      map(value => ({ counter: this.counter + counterService.counter + value }))
    );
  },
  Render: ([counterService]) =>
    function(this, { counter }) {
      return html`
        ${counter} ${counterService.counter}
      `;
    }
})
export class CounterComponent extends LitElement {
  @property({ type: Number })
  counter: number;
}

/* 
  <counter-component .counter=${1000}></counter-component>
*/
```

#### Functional composition

```ts
import { Partial } from '@rhtml/component';

const compose = <T, D = []>(selector: string, styles?: CSSResult[], deps?: D) =>
  Partial<T, D>({
    selector,
    styles
  })(deps);

const state = () => interval(1000).pipe(map(() => new Date().getSeconds()));

@(compose<number>('date-component')(state)(() => date => date))
export class DateComponent extends LitElement {}

@(compose<number, typeof Dependencies>(
  'date-component2',
  null,
  Dependencies
)(([appService]) => state().pipe(map(res => res)))(() => date => date))
export class DateComponent2 extends LitElement {}

@(compose<number>('date-component3')(state)(() => date =>
  html`
    ${date}
  `
))
export class DateComponent3 extends LitElement {}
```

#### Usage inside DOM

```html
<date-component></date-component>
<date-component2></date-component2>
<date-component3></date-component3>
```

```ts
import { Component } from '@rhtml/component';
/**
 * @customElement counter-component
 */
@Component<{ counter: number }, [], CounterComponent>({
  Settings: {
    selector: 'counter-component',
    style: css`
      .counter {
        background: red;
        color: white;
      }
    `
  },
  Providers: [],
  State: function(this) {
    return combineLatest([this.counter, this.mega]).pipe(
      map(([value, v2]) => ({ counter: value + v2 }))
    );
  },
  Render: () =>
    function(this, { counter }, setState) {
      return html`
        <p>${counter}</p>
        <button @click=${() => setState({ counter: counter + counter })}>
          CLICK ME
        </button>
      `;
    }
})
export class CounterComponent extends LitElement {
  @property({ type: Object })
  counter: Observable<number>;

  @property({ type: Object })
  mega: Observable<number>;
}
```

```ts
import { Component, DefineDependencies } from '@rhtml/component';

@Component({
  Settings: {
    selector: 'date-component'
  },
  Providers: DefineDependencies(AppsService, SocialService)(Container),
  State: ([appService, socialService]) =>
    interval(1000).pipe(map(() => new Date().getSeconds())),
  Render: ([appService, socialService]) => seconds => seconds
})
export class ComposableComponent extends LitElement {}
```
