---
sidebar_position: 3
---

# State Management

@rhtml provides powerful state management capabilities through RxJS observables and reactive patterns. This guide covers various approaches to managing state in your applications, from simple component state to complex application-wide state management.

## 🚀 Installation

```bash
npm install @rhtml/component @rhtml/di rxjs
```

## 🎯 State Management Approaches

### 1. Component State

Simple state management within a component:

```typescript
import { Component, html, LitElement, property, async } from '@rxdi/lit-html';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'simple-counter',
  template: () => html`
    <div>
      <h2>Count: ${async(this.count$)}</h2>
      <button @click=${() => this.increment()}>Increment</button>
      <button @click=${() => this.decrement()}>Decrement</button>
      <button @click=${() => this.reset()}>Reset</button>
    </div>
  `,
})
export class SimpleCounterComponent extends LitElement {
  private count$ = new BehaviorSubject(0);

  increment() {
    this.count$.next(this.count$.value + 1);
  }

  decrement() {
    this.count$.next(this.count$.value - 1);
  }

  reset() {
    this.count$.next(0);
  }
}
```

### 2. Service State (Redux-like Pattern)

Advanced state management using services with actions and reducers:

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { Container, Injectable } from '@rxdi/core';
import { html, LitElement, property } from '@rxdi/lit-html';
import { BehaviorSubject, scan, map, distinctUntilChanged } from 'rxjs';

// State Interface
interface AppState {
  user: User | null;
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
}

// Actions
type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'REMOVE_TODO'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// Store Service
@Injectable()
class AppStore {
  private initialState: AppState = {
    user: null,
    todos: [],
    loading: false,
    error: null,
  };

  private actions$ = new BehaviorSubject<Action | null>(null);

  state$ = this.actions$.pipe(
    scan(
      (state, action) => (action ? appReducer(state, action) : state),
      this.initialState
    ),
    distinctUntilChanged()
  );

  // Selectors
  user$ = this.state$.pipe(map((state) => state.user));
  todos$ = this.state$.pipe(map((state) => state.todos));
  loading$ = this.state$.pipe(map((state) => state.loading));
  error$ = this.state$.pipe(map((state) => state.error));

  completedTodos$ = this.todos$.pipe(
    map((todos) => todos.filter((todo) => todo.completed))
  );

  pendingTodos$ = this.todos$.pipe(
    map((todos) => todos.filter((todo) => !todo.completed))
  );

  // Actions
  setUser(user: User) {
    this.actions$.next({ type: 'SET_USER', payload: user });
  }

  addTodo(todo: Omit<Todo, 'id'>) {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
    };
    this.actions$.next({ type: 'ADD_TODO', payload: newTodo });
  }

  toggleTodo(id: string) {
    this.actions$.next({ type: 'TOGGLE_TODO', payload: id });
  }

  removeTodo(id: string) {
    this.actions$.next({ type: 'REMOVE_TODO', payload: id });
  }

  setLoading(loading: boolean) {
    this.actions$.next({ type: 'SET_LOADING', payload: loading });
  }

  setError(error: string | null) {
    this.actions$.next({ type: 'SET_ERROR', payload: error });
  }
}

// Main App Component
@Component({
  Settings: {
    selector: 'app-component',
  },
  Providers: DefineDependencies(AppStore)(Container),
  State: function (this: AppComponent, [appStore]) {
    return appStore.state$;
  },
  Render: ([appStore]) =>
    function (this, { user, todos, loading, error }) {
      return html`
        <div class="app">
          ${loading ? html`<div class="loading">Loading...</div>` : ''} ${error
            ? html`<div class="error">${error}</div>`
            : ''} ${user
            ? html`
                <div class="user-info">
                  <h2>Welcome, ${user.name}!</h2>
                  <p>${user.email}</p>
                </div>
              `
            : html`
                <button
                  @click=${() =>
                    appStore.setUser({
                      id: '1',
                      name: 'John Doe',
                      email: 'john@example.com',
                    })}
                >
                  Login
                </button>
              `}

          <todo-list .todos=${todos} .store=${appStore}></todo-list>
        </div>
      `;
    },
})
export class AppComponent extends LitElement {}
```

### 3. Advanced State Composition

Complex state management with multiple stores and composition:

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { Container, Injectable } from '@rxdi/core';
import { html, LitElement, property } from '@rxdi/lit-html';
import { BehaviorSubject, combineLatest, merge, of } from 'rxjs';
import { map, switchMap, catchError, startWith } from 'rxjs/operators';

// User Store
@Injectable()
class UserStore {
  private user$ = new BehaviorSubject<User | null>(null);
  private loading$ = new BehaviorSubject(false);
  private error$ = new BehaviorSubject<string | null>(null);

  state$ = combineLatest([this.user$, this.loading$, this.error$]).pipe(
    map(([user, loading, error]) => ({ user, loading, error }))
  );

  async login(email: string, password: string) {
    this.loading$.next(true);
    this.error$.next(null);

    try {
      // Simulate API call
      const user = await this.fetchUser(email, password);
      this.user$.next(user);
    } catch (error) {
      this.error$.next(error.message);
    } finally {
      this.loading$.next(false);
    }
  }

  logout() {
    this.user$.next(null);
  }

  private async fetchUser(email: string, password: string): Promise<User> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@example.com' && password === 'password') {
          resolve({
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }
}

// Todo Store
@Injectable()
class TodoStore {
  private todos$ = new BehaviorSubject<Todo[]>([]);
  private filter$ = new BehaviorSubject<'all' | 'active' | 'completed'>('all');

  state$ = combineLatest([this.todos$, this.filter$]).pipe(
    map(([todos, filter]) => ({
      todos: this.filterTodos(todos, filter),
      allTodos: todos,
      filter,
    }))
  );

  addTodo(title: string, userId: string) {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      userId,
      createdAt: new Date(),
    };

    const currentTodos = this.todos$.value;
    this.todos$.next([...currentTodos, newTodo]);
  }

  toggleTodo(id: string) {
    const currentTodos = this.todos$.value;
    const updatedTodos = currentTodos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.todos$.next(updatedTodos);
  }

  removeTodo(id: string) {
    const currentTodos = this.todos$.value;
    this.todos$.next(currentTodos.filter((todo) => todo.id !== id));
  }

  setFilter(filter: 'all' | 'active' | 'completed') {
    this.filter$.next(filter);
  }

  private filterTodos(todos: Todo[], filter: string): Todo[] {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }
}

// Notification Store
@Injectable()
class NotificationStore {
  private notifications$ = new BehaviorSubject<Notification[]>([]);

  state$ = this.notifications$.pipe(
    map((notifications) => ({ notifications }))
  );

  addNotification(
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      createdAt: new Date(),
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([...currentNotifications, notification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  }

  removeNotification(id: string) {
    const currentNotifications = this.notifications$.value;
    this.notifications$.next(currentNotifications.filter((n) => n.id !== id));
  }
}

// Main App with Composition
@Component({
  Settings: {
    selector: 'advanced-app',
  },
  Providers: DefineDependencies(
    UserStore,
    TodoStore,
    NotificationStore
  )(Container),
  State: function (this, [userStore, todoStore, notificationStore]) {
    return combineLatest([
      userStore.state$,
      todoStore.state$,
      notificationStore.state$,
    ]).pipe(
      map(([userState, todoState, notificationState]) => ({
        user: userState.user,
        userLoading: userState.loading,
        userError: userState.error,
        todos: todoState.todos,
        allTodos: todoState.allTodos,
        filter: todoState.filter,
        notifications: notificationState.notifications,
      }))
    );
  },
  Render: ([userStore, todoStore, notificationStore]) =>
    function (
      this,
      { user, userLoading, userError, todos, allTodos, filter, notifications }
    ) {
      return html`
        <div class="advanced-app">
          <!-- Notifications -->
          <div class="notifications">
            ${notifications.map(
              (notification) => html`
                <div class="notification ${notification.type}">
                  ${notification.message}
                  <button
                    @click=${() =>
                      notificationStore.removeNotification(notification.id)}
                  >
                    ×
                  </button>
                </div>
              `
            )}
          </div>

          <!-- Login Form -->
          ${!user
            ? html`
                <div class="login-form">
                  <h2>Login</h2>
                  ${userError ? html`<div class="error">${userError}</div>` : ''}
                  ${userLoading
                    ? html`<div class="loading">Logging in...</div>`
                    : ''}
                  <form
                    @submit=${(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      userStore.login(
                        formData.get('email') as string,
                        formData.get('password') as string
                      );
                    }}
                  >
                    <input
                      name="email"
                      type="email"
                      placeholder="Email"
                      required
                    />
                    <input
                      name="password"
                      type="password"
                      placeholder="Password"
                      required
                    />
                    <button type="submit" ?disabled=${userLoading}>
                      Login
                    </button>
                  </form>
                </div>
              `
            : html`
                <!-- Main App -->
                <div class="main-app">
                  <header>
                    <h1>Welcome, ${user.name}!</h1>
                    <button @click=${() => userStore.logout()}>Logout</button>
                  </header>

                  <!-- Todo Management -->
                  <div class="todo-section">
                    <h2>Todo List</h2>

                    <!-- Add Todo Form -->
                    <form
                      @submit=${(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const title = formData.get('title') as string;
                        if (title.trim()) {
                          todoStore.addTodo(title.trim(), user.id);
                          notificationStore.addNotification(
                            'Todo added successfully!',
                            'success'
                          );
                          e.target.reset();
                        }
                      }}
                    >
                      <input
                        name="title"
                        placeholder="Add new todo..."
                        required
                      />
                      <button type="submit">Add</button>
                    </form>

                    <!-- Filter Buttons -->
                    <div class="filters">
                      <button
                        @click=${() => todoStore.setFilter('all')}
                        class=${filter === 'all' ? 'active' : ''}
                      >
                        All (${allTodos.length})
                      </button>
                      <button
                        @click=${() => todoStore.setFilter('active')}
                        class=${filter === 'active' ? 'active' : ''}
                      >
                        Active (${allTodos.filter((t) => !t.completed).length})
                      </button>
                      <button
                        @click=${() => todoStore.setFilter('completed')}
                        class=${filter === 'completed' ? 'active' : ''}
                      >
                        Completed (${allTodos.filter((t) => t.completed).length})
                      </button>
                    </div>

                    <!-- Todo List -->
                    <div class="todo-list">
                      ${todos.map(
                        (todo) => html`
                          <div
                            class="todo-item ${todo.completed
                              ? 'completed'
                              : ''}"
                          >
                            <input
                              type="checkbox"
                              .checked=${todo.completed}
                              @change=${() => {
                                todoStore.toggleTodo(todo.id);
                                notificationStore.addNotification(
                                  todo.completed
                                    ? 'Todo marked as incomplete'
                                    : 'Todo completed!',
                                  'success'
                                );
                              }}
                            />
                            <span class="todo-title">${todo.title}</span>
                            <button
                              @click=${() => {
                                todoStore.removeTodo(todo.id);
                                notificationStore.addNotification(
                                  'Todo removed',
                                  'info'
                                );
                              }}
                              class="delete-btn"
                            >
                              Delete
                            </button>
                          </div>
                        `
                      )}
                    </div>
                  </div>
                </div>
              `}
        </div>
      `;
    },
})
export class AdvancedAppComponent extends LitElement {}
```

### 4. Real-time State with WebSockets

Advanced state management with real-time updates:

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { Container, Injectable } from '@rxdi/core';
import { html, LitElement, property } from '@rxdi/lit-html';
import { BehaviorSubject, merge, of, timer } from 'rxjs';
import { map, switchMap, catchError, retry, shareReplay } from 'rxjs/operators';

// Real-time Chat Store
@Injectable()
class ChatStore {
  private messages$ = new BehaviorSubject<ChatMessage[]>([]);
  private users$ = new BehaviorSubject<User[]>([]);
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private connectionStatus$ = new BehaviorSubject<
    'connected' | 'disconnected' | 'connecting'
  >('disconnected');

  // Simulated WebSocket connection
  private ws$ = timer(0, 1000).pipe(
    map(() => ({ type: 'message', data: this.generateRandomMessage() })),
    shareReplay(1)
  );

  state$ = combineLatest([
    this.messages$,
    this.users$,
    this.currentUser$,
    this.connectionStatus$,
  ]).pipe(
    map(([messages, users, currentUser, connectionStatus]) => ({
      messages,
      users,
      currentUser,
      connectionStatus,
    }))
  );

  // Real-time message stream
  realTimeMessages$ = this.ws$.pipe(
    switchMap((event) => {
      if (event.type === 'message') {
        const currentMessages = this.messages$.value;
        this.messages$.next([...currentMessages, event.data]);
        return of(event.data);
      }
      return of(null);
    }),
    catchError((error) => {
      this.connectionStatus$.next('disconnected');
      return of(null);
    })
  );

  sendMessage(content: string) {
    if (!this.currentUser$.value) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      userId: this.currentUser$.value.id,
      userName: this.currentUser$.value.name,
      timestamp: new Date(),
      type: 'user',
    };

    const currentMessages = this.messages$.value;
    this.messages$.next([...currentMessages, message]);
  }

  setCurrentUser(user: User) {
    this.currentUser$.next(user);
    this.connectionStatus$.next('connected');
  }

  private generateRandomMessage(): ChatMessage {
    const users = ['Alice', 'Bob', 'Charlie', 'Diana'];
    const messages = [
      'Hello everyone!',
      'How are you doing?',
      'Great to be here!',
      "What's new?",
      'Thanks for the update!',
    ];

    return {
      id: Date.now().toString(),
      content: messages[Math.floor(Math.random() * messages.length)],
      userId: Math.floor(Math.random() * 4).toString(),
      userName: users[Math.floor(Math.random() * users.length)],
      timestamp: new Date(),
      type: 'system',
    };
  }
}

// Real-time Chat Component
@Component({
  Settings: {
    selector: 'chat-component',
  },
  Providers: DefineDependencies(ChatStore)(Container),
  State: function (this: ChatComponent, [chatStore]) {
    return chatStore.state$;
  },
  Render: ([chatStore]) =>
    function (this, { messages, users, currentUser, connectionStatus }) {
      return html`
        <div class="chat-app">
          <!-- Connection Status -->
          <div class="connection-status ${connectionStatus}">
            Status: ${connectionStatus}
          </div>

          ${!currentUser
            ? html`
                <!-- User Selection -->
                <div class="user-selection">
                  <h2>Select your username</h2>
                  <div class="user-list">
                    ${['Alice', 'Bob', 'Charlie', 'Diana'].map(
                      (name) => html`
                        <button
                          @click=${() =>
                            chatStore.setCurrentUser({
                              id: name.toLowerCase(),
                              name,
                              email: `${name.toLowerCase()}@example.com`,
                            })}
                        >
                          ${name}
                        </button>
                      `
                    )}
                  </div>
                </div>
              `
            : html`
                <!-- Chat Interface -->
                <div class="chat-interface">
                  <header>
                    <h2>Chat Room</h2>
                    <span class="user-info"
                      >Logged in as: ${currentUser.name}</span
                    >
                  </header>

                  <!-- Messages -->
                  <div class="messages">
                    ${messages.map(
                      (message) => html`
                        <div
                          class="message ${message.userId === currentUser.id
                            ? 'own'
                            : ''}"
                        >
                          <div class="message-header">
                            <span class="user-name">${message.userName}</span>
                            <span class="timestamp"
                              >${message.timestamp.toLocaleTimeString()}</span
                            >
                          </div>
                          <div class="message-content">${message.content}</div>
                        </div>
                      `
                    )}
                  </div>

                  <!-- Message Input -->
                  <form
                    @submit=${(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const content = formData.get('message') as string;
                      if (content.trim()) {
                        chatStore.sendMessage(content.trim());
                        e.target.reset();
                      }
                    }}
                  >
                    <input
                      name="message"
                      placeholder="Type your message..."
                      required
                    />
                    <button type="submit">Send</button>
                  </form>
                </div>
              `}
        </div>
      `;
    },
})
export class ChatComponent extends LitElement {}
```

### 5. State Persistence and Hydration

State management with persistence and hydration:

```typescript
import { Component, DefineDependencies } from '@rhtml/component';
import { Container, Injectable } from '@rxdi/core';
import { html, LitElement, property } from '@rxdi/lit-html';
import { BehaviorSubject, of } from 'rxjs';
import { map, tap, startWith } from 'rxjs/operators';

// Persistent Store
@Injectable()
class PersistentStore {
  private storageKey = 'app-state';
  private state$ = new BehaviorSubject<PersistentState>(this.loadFromStorage());

  updateState(updates: Partial<PersistentState>) {
    const currentState = this.state$.value;
    const newState = { ...currentState, ...updates };
    this.saveToStorage(newState);
    this.state$.next(newState);
  }

  private loadFromStorage(): PersistentState {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.getInitialState();
    } catch {
      return this.getInitialState();
    }
  }

  private saveToStorage(state: PersistentState) {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  private getInitialState(): PersistentState {
    return {
      theme: 'light',
      language: 'en',
      preferences: {
        notifications: true,
        autoSave: true,
        compactMode: false,
      },
      recentItems: [],
      userSettings: {},
    };
  }
}

// Settings Component
@Component({
  Settings: {
    selector: 'settings-component',
  },
  Providers: DefineDependencies(PersistentStore)(Container),
  State: function (this: SettingsComponent, [persistentStore]) {
    return persistentStore.currentState$;
  },
  Render: ([persistentStore]) =>
    function (this, { theme, language, preferences, recentItems }) {
      return html`
        <div class="settings">
          <h2>Settings</h2>

          <!-- Theme Selection -->
          <div class="setting-group">
            <label>Theme:</label>
            <select
              @change=${(e) =>
                persistentStore.updateState({ theme: e.target.value })}
            >
              <option value="light" ?selected=${theme === 'light'}>
                Light
              </option>
              <option value="dark" ?selected=${theme === 'dark'}>Dark</option>
              <option value="auto" ?selected=${theme === 'auto'}>Auto</option>
            </select>
          </div>

          <!-- Language Selection -->
          <div class="setting-group">
            <label>Language:</label>
            <select
              @change=${(e) =>
                persistentStore.updateState({ language: e.target.value })}
            >
              <option value="en" ?selected=${language === 'en'}>English</option>
              <option value="es" ?selected=${language === 'es'}>Spanish</option>
              <option value="fr" ?selected=${language === 'fr'}>French</option>
            </select>
          </div>

          <!-- Preferences -->
          <div class="setting-group">
            <h3>Preferences</h3>
            <label>
              <input
                type="checkbox"
                .checked=${preferences.notifications}
                @change=${(e) =>
                  persistentStore.updateState({
                    preferences: {
                      ...preferences,
                      notifications: e.target.checked,
                    },
                  })}
              />
              Enable Notifications
            </label>

            <label>
              <input
                type="checkbox"
                .checked=${preferences.autoSave}
                @change=${(e) =>
                  persistentStore.updateState({
                    preferences: { ...preferences, autoSave: e.target.checked },
                  })}
              />
              Auto Save
            </label>

            <label>
              <input
                type="checkbox"
                .checked=${preferences.compactMode}
                @change=${(e) =>
                  persistentStore.updateState({
                    preferences: {
                      ...preferences,
                      compactMode: e.target.checked,
                    },
                  })}
              />
              Compact Mode
            </label>
          </div>

          <!-- Recent Items -->
          <div class="setting-group">
            <h3>Recent Items</h3>
            ${recentItems.length > 0
              ? html`
                  <ul>
                    ${recentItems.map((item) => html` <li>${item}</li> `)}
                  </ul>
                `
              : html` <p>No recent items</p> `}
          </div>
        </div>
      `;
    },
})
export class SettingsComponent extends LitElement {}
```

## 🎯 Best Practices

### 1. **State Structure**

- Keep state normalized and flat
- Use selectors for derived state
- Separate concerns into different stores
- Use TypeScript interfaces for type safety

### 2. **Performance Optimization**

- Use `distinctUntilChanged()` to prevent unnecessary updates
- Implement proper memoization for expensive computations
- Use `shareReplay()` for shared observables
- Avoid deep object mutations

### 3. **Error Handling**

- Always handle errors in observable chains
- Provide fallback states for error conditions
- Use retry logic for network requests
- Log errors appropriately

### 4. **Testing**

- Test state changes in isolation
- Mock external dependencies
- Test error scenarios
- Use marble testing for complex observable chains

## 🚀 Next Steps

- Learn about [GraphQL Integration](/docs/advanced/graphql) for server state management
- Explore [Custom Decorators](/docs/advanced/decorators) for state-related decorators
- Check out [Performance Optimization](/docs/advanced/performance) for state optimization
- Understand [Testing Strategies](/docs/getting-started/testing) for testing state management
