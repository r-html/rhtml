# @rhtml/modifiers

#### Installation

```bash
npm i @rhtml/modifiers
```

Every modifier is actually `custom attribute` and modifiers is using package [@rhtml/custom-attributes](../custom-attributes)

## FlexLayout Modifiers

Inspired by Angular Flex Layout, FlexLayout provides declarative responsive layout directives for web components. It uses CSS flexbox under the hood and supports media query breakpoints for adaptive layouts.

### Available Directives

| Directive | Description |
|-----------|-------------|
| `fxLayout` | Sets flexbox layout direction (row/column) |
| `fxLayoutGap` | Adds spacing between flex children |
| `fxLayoutAlign` | Sets alignment of flex children |
| `fxFlex` | Controls flex sizing of elements |
| `fxFlexFill` | Makes element fill available space |
| `fxFlexAlign` | Aligns a single element (align-self) |
| `fxFlexOffset` | Adds left margin offset |
| `fxFlexOrder` | Changes element order |

### Breakpoints

FlexLayout supports responsive breakpoints matching Angular Flex Layout:

| Breakpoint | Media Query | Description |
|------------|-------------|-------------|
| `xs` | `(max-width: 599px)` | Extra small screens |
| `sm` | `(600px - 959px)` | Small screens |
| `md` | `(960px - 1279px)` | Medium screens |
| `lg` | `(1280px - 1919px)` | Large screens |
| `xl` | `(1920px+)` | Extra large screens |
| `lt-sm` | `(max-width: 599px)` | Less than small |
| `lt-md` | `(max-width: 959px)` | Less than medium |
| `lt-lg` | `(max-width: 1279px)` | Less than large |
| `gt-xs` | `(min-width: 600px)` | Greater than extra small |
| `gt-sm` | `(min-width: 960px)` | Greater than small |
| `gt-md` | `(min-width: 1280px)` | Greater than medium |
| `gt-lg` | `(min-width: 1920px)` | Greater than large |

Usage: `fxLayout.lt-md="column"` applies column layout on screens smaller than medium.

#### Usage

```typescript
import { Component, css, html, LitElement } from '@rxdi/lit-html';

import { FlexLayout } from '@rhtml/modifiers';

/**
 * @customElement home-component
 */
@Component({
  selector: 'home-component',
  style: css`
    .container {
      height: 200px;
    }

    .block {
      background: red;
      flex: 1;
    }
  `,
  modifiers: [...FlexLayout],
  template(this: HomeComponent) {
    return html`
      <div class="container" fxLayout="row" fxLayoutGap="10px">
        <div>
          <div class="block" fxLayoutAlign="center center" fxFlexFill>A</div>
        </div>
        <div>
          <div class="block" fxLayoutAlign="center center" fxFlexFill>B</div>
        </div>
        <div>
          <div class="block" fxLayoutAlign="center center" fxFlexFill>C</div>
        </div>
        <div>
          <div class="block" fxLayoutAlign="center center" fxFlexFill>D</div>
        </div>
      </div>
    `;
  }
})
export class HomeComponent extends LitElement {}
```

### fxLayout

Sets `display: flex` and `flex-direction` on the element.

```html
<!-- Row layout (default) -->
<div fxLayout="row">...</div>

<!-- Column layout -->
<div fxLayout="column">...</div>

<!-- Row with wrap -->
<div fxLayout="row wrap">...</div>

<!-- Responsive: row on desktop, column on mobile -->
<div fxLayout="row" fxLayout.lt-md="column">...</div>
```

**Values:** `row`, `column`, `row wrap`, `column wrap`, `row inline`, `column inline`

### fxLayoutGap

Adds spacing between flex children. Applies margin to children (not on the container itself).

```html
<!-- 10px gap between children -->
<div fxLayout="row" fxLayoutGap="10px">...</div>

<!-- Different gap on mobile -->
<div fxLayout="row" fxLayoutGap="0px" fxLayoutGap.lt-md="15px">...</div>
```

**Note:** In row layout, margin applies to the right side of each child except the last. In column layout, margin applies to the bottom of each child except the last.

### fxLayoutAlign

Controls alignment of flex children along main and cross axes.

Format: `fxLayoutAlign="<main-axis> <cross-axis>"`

| Value | CSS Property |
|-------|--------------|
| `start` | `justify-content: flex-start` |
| `center` | `justify-content: center` |
| `end` | `justify-content: flex-end` |
| `space-between` | `justify-content: space-between` |
| `space-around` | `justify-content: space-around` |
| `space-evenly` | `justify-content: space-evenly` |
| `stretch` | `align-items: stretch` |

```html
<!-- Space items horizontally, center vertically -->
<div fxLayout="row" fxLayoutAlign="space-between center">...</div>

<!-- Start horizontally, stretch vertically -->
<div fxLayout="row" fxLayoutAlign="start stretch">...</div>

<!-- Center both axes -->
<div fxLayoutAlign="center center">...</div>
```

**Note:** First value is main-axis (justify-content), second value is cross-axis (align-items). If only one value is provided, it applies to both axes.

### fxFlex

Controls the flex property of an element. Supports various value formats:

```html
<!-- Fill remaining space (default flex: 1 1 0.000000001px) -->
<div fxFlex>...</div>

<!-- Explicit empty (same as above) -->
<div fxFlex="">...</div>

<!-- 20% width, no grow -->
<div fxFlex="0 1 20%">...</div>

<!-- 100% width -->
<div fxFlex="100%">...</div>

<!-- Responsive: 100% on mobile, 50% on tablet -->
<div fxFlex="100%" fxFlex.gt-sm="50%">...</div>

<!-- Auto (grow and shrink) -->
<div fxFlex="auto">...</div>

<!-- None (flex: none) -->
<div fxFlex="none">...</div>
```

**Value Formats:**
- Empty/no value → `flex: 1 1 0.000000001px` (fills space)
- Percentage → `flex: 1 1 <percentage>` (e.g., `25%` → `flex: 1 1 25%`)
- `auto` → `flex: 1 1 auto`
- `none` → `flex: none`
- Three parts → `flex: <grow> <shrink> <basis>`

### fxFlexFill

Makes the element fill available space in a flex container.

```html
<div fxFlexFill>...</div>
```

**CSS Applied:**
```css
margin: 0;
height: 100%;
width: 100%;
min-height: 100%;
min-width: 100%;
```

### fxFlexAlign

Aligns a single element within a flex container (uses `align-self`).

```html
<div fxFlexAlign="center">...</div>
```

**Values:** `start`, `center`, `end`, `stretch`, `baseline`

### fxFlexOffset

Adds left margin offset to an element.

```html
<div fxFlexOffset="20px">...</div>
```

### fxFlexOrder

Changes the order of an element in a flex container.

```html
<div fxFlexOrder="1">...</div>
```

### Complete Example with Responsive Layout

```typescript
import { Component, html, LitElement } from '@rxdi/lit-html';
import { FlexLayout } from '@rhtml/modifiers';

@Component({
  selector: 'dashboard-component',
  modifiers: [...FlexLayout],
  template(this: DashboardComponent) {
    return html`
      <!-- Main container: row on desktop, column on mobile -->
      <div
        fxLayout="row wrap"
        fxLayout.lt-md="column"
        fxLayoutGap="0px"
        fxLayoutGap.lt-md="15px"
        fxLayoutAlign="start stretch"
      >
        <!-- Table section: fills remaining space (80%) -->
        <div class="table-section" fxFlex="" fxFlex.lt-md="100%">
          <!-- table content -->
        </div>

        <!-- Sidebar: fixed 20% width -->
        <aside fxFlex="0 1 20%" fxFlex.lt-md="100%">
          <!-- sidebar content -->
        </aside>
      </div>
    `;
  }
})
export class DashboardComponent extends LitElement {}
```

### Best Practices

1. **Use `fxFlex="0 1 20%"` for fixed-width sidebars** - The `0` for grow prevents expansion beyond the basis
2. **Use `fxFlex=""` for content areas** - This fills remaining space with default flex behavior
3. **Use responsive suffixes** (`.lt-md`, `.gt-sm`) for adaptive layouts
4. **Combine with CSS** - FlexLayout provides inline styles; use CSS classes for complex styling

## Angular Layout

`ngIf` attribute available at the moment to test the logic which represents

```typescript
import { Component, html, LitElement, state } from '@rxdi/lit-html';

import { AngularLayout } from '@rhtml/modifiers';

/**
 * @customElement home-component
 */
@Component({
  selector: 'home-component',
  modifiers: [...AngularLayout],
  template(this: HomeComponent) {
    return html`
      <div ngIf=${this.show}>
        My Content
      </div>

      <button @click=${() => this.toggle()}>Toggle</button>
    `;
  }
})
export class HomeComponent extends LitElement {
  @state()
  show: boolean;

  toggle() {
    this.show = !this.show;
  }
}
```

## Animation modifier

List of available animations can be found [Here](./src/animation/interfaces.ts)

```typescript
import { Component, html, LitElement } from '@rxdi/lit-html';

import { Animation } from '@rhtml/modifiers';

/**
 * @customElement home-component
 */
@Component({
  selector: 'home-component',
  modifiers: [Animation],
  template(this: HomeComponent) {
    return html`
      <h2 animated="slideInLeft" delay="1s">
        Your Animated Element
      </h2>
    `;
  }
})
export class HomeComponent extends LitElement {}
```