# @rhtml/experiments

Experimental Components based on `Monadic` approach of building html blocks.
Declarative way of defining `webcomponent` via `html` itself.
In the future no javascript will present inside html only Functional components representing program behaviour 

Monadic `webcomponents` are binded to following rules:

1. Monadadic `webcomponents` are like containers with scoped logic inside
2. `Operators` are empty pure components representing program settings
3. Monad container is creating composable logic based on operators provided inside his `slot`
4. Monad container will clean logic when composition is finished (removing operators from DOM Tree)
5. Rest of the program

#### Installation

```bash
npm i @rhtml/experiments
```

#### Usage

```typescript
import '@rhtml/experiments';
```

## Declarative `webcomponent` creation via `html` only

```html
<r-component>
  <r-selector>r-pesho</r-selector>
  <r-props>
    <r-prop key="pesho" type="Number"></r-prop>
    <r-prop key="pesho2" type="Boolean"></r-prop>
    <r-prop key="pesho3" type="String"></r-prop>
  </r-props>
  <r-render .state=${(s: RPeshoComponent) => html`
    ${s.pesho} | ${s.pesho2} | ${s.pesho3}
  `}>
  </r-render>
</r-component>
<r-pesho pesho="oh my god" pesho2="az sym pesho2" pesho3="az sym pesho3"></r-pesho>
```


### Logic `Map`

- `<r-component>` - Monad container
- `<r-selector>` - Operator for `r-component`
- `<r-template>` - Operator representing `template` for the `webcomponent`
- `<r-props>` - Monadic container storing `properties` of the `webcomponent`
- `<r-prop>` - Monad working only inside `r-props` monad
- `<r-key>` - Operator working only inside `r-prop` monad
- `<r-value>` - Operator working only inside `r-prop` monad


We can represent this as a tree from `top` to `bottom`

1. `r-component`(Monad)(Stores logic for working with `r-selector`, `r-template`, `r-props`)
2. `r-selector`(Operator working with `r-component` monad)
3. `r-template`(Operator working with `r-component` monad)
4. `r-props`(Monad) (Stores logic for `r-prop` monad)
5. `r-prop`(Monad)(Stores logic for `r-key` and `r-value` composition)
6. `r-key`(Operator working inside `r-prop` monad)
7. `r-value`(Operator working inside `r-prop` monad)


```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                   ┌───────────────┐                                                                       │
│                   │ `r-component` │                                                                       │
│                   │ ┌───────────┐ │                                                                       │
│                   │ │   Monad   │ │ - Stores logic for working with `r-selector`, `r-template`, `r-props` │                   
│                   │ └───────────┘ │                                                                       │ 
│                   └───────────────┘                                                                       │
│                           |                                                                               │
│ ┌───────────────┐ ┌───────────────┐  ┌───────────────┐                                                    │
│ │ `r-selector`  │ │ `r-template`  │  │   `r-props`   │                                                    │
│ │ ┌───────────┐ │ │ ┌───────────┐ │  │ ┌───────────┐ │                                                    │
│ │ │ Operator  │ │ │ │ Operator  │ │  │ │   Monad   │ │  - Components working with `r-component` monad     │
│ │ └───────────┘ │ │ └───────────┘ │  │ └───────────┘ │  - `r-props` Stores logic for `r-prop` monad       │
│ └───────────────┘ └───────────────┘  └───────────────┘                                                    │
│                                              |                                                            │
│                                      ┌───────────────┐                                                    │
│                                      │    `r-prop`   │                                                    │
│                                      │ ┌───────────┐ │                                                    │
│                                      │ │   Monad   │ │ - Monad working with `r-props` monad               │
│                                      │ └───────────┘ │                                                    │
│                                      └───────────────┘                                                    │
│                                              |                                                            │
│                             ┌───────────────┐ ┌───────────────┐                                           │
│                             │    `r-key`    │ │    `r-value`  │                                           │
│                             │ ┌───────────┐ │ │ ┌───────────┐ │                                           │
│                             │ │ Operator  │ │ │ │ Operator  │ │  -Operators working inside `r-prop`       |
│                             │ └───────────┘ │ │ └───────────┘ │                                           │
│                             └───────────────┘ └───────────────┘                                           │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```





### High order web components created via `html`

1. `r-render > state` will be executed everytime when property is changed
2. `State` of the component can be changed with `setState` function exposed on second argument
3. `setState` function will trigger change detection only on properties defined inside `r-props` as `r-prop` with `key` and `type`
4. There is a single predfined property called `loading` and  it is set by default to `true`.
This property is important since it can be used to show loading information when long running job is executed 

```html
<r-component>
  <r-selector>r-counter</r-selector>
  <r-props>
    <r-prop key="value" type="Number"></r-prop>
  </r-props>
  <r-render .state=${({ value, loading }, setState) => html`
    <button @click=${() => setState({ value: value + value, loading: false })}>
      Increment
    </button>
    <r-if .exp=${loading}>
      Loading...
    </r-if>
    <p>${value}</p>
  `}>
  </r-render>
</r-component>
```

Can be used as follow:

```html
<r-counter value="5"></r-counter>
```


### `Webcomponent` as a `Service`
Important aspect of usage is that `components as a service` are `fire and forget` what does that mean ?

1. When component is initialized component will be `self destroyed` with `this.remove()`
2. Once initialized inside the `DOM Tree` `service component` will fire `run` method and is no longer needed inside the dom tree
3. The `run` command is executed and our `running` job stay alive even after component is self removed
4. The idea to component be removed once initialized is in order to remove unused component from the `DOM` since we use it only for getting our data from backend(for example)

User service
```ts
import { Component } from '@rxdi/lit-html';
import { LitServiceElement } from '@rhtml/experiments';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'user-service'
})
export class UserService extends LitServiceElement {
  getUserById(id: number) {
    return of({id, name: 'Kristyian Tachev'}).pipe(delay(2000)).toPromise()
  }
}
```

What is `LitServiceElement` ? 

1. A generic class defining 2 simple metods `run` and `OnUpdateFirst`

```ts
import { LitElement, property } from '@rxdi/lit-html';

export class LitServiceElement<T = {}> extends LitElement {
  @property({ type: Object })
  run: (self: T) => void = () => null;

  OnUpdateFirst() {
    this.remove();
    this.run.call(this);
  }
}

```

2. After that we can use our `webcomponent service` like so:

```ts
html`
<user-service .run=${async function(this: UserService) {
  const user = await this.getUserById(userId);
  console.log(user);
}}
></user-service>
`
```

Real world example
```ts
interface IUser {
  id: number;
  name: string;
}
interface IState {
  userId: number;
  user: IUser;
}
```

```html
<r-part>
  <r-state .value=${{ loading: true, userId: 1, user: {} }}></r-state>
  <r-render .state=${({ userId, loading, user }: IState, setState: (state: IState) => void) => html`
    <user-service .run=${async function(this: UserService) {
      setState({
        userId,
        user: await this.getUserById(userId),
        loading: false
      });
    }}
    ></user-service>
    <r-if .exp=${loading}>
      Loading
    </r-if>
    <r-if .exp=${!loading}>
      <p>User id: ${user.id}</p>
      <p>User name: ${user.name}</p>
    </r-if>
  `}
  >
  </r-render>
</r-part>
```

### Hydrating component so it will become `web-component`

```ts
import { Hydrate } from '@rhtml/experiments';
import { UserService } from './user.service'; /* used only for typing purposes will not be included in bundle */

const UserProfile = html`
  <r-component>
    <r-selector>user-profile</r-selector>
    <r-props>
      <r-prop key="userId" type="String"></r-prop>
    </r-props>
    <r-render .state=${({ loading, userId, user = {} }: IState, setState: (s: IState) => void) => html`
      <user-service .run=${async function(this: UserService) {
        setState({
          userId,
          user: await this.getUserById(userId),
          loading: false
        });
      }}
      ></user-service>
      <r-if .exp=${loading}>
        Loading...
      </r-if>
      <r-if .exp=${!loading}>
        <p>User id: ${user.id}</p>
        <p>User name: ${user.name}</p>
      </r-if>
    `}>
    </r-render>
  </r-component>
`;

Hydrate(UserProfile);

export declare class UserProfileComponent extends LitElement {
  userId: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'user-profile': UserProfileComponent;
  }
}
```

```html
 <user-profile userId="100000"></user-profile>
```
