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
        <div className={styles.heroContent}>
          <div className={styles.logoContainer}>
            <img src="/rhtml/img/rhtml-logo.svg" alt="@rhtml Logo" className={styles.heroLogo} />
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            Build Modern Web Apps with
            <span className={styles.heroTitleHighlight}> @rhtml</span>
          </Heading>
          <p className={styles.heroSubtitle}>
            The reactive, declarative framework for building scalable web applications.
            Combine the power of Web Components, RxJS, and dependency injection in one elegant solution.
          </p>
          <div className={styles.heroButtons}>
            <Link
              className={styles.primaryButton}
              to="/docs/getting-started/installation"
            >
              <span className={styles.buttonIcon}>🚀</span>
              Get Started
            </Link>
            <Link
              className={styles.secondaryButton}
              to="https://github.com/r-html/rhtml"
            >
              <span className={styles.buttonIcon}>📦</span>
              View on GitHub
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}

function CodeShowcaseSection() {
  return (
    <section className={styles.codeShowcase}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            See @rhtml in Action
          </Heading>
          <p className={styles.sectionSubtitle}>
            Experience the power of functional reactive components
          </p>
        </div>
        <div className={styles.codeShowcaseContent}>
          <div className={styles.codeWindow}>
            <div className={styles.codeHeader}>
              <div className={styles.codeDots}>
                <span className={styles.codeDot}></span>
                <span className={styles.codeDot}></span>
                <span className={styles.codeDot}></span>
              </div>
              <span className={styles.codeTitle}>app.component.ts</span>
            </div>
            <div className={styles.codeContent}>
              <pre className={styles.codeBlock}>
                {`import { Component, DefineDependencies } from '@rhtml/component';
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
    return this.subject.pipe(
      map(value => ({
        counter: value + counterService.counter
      }))
    );
  },
  Render: ([counterService]) =>
    function(this, { counter }) {
      return html\`
        <p>Count: \${counter}</p>
        <button @click=\${() => this.increment()}>
          Increment
        </button>
      \`;
    }
})
export class AppComponent extends LitElement {
  @property({ type: Number })
  private count = 0;

  subject = new BehaviorSubject(0)

  increment() {
    this.subject.next(this.count++);
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Why Choose @rhtml?
          </Heading>
          <p className={styles.sectionSubtitle}>
            Modern web development made simple, powerful, and maintainable
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <Heading as="h3" className={styles.featureTitle}>Lightning Fast</Heading>
            <p className={styles.featureDescription}>
              Built on Web Components and LitElement for optimal performance.
              Minimal overhead with maximum efficiency.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔄</div>
            <Heading as="h3" className={styles.featureTitle}>Reactive by Design</Heading>
            <p className={styles.featureDescription}>
              Native RxJS integration for reactive programming.
              Build responsive UIs with declarative data flows.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <Heading as="h3" className={styles.featureTitle}>Type Safe</Heading>
            <p className={styles.featureDescription}>
              Full TypeScript support with excellent IDE integration.
              Catch errors at compile time, not runtime.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🧩</div>
            <Heading as="h3" className={styles.featureTitle}>Component Based</Heading>
            <p className={styles.featureDescription}>
              Build reusable, composable components with Web Components standards.
              Share components across projects easily.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💉</div>
            <Heading as="h3" className={styles.featureTitle}>Dependency Injection</Heading>
            <p className={styles.featureDescription}>
              Powerful DI container inspired by Angular.
              Manage services and dependencies with ease.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚀</div>
            <Heading as="h3" className={styles.featureTitle}>Full Stack</Heading>
            <p className={styles.featureDescription}>
              Frontend and backend in one framework.
              Fastify integration with GraphQL, MongoDB, and AMQP support.
            </p>
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
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            More Examples
          </Heading>
          <p className={styles.sectionSubtitle}>
            Real examples showing the power and simplicity of @rhtml
          </p>
        </div>

        <div className={styles.examplesGrid}>
          <div className={styles.codeExample}>
            <div className={styles.exampleHeader}>
              <h3 className={styles.exampleTitle}>🔄 Reactive State Management</h3>
            </div>
            <div className={styles.codeWindow}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <span className={styles.codeDot}></span>
                  <span className={styles.codeDot}></span>
                  <span className={styles.codeDot}></span>
                </div>
                <span className={styles.codeTitle}>counter.component.ts</span>
              </div>
              <div className={styles.codeContent}>
                <pre className={styles.codeBlock}>
                  {`import {
  Component,
  DefineDependencies
} from '@rhtml/component';
import { Container, Injectable } from '@rxdi/core';
import { html, LitElement, property } from '@rxdi/lit-html';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
class CounterService {
  counter = 55;
}

@Component({
  Settings: {
    selector: 'counter',
  },
  Providers: DefineDependencies(CounterService)(Container),
  State: function(this: CounterComponent, [counterService]) {
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
          </div>

          <div className={styles.codeExample}>
            <div className={styles.exampleHeader}>
              <h3 className={styles.exampleTitle}>🎯 Backend API with Fastify</h3>
            </div>
            <div className={styles.codeWindow}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <span className={styles.codeDot}></span>
                  <span className={styles.codeDot}></span>
                  <span className={styles.codeDot}></span>
                </div>
                <span className={styles.codeTitle}>user.controller.ts</span>
              </div>
              <div className={styles.codeContent}>
                <pre className={styles.codeBlock}>
                  {`import {
  Controller,
  Route,
  Subscribe
} from '@rhtml/fastify';
import { Subscribe } from '@rhtml/amqp';
import { MessageService } from './message.service';

@Controller()
export class NotificationController {
  constructor(private messageService: MessageService) {}

  @Route({
    url: '/publish-message',
  })
  async sendNotification(notification: any) {
    await this.messageService.publish('my-message-queue', {});
  }

  @Subscribe({
    queue: 'my-message-queue',
    consumeOptions: {
      noAck: false,
    },
  })
  async myMessageQueueSubscription(
    message: ConsumeMessage,
    channel: AmqpChannel
  ) {
    channel.ack();
  }
}`}
                </pre>
              </div>
            </div>
            <div className={styles.exampleFooter}>
              <p className={styles.exampleDescription}>
                Build scalable backend APIs with <strong>@rhtml/fastify</strong> and decorators.
                Get started quickly with the{' '}
                <a
                  href="https://github.com/r-html/fastify-starter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.exampleLink}
                >
                  fastify-starter template
                </a>
                .
              </p>
            </div>
          </div>

        </div>

        <div className={styles.examplesGrid}>
          <div className={styles.codeExample}>
            <div className={styles.exampleHeader}>
              <h3 className={styles.exampleTitle}>📊 GraphQL Integration</h3>
            </div>
            <div className={styles.codeWindow}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <span className={styles.codeDot}></span>
                  <span className={styles.codeDot}></span>
                  <span className={styles.codeDot}></span>
                </div>
                <span className={styles.codeTitle}>user-list.component.ts</span>
              </div>
              <div className={styles.codeContent}>
                <pre className={styles.codeBlock}>
                  {`import {
  Component,
  DefineDependencies
} from '@rhtml/component';
import { Container, Injectable } from '@rxdi/core';
import { html, LitElement, property } from '@rxdi/lit-html';
import { of } from 'rxjs';

@Injectable()
class UserService {
  getUser(userId: string) {
    return {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com'
    };
  }
}

@Component({
  Settings: {
    selector: 'user-list',
  },
  Providers: DefineDependencies(UserService)(Container),
  State: function(this: UserComponent, [userService]) {
    return of({
      user: userService.getUser(this.userId),
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
          </div>

          <div className={styles.codeExample}>
            <div className={styles.exampleHeader}>
              <h3 className={styles.exampleTitle}>💾 MongoDB with Mongoose</h3>
            </div>
            <div className={styles.codeWindow}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <span className={styles.codeDot}></span>
                  <span className={styles.codeDot}></span>
                  <span className={styles.codeDot}></span>
                </div>
                <span className={styles.codeTitle}>user.service.ts</span>
              </div>
              <div className={styles.codeContent}>
                <pre className={styles.codeBlock}>
                  {`import { Injectable, Inject } from '@rhtml/di';
import {
  AmqpChannel,
  AmqpService,
  ConsumeMessage
} from '@rhtml/amqp';

@Injectable()
export class MessageService {
  constructor(private amqpService: AmqpService) {}

  async publish(name: string, payload: any) {
    await this.amqpService.publish(name, {
      payload: {},
    });
  }
}

@Injectable()
export class UserService {
  constructor(
    @Inject(Repositories) private repos: Repositories,
    private messageService: MessageService
  ) {}

  createFile(file: File) {
    return this.repos.file.create(file);
  }

  listFiles() {
    return this.repos.file.find();
  }`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className={styles.comparison}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Component System Comparison
          </Heading>
          <p className={styles.sectionSubtitle}>
            Choose the right approach for your project
          </p>
        </div>

        <div className={styles.comparisonGrid}>
          <div className={styles.comparisonCard}>
            <div className={styles.comparisonHeader}>
              <h3 className={styles.comparisonTitle}>@rxdi/lit-html</h3>
              <span className={styles.comparisonBadge}>First Generation</span>
            </div>
            <div className={styles.codeWindow}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <span className={styles.codeDot}></span>
                  <span className={styles.codeDot}></span>
                  <span className={styles.codeDot}></span>
                </div>
                <span className={styles.codeTitle}>simple-counter.ts</span>
              </div>
              <div className={styles.codeContent}>
                <pre className={styles.codeBlock}>
                  {`import { Component, html, LitElement, property } from '@rxdi/lit-html';

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
            </div>
            <div className={styles.comparisonFeatures}>
              <div className={styles.featureItem}>✓ Pure Web Components</div>
              <div className={styles.featureItem}>✓ Simple API</div>
              <div className={styles.featureItem}>✓ Maximum flexibility</div>
              <div className={styles.featureItem}>✓ Direct LitElement inheritance</div>
            </div>
          </div>

          <div className={styles.comparisonCard}>
            <div className={styles.comparisonHeader}>
              <h3 className={styles.comparisonTitle}>@rhtml/component</h3>
              <span className={styles.comparisonBadge}>Second Generation</span>
            </div>
            <div className={styles.codeWindow}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <span className={styles.codeDot}></span>
                  <span className={styles.codeDot}></span>
                  <span className={styles.codeDot}></span>
                </div>
                <span className={styles.codeTitle}>reactive-counter.ts</span>
              </div>
              <div className={styles.codeContent}>
                <pre className={styles.codeBlock}>
                  {`import { Component, DefineDependencies } from '@rhtml/component';
import { Container, Injectable } from '@rxdi/core';
import { html, LitElement, property } from '@rxdi/lit-html';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
class CounterService {
  counter = 55;
}

@Component({
  Settings: {
    selector: 'reactive-counter',
  },
  Providers: DefineDependencies(CounterService)(Container),
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
            <div className={styles.comparisonFeatures}>
              <div className={styles.featureItem}>✓ Functional Reactive</div>
              <div className={styles.featureItem}>✓ Dependency Injection</div>
              <div className={styles.featureItem}>✓ Observable State</div>
              <div className={styles.featureItem}>✓ Advanced Composition</div>
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
        <div className={styles.ctaContent}>
          <Heading as="h2" className={styles.ctaTitle}>
            Ready to Build Something Amazing?
          </Heading>
          <p className={styles.ctaSubtitle}>
            Join the community of developers building modern web applications with @rhtml
          </p>
          <div className={styles.ctaButtons}>
            <Link
              className={styles.primaryButton}
              to="/docs/getting-started/installation"
            >
              <span className={styles.buttonIcon}>🚀</span>
              Start Building
            </Link>
            <Link
              className={styles.secondaryButton}
              to="https://github.com/rxdi/starter-client-side-lit-html"
            >
              <span className={styles.buttonIcon}>📦</span>
              Starter Template
            </Link>
          </div>
          <div className={styles.ctaLinks}>
            <Link to="/docs/intro" className={styles.ctaLink}>
              <span className={styles.linkIcon}>📚</span>
              Documentation
            </Link>
            <span className={styles.separator}>•</span>
            <Link to="https://github.com/r-html/rhtml" className={styles.ctaLink}>
              <span className={styles.linkIcon}>🐙</span>
              GitHub
            </Link>
            <span className={styles.separator}>•</span>
            <Link to="https://discord.gg/rhtml" className={styles.ctaLink}>
              <span className={styles.linkIcon}>💬</span>
              Community
            </Link>
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
        <CodeShowcaseSection />
        <FeaturesSection />
        <CodeExamplesSection />
        <ComparisonSection />
        <CTASection />
      </main>
    </Layout>
  );
}
