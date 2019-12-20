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
  <r-template .value=${(s) => html`${s.pesho}daad ${s.pesho2}`}></r-template>
  <r-props>
    <r-prop>
      <r-key>pesho</r-key>
      <r-value>String</r-value>
    </r-prop>
    <r-prop>
      <r-key>pesho2</r-key>
      <r-value>String</r-value>
    </r-prop>
    <r-prop>
      <r-key>pesho3</r-key>
      <r-value>String</r-value>
    </r-prop>
  </r-props>
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