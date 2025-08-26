---
sidebar_position: 2
---

# Reactive Operators

@rhtml provides a powerful set of reactive operators that enable declarative programming patterns directly in HTML templates. These operators are inspired by functional programming concepts and provide a clean, composable way to handle data transformations and UI logic.

## 🚀 Installation

```bash
npm install @rhtml/operators
```

## 📦 Core Operators

### r-for

Iterate over arrays, objects, or observables:

```typescript
import { Component } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';
import '@rhtml/operators';

@Component({
  selector: 'list-component',
  template: () => html`
    <r-for .of=${this.items}>
      <r-let .item=${item => html`
        <div class="item">${item}</div>
      `}></r-let>
    </r-for>
  `
})
export class ListComponent extends LitElement {
  @property({ type: Array })
  items = ['Item 1', 'Item 2', 'Item 3'];
}
```

### r-let

Transform data and create local variables:

```typescript
@Component({
  selector: 'transform-component',
  template: () => html`
    <r-let .data=${this.users} .item=${user => html`
      <div class="user-card">
        <h3>${user.name}</h3>
        <p>${user.email}</p>
        <span class="status ${user.active ? 'active' : 'inactive'}">
          ${user.active ? 'Active' : 'Inactive'}
        </span>
      </div>
    `}></r-let>
  `
})
export class TransformComponent extends LitElement {
  @property({ type: Array })
  users = [
    { name: 'John Doe', email: 'john@example.com', active: true },
    { name: 'Jane Smith', email: 'jane@example.com', active: false }
  ];
}
```

### r-if

Conditional rendering with reactive conditions:

```typescript
@Component({
  selector: 'conditional-component',
  template: () => html`
    <r-if .condition=${this.isLoggedIn}>
      <r-let .item=${() => html`
        <div class="welcome">
          <h2>Welcome back, ${this.userName}!</h2>
          <button @click=${() => this.logout()}>Logout</button>
        </div>
      `}></r-let>
    </r-if>
    
    <r-if .condition=${!this.isLoggedIn}>
      <r-let .item=${() => html`
        <div class="login">
          <h2>Please log in</h2>
          <button @click=${() => this.login()}>Login</button>
        </div>
      `}></r-let>
    </r-if>
  `
})
export class ConditionalComponent extends LitElement {
  @property({ type: Boolean })
  isLoggedIn = false;

  @property({ type: String })
  userName = '';

  login() {
    this.isLoggedIn = true;
    this.userName = 'John Doe';
  }

  logout() {
    this.isLoggedIn = false;
    this.userName = '';
  }
}
```

### r-switch

Multi-condition rendering:

```typescript
@Component({
  selector: 'switch-component',
  template: () => html`
    <r-switch .value=${this.status}>
      <r-case .value=${'loading'}>
        <r-let .item=${() => html`
          <div class="loading">Loading...</div>
        `}></r-let>
      </r-case>
      
      <r-case .value=${'success'}>
        <r-let .item=${() => html`
          <div class="success">Data loaded successfully!</div>
        `}></r-let>
      </r-case>
      
      <r-case .value=${'error'}>
        <r-let .item=${() => html`
          <div class="error">An error occurred: ${this.errorMessage}</div>
        `}></r-let>
      </r-case>
      
      <r-default>
        <r-let .item=${() => html`
          <div class="unknown">Unknown status</div>
        `}></r-let>
      </r-default>
    </r-switch>
  `
})
export class SwitchComponent extends LitElement {
  @property({ type: String })
  status = 'loading';

  @property({ type: String })
  errorMessage = '';
}
```

## 🔄 Reactive Data Sources

### Observable Integration

Work with RxJS observables seamlessly:

```typescript
import { Component } from '@rhtml/component';
import { html, LitElement, property } from '@rxdi/lit-html';
import { BehaviorSubject, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import '@rhtml/operators';

@Component({
  selector: 'observable-component',
  template: () => html`
    <r-for .of=${this.dataStream$}>
      <r-let .item=${item => html`
        <div class="data-item">
          <span>Value: ${item.value}</span>
          <span>Timestamp: ${item.timestamp}</span>
        </div>
      `}></r-let>
    </r-for>
  `
})
export class ObservableComponent extends LitElement {
  private dataStream$ = interval(1000).pipe(
    map(i => ({
      value: i,
      timestamp: new Date().toISOString()
    }))
  );
}
```

### Async Data Handling

Handle async operations with loading states:

```typescript
@Component({
  selector: 'async-component',
  template: () => html`
    <r-let .data=${this.asyncData$} .item=${({ data, loading, error }) => html`
      ${loading ? html`
        <div class="loading">Loading data...</div>
      ` : ''}
      
      ${error ? html`
        <div class="error">Error: ${error.message}</div>
      ` : ''}
      
      ${data ? html`
        <div class="data">
          ${data.map(item => html`
            <div class="item">${item.name}</div>
          `)}
        </div>
      ` : ''}
    `}></r-let>
  `
})
export class AsyncComponent extends LitElement {
  private asyncData$ = new BehaviorSubject({
    data: null,
    loading: true,
    error: null
  });

  async connectedCallback() {
    super.connectedCallback();
    
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      
      this.asyncData$.next({
        data,
        loading: false,
        error: null
      });
    } catch (error) {
      this.asyncData$.next({
        data: null,
        loading: false,
        error
      });
    }
  }
}
```

## 🎨 Advanced Patterns

### Nested Operators

Combine operators for complex transformations:

```typescript
@Component({
  selector: 'nested-operators',
  template: () => html`
    <r-for .of=${this.categories}>
      <r-let .item=${category => html`
        <div class="category">
          <h3>${category.name}</h3>
          
          <r-if .condition=${category.items.length > 0}>
            <r-let .item=${() => html`
              <r-for .of=${category.items}>
                <r-let .item=${item => html`
                  <div class="item ${item.active ? 'active' : ''}">
                    <span>${item.name}</span>
                    <span class="count">${item.count}</span>
                  </div>
                `}></r-let>
              </r-for>
            `}></r-let>
          </r-if>
          
          <r-if .condition=${category.items.length === 0}>
            <r-let .item=${() => html`
              <div class="empty">No items in this category</div>
            `}></r-let>
          </r-if>
        </div>
      `}></r-let>
    </r-for>
  `
})
export class NestedOperatorsComponent extends LitElement {
  @property({ type: Array })
  categories = [
    {
      name: 'Fruits',
      items: [
        { name: 'Apple', count: 5, active: true },
        { name: 'Banana', count: 3, active: false }
      ]
    },
    {
      name: 'Vegetables',
      items: []
    }
  ];
}
```

### Custom Transformations

Create reusable transformation functions:

```typescript
// transformations/user-transforms.ts
export const userTransforms = {
  formatName: (user: any) => `${user.firstName} ${user.lastName}`,
  formatEmail: (user: any) => user.email.toLowerCase(),
  isActive: (user: any) => user.status === 'active',
  getAvatar: (user: any) => user.avatar || '/default-avatar.png'
};

// transformations/date-transforms.ts
export const dateTransforms = {
  formatDate: (date: string) => new Date(date).toLocaleDateString(),
  formatTime: (date: string) => new Date(date).toLocaleTimeString(),
  isToday: (date: string) => {
    const today = new Date().toDateString();
    return new Date(date).toDateString() === today;
  }
};

// Usage in component
@Component({
  selector: 'user-list',
  template: () => html`
    <r-for .of=${this.users}>
      <r-let .item=${user => html`
        <div class="user-card">
          <img src="${userTransforms.getAvatar(user)}" alt="${userTransforms.formatName(user)}">
          <div class="user-info">
            <h3>${userTransforms.formatName(user)}</h3>
            <p>${userTransforms.formatEmail(user)}</p>
            <span class="status ${userTransforms.isActive(user) ? 'active' : 'inactive'}">
              ${userTransforms.isActive(user) ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div class="last-seen">
            ${dateTransforms.isToday(user.lastSeen) ? 'Today' : dateTransforms.formatDate(user.lastSeen)}
          </div>
        </div>
      `}></r-let>
    </r-for>
  `
})
export class UserListComponent extends LitElement {
  @property({ type: Array })
  users = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'JOHN@EXAMPLE.COM',
      status: 'active',
      avatar: '/avatars/john.jpg',
      lastSeen: new Date().toISOString()
    }
  ];
}
```

### Reactive Computations

Create computed values that update automatically:

```typescript
import { computed } from '@rhtml/operators';

@Component({
  selector: 'computed-component',
  template: () => html`
    <r-let .data=${this.computedData$} .item=${({ total, average, activeCount }) => html`
      <div class="stats">
        <div class="stat">
          <span class="label">Total Items:</span>
          <span class="value">${total}</span>
        </div>
        <div class="stat">
          <span class="label">Average Value:</span>
          <span class="value">${average.toFixed(2)}</span>
        </div>
        <div class="stat">
          <span class="label">Active Items:</span>
          <span class="value">${activeCount}</span>
        </div>
      </div>
    `}></r-let>
  `
})
export class ComputedComponent extends LitElement {
  @property({ type: Array })
  items = [];

  private computedData$ = computed(this.items, items => {
    const total = items.length;
    const average = total > 0 ? items.reduce((sum, item) => sum + item.value, 0) / total : 0;
    const activeCount = items.filter(item => item.active).length;
    
    return { total, average, activeCount };
  });
}
```

## 🎯 Performance Optimization

### Virtual Scrolling

Handle large datasets efficiently:

```typescript
@Component({
  selector: 'virtual-list',
  template: () => html`
    <div class="virtual-container" style="height: 400px; overflow-y: auto;">
      <r-for .of=${this.visibleItems$}>
        <r-let .item=${item => html`
          <div class="list-item" style="height: 50px;">
            ${item.name}
          </div>
        `}></r-let>
      </r-for>
    </div>
  `
})
export class VirtualListComponent extends LitElement {
  @property({ type: Array })
  items = [];

  @property({ type: Number })
  itemHeight = 50;

  @property({ type: Number })
  containerHeight = 400;

  private visibleItems$ = computed(
    [this.items, this.itemHeight, this.containerHeight],
    ([items, itemHeight, containerHeight]) => {
      const visibleCount = Math.ceil(containerHeight / itemHeight);
      return items.slice(0, visibleCount);
    }
  );
}
```

### Memoization

Cache expensive computations:

```typescript
import { memoize } from '@rhtml/operators';

@Component({
  selector: 'memoized-component',
  template: () => html`
    <r-let .data=${this.memoizedResult$} .item=${result => html`
      <div class="result">
        <h3>Computed Result:</h3>
        <p>${result.value}</p>
        <small>Computed in ${result.duration}ms</small>
      </div>
    `}></r-let>
  `
})
export class MemoizedComponent extends LitElement {
  @property({ type: Number })
  input = 0;

  private memoizedResult$ = memoize(
    this.input,
    input => {
      const start = performance.now();
      
      // Expensive computation
      let result = 0;
      for (let i = 0; i < input * 1000000; i++) {
        result += Math.sqrt(i);
      }
      
      const duration = performance.now() - start;
      return { value: result, duration: Math.round(duration) };
    }
  );
}
```

## 🔧 Custom Operators

### Creating Custom Operators

Extend the operator system with your own operators:

```typescript
// operators/custom-operators.ts
import { Component, html, LitElement } from '@rxdi/lit-html';

// Custom operator for pagination
@Component({
  selector: 'r-paginate',
  template: () => html`
    <r-let .data=${this.paginatedData$} .item=${({ items, currentPage, totalPages }) => html`
      <div class="paginated-content">
        <r-for .of=${items}>
          <r-let .item=${item => html`
            <div class="item">${item.name}</div>
          `}></r-let>
        </r-for>
        
        <div class="pagination">
          <button 
            @click=${() => this.previousPage()}
            ?disabled=${currentPage === 1}>
            Previous
          </button>
          <span>Page ${currentPage} of ${totalPages}</span>
          <button 
            @click=${() => this.nextPage()}
            ?disabled=${currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    `}></r-let>
  `
})
export class PaginateOperator extends LitElement {
  @property({ type: Array })
  data = [];

  @property({ type: Number })
  pageSize = 10;

  @property({ type: Number })
  currentPage = 1;

  private paginatedData$ = computed(
    [this.data, this.pageSize, this.currentPage],
    ([data, pageSize, currentPage]) => {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const items = data.slice(startIndex, endIndex);
      const totalPages = Math.ceil(data.length / pageSize);
      
      return { items, currentPage, totalPages };
    }
  );

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.data.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }
}

// Usage
@Component({
  selector: 'pagination-demo',
  template: () => html`
    <r-paginate 
      .data=${this.largeDataset}
      .pageSize=${5}>
    </r-paginate>
  `
})
export class PaginationDemoComponent extends LitElement {
  @property({ type: Array })
  largeDataset = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Item ${i + 1}`
  }));
}
```

## 🎯 Best Practices

### 1. **Operator Composition**
- Keep operators simple and focused
- Compose complex logic from simple operators
- Use meaningful names for transformation functions
- Avoid deeply nested operator chains

### 2. **Performance Considerations**
- Use memoization for expensive computations
- Implement virtual scrolling for large datasets
- Avoid creating new objects in transformation functions
- Use appropriate data structures

### 3. **Reactive Patterns**
- Prefer reactive data sources over imperative updates
- Use computed values for derived state
- Handle loading and error states gracefully
- Implement proper cleanup for subscriptions

### 4. **Type Safety**
- Use TypeScript for better type inference
- Define interfaces for transformation functions
- Use generics for reusable operators
- Validate data at operator boundaries

## 🚀 Next Steps

- Learn about [State Management](/docs/getting-started/state-management) for managing application state
- Explore [GraphQL Integration](/docs/advanced/graphql) for data fetching
- Check out [Custom Decorators](/docs/advanced/decorators) for extending functionality
- Understand [Testing Strategies](/docs/getting-started/testing) for testing reactive components
