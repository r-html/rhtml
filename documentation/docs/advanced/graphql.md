---
sidebar_position: 1
---

# GraphQL Integration

@rhtml provides a revolutionary approach to GraphQL integration, allowing you to write queries directly in your HTML templates using monadic components. This declarative approach makes data fetching intuitive and type-safe.

## 🚀 Quick Start

### Installation

```bash
npm install @rhtml/graphql
```

### Basic Setup

```typescript
import { setConfig } from '@rhtml/graphql/settings';

setConfig({
  config: {
    uri: 'https://countries.trevorblades.com/',
    pubsub: 'wss://pubsub.youvolio.com/subscriptions',
    async onRequest() {
      return new Headers();
    }
  },
  defaults: {
    error: e => html`<p style="color: red">${e}</p>`,
    loading: () => html`<div>Loading...</div>`
  }
});

import '@rhtml/graphql';
```

## 📊 Query Operations

### Basic Query

Execute GraphQL queries directly in your templates:

```typescript
import { Component } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'continent-list',
  template: () => html`
    <r-part>
      <r-fetch query="{
        continents {
          name
          countries {
            code
            name
          }
        }
      }"></r-fetch>
      <r-render .state=${({ data: { continents } }) => html`
        <div class="continents">
          ${continents.map(continent => html`
            <div class="continent">
              <h2>${continent.name}</h2>
              <ul>
                ${continent.countries.map(country => html`
                  <li>${country.name} (${country.code})</li>
                `)}
              </ul>
            </div>
          `)}
        </div>
      `}>
      </r-render>
    </r-part>
  `
})
export class ContinentListComponent extends LitElement {}
```

### Query with Variables

Pass variables to your queries:

```typescript
@Component({
  selector: 'user-profile',
  template: () => html`
    <r-part>
      <r-fetch 
        query="
          query GetUser($id: ID!) {
            user(id: $id) {
              id
              name
              email
              profile {
                avatar
                bio
              }
            }
          }
        "
        .variables=${{ id: this.userId }}>
      </r-fetch>
      <r-render .state=${({ data: { user } }) => html`
        <div class="user-profile">
          <img src="${user.profile.avatar}" alt="${user.name}">
          <h1>${user.name}</h1>
          <p>${user.email}</p>
          <p>${user.profile.bio}</p>
        </div>
      `}>
      </r-render>
    </r-part>
  `
})
export class UserProfileComponent extends LitElement {
  @property({ type: String })
  userId: string;
}
```

### Query with Settings

Configure query behavior with settings:

```typescript
@Component({
  selector: 'cached-data',
  template: () => html`
    <r-part>
      <r-settings .value=${{ 
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true
      }}></r-settings>
      <r-fetch query="{
        posts {
          id
          title
          content
        }
      }"></r-fetch>
      <r-render .state=${({ data: { posts } }) => html`
        <div class="posts">
          ${posts.map(post => html`
            <article class="post">
              <h2>${post.title}</h2>
              <p>${post.content}</p>
            </article>
          `)}
        </div>
      `}>
      </r-render>
    </r-part>
  `
})
export class CachedDataComponent extends LitElement {}
```

## 🔄 Mutation Operations

### Basic Mutation

Execute mutations and handle responses:

```typescript
@Component({
  selector: 'create-post',
  template: () => html`
    <r-part>
      <r-fetch 
        mutation="
          mutation CreatePost($title: String!, $content: String!) {
            createPost(title: $title, content: $content) {
              id
              title
              content
              createdAt
            }
          }
        "
        .variables=${{ title: this.title, content: this.content }}>
      </r-fetch>
      <r-render .state=${({ data: { createPost } }, setState) => html`
        <form @submit=${(e) => this.handleSubmit(e, setState)}>
          <input 
            type="text" 
            placeholder="Title"
            @input=${(e) => this.title = e.target.value}>
          <textarea 
            placeholder="Content"
            @input=${(e) => this.content = e.target.value}>
          </textarea>
          <button type="submit">Create Post</button>
        </form>
        ${createPost ? html`
          <div class="success">
            <h3>Post created successfully!</h3>
            <p>ID: ${createPost.id}</p>
          </div>
        ` : ''}
      `}>
      </r-render>
    </r-part>
  `
})
export class CreatePostComponent extends LitElement {
  private title = '';
  private content = '';

  handleSubmit(e: Event, setState: Function) {
    e.preventDefault();
    // Trigger mutation
    setState({ data: { createPost: null } });
  }
}
```

### Optimistic Updates

Implement optimistic updates for better UX:

```typescript
@Component({
  selector: 'like-button',
  template: () => html`
    <r-part>
      <r-state .value=${{ likes: this.initialLikes, isLiked: false }}></r-state>
      <r-fetch 
        mutation="
          mutation ToggleLike($postId: ID!) {
            toggleLike(postId: $postId) {
              id
              likes
              isLiked
            }
          }
        "
        .variables=${{ postId: this.postId }}>
      </r-fetch>
      <r-render .state=${({ likes, isLiked }, setState) => html`
        <button 
          @click=${() => this.handleLike(setState)}
          class="${isLiked ? 'liked' : ''}">
          ❤️ ${likes}
        </button>
      `}>
      </r-render>
    </r-part>
  `
})
export class LikeButtonComponent extends LitElement {
  @property({ type: String })
  postId: string;

  @property({ type: Number })
  initialLikes: number;

  handleLike(setState: Function) {
    // Optimistic update
    setState(prev => ({
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked
    }));
  }
}
```

## 📡 Subscription Operations

### Real-time Subscriptions

Handle real-time data with GraphQL subscriptions:

```typescript
@Component({
  selector: 'chat-room',
  template: () => html`
    <r-part>
      <r-fetch 
        .subscribe=${`
          subscription OnNewMessage($roomId: ID!) {
            messageAdded(roomId: $roomId) {
              id
              text
              sender {
                id
                name
                avatar
              }
              timestamp
            }
          }
        `}
        .variables=${{ roomId: this.roomId }}>
      </r-fetch>
      <r-render .state=${({ data: { messageAdded } }, setState) => html`
        <div class="chat-messages">
          ${this.messages.map(message => html`
            <div class="message">
              <img src="${message.sender.avatar}" alt="${message.sender.name}">
              <div class="message-content">
                <strong>${message.sender.name}</strong>
                <p>${message.text}</p>
                <small>${new Date(message.timestamp).toLocaleString()}</small>
              </div>
            </div>
          `)}
        </div>
        ${messageAdded ? html`
          <div class="new-message">
            New message from ${messageAdded.sender.name}!
          </div>
        ` : ''}
      `}>
      </r-render>
    </r-part>
  `
})
export class ChatRoomComponent extends LitElement {
  @property({ type: String })
  roomId: string;

  private messages = [];
}
```

### Subscription with State Management

Combine subscriptions with local state:

```typescript
@Component({
  selector: 'notification-center',
  template: () => html`
    <r-part>
      <r-state .value=${{ notifications: [] }}></r-state>
      <r-fetch 
        .subscribe=${`
          subscription OnNotification {
            notification {
              id
              type
              message
              timestamp
            }
          }
        `}>
      </r-fetch>
      <r-render .state=${({ notifications }, setState) => html`
        <div class="notifications">
          ${notifications.map(notification => html`
            <div class="notification ${notification.type}">
              <span class="message">${notification.message}</span>
              <button @click=${() => this.dismissNotification(notification.id, setState)}>
                ×
              </button>
            </div>
          `)}
        </div>
      `}>
      </r-render>
    </r-part>
  `
})
export class NotificationCenterComponent extends LitElement {
  dismissNotification(id: string, setState: Function) {
    setState(prev => ({
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  }
}
```

## 🎨 Advanced Patterns

### Fragment Composition

Use GraphQL fragments for reusable query parts:

```typescript
@Component({
  selector: 'dashboard',
  template: () => html`
    <r-part>
      <r-fetch query=${`
        query DashboardData($userId: ID!) {
          user(id: $userId) {
            ...UserProfile
            teams {
              ...TeamInfo
              projects {
                ...ProjectStats
                tasks {
                  ...TaskDetails
                }
              }
            }
          }
        }

        fragment UserProfile on User {
          id
          name
          role
          avatar
        }

        fragment TeamInfo on Team {
          id
          name
          membersCount
          leader {
            ...UserProfile
          }
        }

        fragment ProjectStats on Project {
          id
          name
          status
          progress
          deadline
          metrics {
            completedTasks
            totalTasks
            hoursLogged
          }
        }

        fragment TaskDetails on Task {
          id
          title
          status
          priority
          assignee {
            ...UserProfile
          }
        }
      `} .variables=${{ userId: this.currentUserId }}>
      </r-fetch>
      <r-render .state=${({ data: { user } }) => html`
        <dashboard-layout>
          <user-profile 
            slot="sidebar"
            .user=${user}>
          </user-profile>

          <team-overview
            slot="main"
            .teams=${user.teams}>
          </team-overview>

          <project-grid
            slot="content"
            .projects=${user.teams.flatMap(t => t.projects)}>
          </project-grid>

          <task-list
            slot="sidebar-right"
            .tasks=${user.teams
              .flatMap(t => t.projects)
              .flatMap(p => p.tasks)}>
          </task-list>
        </dashboard-layout>
      `}>
      </r-render>
    </r-part>
  `
})
export class DashboardComponent extends LitElement {
  @property({ type: String })
  currentUserId: string;
}
```

### Error Handling

Implement comprehensive error handling:

```typescript
@Component({
  selector: 'error-boundary',
  template: () => html`
    <r-part>
      <r-fetch query="{
        posts {
          id
          title
          content
        }
      }"></r-fetch>
      <r-render .state=${({ data, errors, loading }) => html`
        ${loading ? html`<div>Loading...</div>` : ''}
        ${errors ? html`
          <div class="error-container">
            <h3>Something went wrong</h3>
            ${errors.map(error => html`
              <div class="error">
                <strong>${error.message}</strong>
                <p>${error.extensions?.code || 'UNKNOWN_ERROR'}</p>
              </div>
            `)}
            <button @click=${() => this.retry()}>Retry</button>
          </div>
        ` : ''}
        ${data?.posts ? html`
          <div class="posts">
            ${data.posts.map(post => html`
              <article class="post">
                <h2>${post.title}</h2>
                <p>${post.content}</p>
              </article>
            `)}
          </div>
        ` : ''}
      `}>
      </r-render>
    </r-part>
  `
})
export class ErrorBoundaryComponent extends LitElement {
  retry() {
    // Trigger refetch
    this.requestUpdate();
  }
}
```

### Custom Loading States

Create custom loading components:

```typescript
@Component({
  selector: 'custom-loader',
  template: () => html`
    <r-part>
      <r-fetch query="{
        users {
          id
          name
          email
        }
      }"></r-fetch>
      <r-render .state=${({ data: { users } }) => html`
        <div class="users">
          ${users.map(user => html`
            <div class="user">
              <h3>${user.name}</h3>
              <p>${user.email}</p>
            </div>
          `)}
        </div>
      `}>
      </r-render>
    </r-part>
  `
})
export class CustomLoaderComponent extends LitElement {
  // Custom loading template
  static loading = () => html`
    <div class="custom-loading">
      <div class="spinner"></div>
      <p>Loading users...</p>
    </div>
  `;

  // Custom error template
  static error = (error: Error) => html`
    <div class="custom-error">
      <h3>Oops! Something went wrong</h3>
      <p>${error.message}</p>
      <button @click=${() => window.location.reload()}>
        Refresh Page
      </button>
    </div>
  `;
}
```

## 🔧 Configuration Options

### Global Configuration

Configure GraphQL client globally:

```typescript
import { setConfig } from '@rhtml/graphql/settings';

setConfig({
  config: {
    uri: 'https://api.example.com/graphql',
    pubsub: 'wss://api.example.com/subscriptions',
    async onRequest() {
      const headers = new Headers();
      
      // Add authentication
      const token = localStorage.getItem('auth-token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      // Add custom headers
      headers.set('X-Client-Version', '1.0.0');
      
      return headers;
    },
    onError(error) {
      console.error('GraphQL Error:', error);
      
      // Handle authentication errors
      if (error.extensions?.code === 'UNAUTHENTICATED') {
        window.location.href = '/login';
      }
    }
  },
  defaults: {
    error: (error) => html`
      <div class="graphql-error">
        <h4>GraphQL Error</h4>
        <p>${error.message}</p>
        ${error.extensions?.code ? html`
          <small>Error Code: ${error.extensions.code}</small>
        ` : ''}
      </div>
    `,
    loading: () => html`
      <div class="graphql-loading">
        <div class="loading-spinner"></div>
        <p>Loading data...</p>
      </div>
    `
  }
});
```

### Query-Specific Configuration

Override global settings for specific queries:

```typescript
@Component({
  selector: 'configured-query',
  template: () => html`
    <r-part>
      <r-settings .value=${{
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
        notifyOnNetworkStatusChange: true,
        context: {
          headers: {
            'X-Custom-Header': 'special-value'
          }
        }
      }}></r-settings>
      <r-fetch query="{
        sensitiveData {
          id
          value
        }
      }"></r-fetch>
      <r-render .state=${({ data: { sensitiveData } }) => html`
        <div class="sensitive-data">
          ${sensitiveData.map(item => html`
            <div class="data-item">
              <span>${item.id}</span>
              <span>${item.value}</span>
            </div>
          `)}
        </div>
      `}>
      </r-render>
    </r-part>
  `
})
export class ConfiguredQueryComponent extends LitElement {}
```

## 🎯 Best Practices

### 1. **Query Organization**
- Use fragments for reusable query parts
- Keep queries close to components that use them
- Use descriptive query names
- Implement proper error boundaries

### 2. **Performance Optimization**
- Use `fetchPolicy` appropriately
- Implement proper caching strategies
- Use pagination for large datasets
- Optimize subscription usage

### 3. **Type Safety**
- Generate TypeScript types from GraphQL schema
- Use proper typing for variables and responses
- Implement runtime type checking
- Use GraphQL validation

### 4. **Error Handling**
- Implement comprehensive error boundaries
- Provide meaningful error messages
- Handle network errors gracefully
- Implement retry mechanisms

## 🚀 Next Steps

- Learn about [State Management](/docs/getting-started/state-management) for managing local state
- Explore [Custom Decorators](/docs/advanced/decorators) for extending functionality
- Check out [Performance Optimization](/docs/advanced/performance) for optimizing GraphQL usage
- Understand [Testing Strategies](/docs/getting-started/testing) for testing GraphQL components
