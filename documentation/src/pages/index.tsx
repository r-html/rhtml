import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <Heading as="h1" className="hero__title">
              Build Modern Web Apps with
              <span className="hero__title-highlight"> @rhtml</span>
            </Heading>
            <p className="hero__subtitle">
              The reactive, declarative framework for building scalable web applications.
              Combine the power of Web Components, RxJS, and dependency injection in one elegant solution.
            </p>
            <div className={styles.heroButtons}>
              <Link
                className="button button--primary button--lg"
                to="/docs/getting-started/installation"
              >
                🚀 Get Started
              </Link>
              <Link
                className="button button--outline button--lg"
                to="https://github.com/r-html/rhtml"
              >
                📦 View on GitHub
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>⚡</span>
                <span className={styles.statLabel}>Lightning Fast</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>🎯</span>
                <span className={styles.statLabel}>Type Safe</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>🔄</span>
                <span className={styles.statLabel}>Reactive</span>
              </div>
            </div>
          </div>
          <div className="hero-code">
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span className={styles.codeDot}></span>
                <span className={styles.codeDot}></span>
                <span className={styles.codeDot}></span>
                <span className={styles.codeTitle}>app.component.ts</span>
              </div>
              <pre className={styles.codeContent}>
                {`// @rhtml/component (Second Generation - Functional Reactive)
  import { Component, DefineDependencies } from '@rhtml/component';
  import { Container, Injectable } from '@rxdi/core';
  import { html, LitElement, property } from '@rxdi/lit-html';
  import { BehaviorSubject } from 'rxjs';
  import { map } from 'rxjs/operators';

  @Injectable()
  class CounterService {
    counter = 55;
  }


  @Component({
    Settings: {
      selector: 'app-root',
    },
    Providers: DefineDependencies(CounterService)(Container),
    State: function(this: AppComponent, [counterService]) {
      return new BehaviorSubject(0).pipe(
        map(value => ({
          counter: value + counterService.counter
        }))
      );
    },
    Render: ([counterService]) =>
      function(this, { counter }) {
        return html\`
          <div class="app">
            <h1>Hello @rhtml!</h1>
            <p>Count: \${counter}</p>
            <button @click=\${() => this.increment()}>
              Increment
            </button>
          </div>
        \`;
      }
  })
  export class AppComponent extends LitElement {
    @property({ type: Number })
    private count = 0;

    increment() {
      this.count++;
      this.requestUpdate();
    }
  }`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2" className={styles.sectionTitle}>
            Why Choose @rhtml?
          </Heading>
          <p className={styles.sectionSubtitle}>
            Modern web development made simple, powerful, and maintainable
          </p>
        </div>

        <div className="row">
          <div className="col col--4">
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <Heading as="h3">Lightning Fast</Heading>
              <p>
                Built on Web Components and LitElement for optimal performance.
                Minimal overhead with maximum efficiency.
              </p>
            </div>
          </div>

          <div className="col col--4">
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔄</div>
              <Heading as="h3">Reactive by Design</Heading>
              <p>
                Native RxJS integration for reactive programming.
                Build responsive UIs with declarative data flows.
              </p>
            </div>
          </div>

          <div className="col col--4">
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <Heading as="h3">Type Safe</Heading>
              <p>
                Full TypeScript support with excellent IDE integration.
                Catch errors at compile time, not runtime.
              </p>
            </div>
          </div>
        </div>

        <div className="row margin-top--xl">
          <div className="col col--4">
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🧩</div>
              <Heading as="h3">Component Based</Heading>
              <p>
                Build reusable, composable components with Web Components standards.
                Share components across projects easily.
              </p>
            </div>
          </div>

          <div className="col col--4">
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💉</div>
              <Heading as="h3">Dependency Injection</Heading>
              <p>
                Powerful DI container inspired by Angular.
                Manage services and dependencies with ease.
              </p>
            </div>
          </div>

          <div className="col col--4">
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🚀</div>
              <Heading as="h3">Full Stack</Heading>
              <p>
                Frontend and backend in one framework.
                Fastify integration with GraphQL, MongoDB, and AMQP support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeExamplesSection() {
  return (
    <section className={styles.codeExamples}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2" className={styles.sectionTitle}>
            See @rhtml in Action
          </Heading>
          <p className={styles.sectionSubtitle}>
            Real examples showing the power and simplicity of @rhtml
          </p>
        </div>

        <div className="row">
          <div className="col col--6">
            <div className={styles.codeExample}>
              <h3>🔄 Reactive State Management</h3>
              <pre className={styles.codeBlock}>
                {`// @rhtml/component - Advanced Reactive State
  import { Component, DefineDependencies } from '@rhtml/component';
  import { Container, Injectable } from '@rxdi/core';
  import { html, LitElement, property } from '@rxdi/lit-html';
  import { interval } from 'rxjs';
  import { map } from 'rxjs/operators';

  @Injectable()
  class CounterService {
    counter = 55;
  }

  const Providers = DefineDependencies(CounterService)(Container);

  @Component<{ counter: number }, typeof Providers, CounterComponent>({
    Settings: {
      selector: 'counter',
    },
    Providers,
    State: function(this, [counterService]) {
      return interval(1000).pipe(
        map((value) => ({
          counter: this.counter + counterService.counter + value,
        }))
      );
    },
    Render: ([counterService]) =>
      function(this, { counter }) {
        return html\`
          <div>
            <h2>Counter: \${counter}</h2>
            <p>Service Counter: \${counterService.counter}</p>
          </div>
        \`;
      }
  })
  export class CounterComponent extends LitElement {
    @property({ type: Number })
    counter: number = 0;
  }`}
              </pre>
            </div>
          </div>

          <div className="col col--6">
            <div className={styles.codeExample}>
              <h3>🎯 Backend API with Fastify</h3>
              <pre className={styles.codeBlock}>
                {`// RESTful API controller
@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Route({ url: '/', method: 'GET' })
  async getUsers() {
    return this.userService.findAll();
  }

  @Route({ url: '/:id', method: 'GET' })
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        <div className="row margin-top--xl">
          <div className="col col--6">
            <div className={styles.codeExample}>
              <h3>📊 GraphQL Integration</h3>
              <pre className={styles.codeBlock}>
                {`// @rhtml/component - Declarative Data Fetching
  import { Component, DefineDependencies } from '@rhtml/component';
  import { Container, Injectable } from '@rxdi/core';
  import { html, LitElement, property } from '@rxdi/lit-html';
  import { of } from 'rxjs';

  @Injectable()
  class UserService {
    getUser() {
      return { name: 'John Doe', email: 'john@example.com' };
    }
  }

  const Providers = DefineDependencies(UserService)(Container);

  @Component<{ user: any; time: number }, typeof Providers, UserComponent>({
    Settings: {
      selector: 'user-list',
    },
    Providers,
    State: function(this, [userService]) {
      return of({
        user: userService.getUser(),
        time: new Date().getSeconds(),
      });
    },
    Render: ([userService]) =>
      function(this, { user, time }) {
        return html\`
          <div>
            <h2>\${user.name}</h2>
            <p>Email: \${user.email}</p>
            <p>Current time: \${time}</p>
          </div>
        \`;
      }
  })
  export class UserComponent extends LitElement {
    @property({ type: String })
    userId = '';
  }`}
              </pre>
            </div>
          </div>

          <div className="col col--6">
            <div className={styles.codeExample}>
              <h3>💾 MongoDB with Mongoose</h3>
              <pre className={styles.codeBlock}>
                {`// Database service
  @Injectable()
  export class UserService {
    constructor(
      @Inject(Repositories) private repos: Repositories
    ) {}

    async createUser(userData: User) {
      return this.repos.user.create(userData);
    }

    async findUsers() {
      return this.repos.user.find();
    }
  }`}
              </pre>
            </div>
          </div>
        </div>

        <div className="row margin-top--xl">
          <div className="col col--12">
            <div className={styles.codeExample}>
              <h3>🔄 Component System Comparison</h3>
              <div className="row">
                <div className="col col--6">
                  <h4>@rxdi/lit-html (First Generation)</h4>
                  <pre className={styles.codeBlock}>
                    {`// Pure Web Component with lit-html
  import { Component, html, LitElement, property } from '@rxdi/lit-html';

  @Component({
    selector: 'simple-counter',
    template: () => html\`
      <div>
        <h2>Count: \${this.count}</h2>
        <button @click=\${this.increment}>
          +1
        </button>
      </div>
    \`
  })
  export class SimpleCounter extends LitElement {
    @property({ type: Number })
    count = 0;

    increment() {
      this.count++;
    }
  }`}
                  </pre>
                </div>
                <div className="col col--6">
                  <h4>@rhtml/component (Second Generation)</h4>
                  <pre className={styles.codeBlock}>
                    {`// Advanced Functional Reactive Component
  import { Component, DefineDependencies } from '@rhtml/component';
  import { Container, Injectable } from '@rxdi/core';
  import { html, LitElement, property } from '@rxdi/lit-html';
  import { interval } from 'rxjs';
  import { map } from 'rxjs/operators';

  @Injectable()
  class CounterService {
    counter = 55;
  }

  const Providers = DefineDependencies(CounterService)(Container);

  @Component<{ counter: number }, typeof Providers, ReactiveCounter>({
    Settings: {
      selector: 'reactive-counter',
    },
    Providers,
    State: function(this, [counterService]) {
      return interval(1000).pipe(
        map((value) => ({
          counter: this.counter + counterService.counter + value,
        }))
      );
    },
    Render: ([counterService]) =>
      function(this, { counter }) {
        return html\`
          <div>
            <h2>Counter: \${counter}</h2>
            <p>Service Counter: \${counterService.counter}</p>
          </div>
        \`;
      }
  })
  export class ReactiveCounter extends LitElement {
    @property({ type: Number })
    counter: number = 0;
  }`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className="text--center">
          <Heading as="h2" className={styles.ctaTitle}>
            Ready to Build Something Amazing?
          </Heading>
          <p className={styles.ctaSubtitle}>
            Join the community of developers building modern web applications with @rhtml
          </p>
          <div className={styles.ctaButtons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/getting-started/installation"
            >
              🚀 Start Building
            </Link>
            <Link
              className="button button--outline button--lg"
              to="https://github.com/rxdi/starter-client-side-lit-html"
            >
              📦 Starter Template
            </Link>
          </div>
          <div className={styles.ctaLinks}>
            <Link to="/docs/intro">📚 Documentation</Link>
            <span className={styles.separator}>•</span>
            <Link to="https://github.com/r-html/rhtml">🐙 GitHub</Link>
            <span className={styles.separator}>•</span>
            <Link to="https://discord.gg/rhtml">💬 Community</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="@rhtml - Modern Reactive Web Framework"
      description="Build scalable web applications with @rhtml - the reactive, declarative framework combining Web Components, RxJS, and dependency injection."
    >
      <HomepageHeader />
      <main>
        <FeaturesSection />
        <CodeExamplesSection />
        <CTASection />
      </main>
    </Layout>
  );
}
