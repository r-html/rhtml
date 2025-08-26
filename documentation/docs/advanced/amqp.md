---
sidebar_position: 6
---

# AMQP Integration

@rhtml provides AMQP (Advanced Message Queuing Protocol) integration through the `@rhtml/amqp` package, designed for seamless interaction with message brokers such as RabbitMQ. It allows developers to easily publish and subscribe to messages, integrating AMQP functionalities into their applications with minimal setup.

## 🚀 Installation

```bash
npm install @rhtml/amqp
```

## 🎯 Quick Start

### Basic Configuration

You can set up the AMQP connection in your application by using the `AmqpModule.forRoot` method. This allows you to configure the connection settings such as protocol, hostname, port, credentials, and vhost.

```typescript
import { FastifyModule } from '@rhtml/fastify';
import { AmqpModule } from '@rhtml/amqp';

@Module({
  imports: [
    FastifyModule.forRoot(),
    AmqpModule.forRoot({
      protocol: 'amqp',
      hostname: 'localhost',
      port: 5672,
      username: 'guest',
      password: 'guest',
      vhost: '/',
    }),
  ],
})
export class AppModule {}
```

### Environment Configuration

Set your AMQP connection details in your environment variables:

```bash
# .env file
AMQP_PROTOCOL=amqp
AMQP_HOSTNAME=localhost
AMQP_PORT=5672
AMQP_USERNAME=guest
AMQP_PASSWORD=guest
AMQP_VHOST=/
```

### Usage with Environment Variables

```typescript
import { Module } from '@rhtml/di';
import { AmqpModule } from '@rhtml/amqp';

@Module({
  imports: [
    AmqpModule.forRoot({
      protocol: process.env.AMQP_PROTOCOL || 'amqp',
      hostname: process.env.AMQP_HOSTNAME || 'localhost',
      port: parseInt(process.env.AMQP_PORT || '5672'),
      username: process.env.AMQP_USERNAME || 'guest',
      password: process.env.AMQP_PASSWORD || 'guest',
      vhost: process.env.AMQP_VHOST || '/',
    }),
  ],
})
export class CoreModule {}
```

## 📦 Package Information

### Features

- **AMQP Protocol Support**: Full support for AMQP protocol with customizable configurations
- **Integration with Fastify**: Easily integrate AMQP with Fastify controllers and routes
- **Simple Publish and Subscribe Mechanism**: Simplified API for sending and consuming messages
- **Customizable Options**: Configure protocol, hostname, port, authentication, and vhost
- **Channel Management**: Ability to specify different channels than the default one
- **Error Handling**: Robust error handling when subscription fails to prevent application crashes

### Package Structure

```json
{
  "name": "@rhtml/amqp",
  "version": "0.0.134",
  "dependencies": {
    "@rhtml/di": "^0.0.132",
    "amqplib": "^0.10.3"
  }
}
```

## 🔧 Integration with @rhtml Framework

### Module-based Architecture

The AMQP integration follows the @rhtml module pattern:

```typescript
import { Module } from '@rhtml/di';
import { AmqpModule } from '@rhtml/amqp';

@Module({
  imports: [
    AmqpModule.forRoot({
      protocol: 'amqp',
      hostname: 'localhost',
      port: 5672,
      username: 'guest',
      password: 'guest',
      vhost: '/',
    }),
  ],
  providers: [
    // Your services that use AMQP
  ],
})
export class AppModule {}
```

### Service Integration

Create services that use AMQP for message publishing and consumption:

```typescript
import { Injectable, Inject } from '@rhtml/di';
import { AmqpChannel, AmqpService, ConsumeMessage } from '@rhtml/amqp';

@Injectable()
export class MessageService {
  constructor(private amqpService: AmqpService) {}

  async publish(name: string, payload: any) {
    await this.amqpService.publish(name, {
      payload: {},
    });
  }
}
```

### Controller Integration

Use AMQP in your Fastify controllers:

```typescript
import { Controller, Route, Post, Body } from '@rhtml/fastify';
import { Injectable, Inject } from '@rhtml/di';
import { MessageService } from './message.service';

@Injectable()
export class NotificationController {
  constructor(private messageService: MessageService) {}

  @Route({
    url: '/publish-message',
  })
  async sendNotification(notification: any) {
    await messageService.publish('my-message-queue', {});
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
    // Handle subscription and manually set acknowledgment when message is consumed
    channel.ack();
  }

  @Subscribe({
    queue: 'my-message-queue',
    consumeOptions: {
      noAck: true,
    },
  })
  async myMessageQueueSubscription(
    message: ConsumeMessage,
    channel: AmqpChannel
  ) {
    // Auto acknowledgment when the message is received
  }

  @Subscribe({
    queue: 'my-queue-with-custom-amqp-channel',
    consumeOptions: {
      noAck: false,
    },
    channel: MyAmqpChannel,
  })
  async myTestQueue(message: ConsumeMessage, channel: AmqpChannel) {
    console.log('[REQUEST_RECEIVED]', message);

    // LONG RUNNING JOB 5-10 minutes
    channel.ack(message);
    console.log('[REQUEST_ACKNOWLEDGED]');
    await this.amqpService.publish(
      'my-queue-with-custom-amqp-channel-ack',
      {},
      { channel }
    );
    console.log('[MESSAGE_ACKNOWLEDGED_SEND]');
  }
}
```

## 🔄 Advanced Usage Patterns

### Custom Channel Configuration

You can specify different channels than the default one:

```typescript
import { Module, InjectionToken } from '@rhtml/di';
import { AmqpModule, AmqpConnection } from '@rhtml/amqp';

export const MyAmqpChannel = new InjectionToken<Channel>();
export type MyAmqpChannel = Channel;

@Module({
  imports: [
    AmqpModule.forRoot({
      protocol: 'amqp',
      hostname: 'localhost',
      port: 5672,
      username: 'guest',
      password: 'guest',
      vhost: '/',
      channel: 'custom-channel-name',
    }),
  ],
  providers: [
    {
      provide: MyAmqpChannel,
      deps: [AmqpConnection],
      useFactory: async (connection: Connection) => {
        const channel = await connection.createChannel();
        await retryable(channel, {
          initialDelay: 5000,
          maxRetries: 5,
          separator: '.',
        });
        await channel.prefetch(1);
        return channel;
      },
    },
  ],
})
export class AppModule {}
```

## 🎯 Best Practices

### 1. **Connection Management**

- Use environment variables for connection configuration
- Implement proper error handling for connection failures
- Monitor connection status in production
- Use connection pooling for high-throughput applications

### 2. **Message Handling**

- Always acknowledge messages after successful processing
- Implement dead letter queues for failed messages
- Use message persistence for critical messages
- Implement retry logic for transient failures

### 3. **Queue Design**

- Use descriptive queue names
- Implement proper queue durability
- Use exchanges for complex routing patterns
- Implement message TTL for time-sensitive messages

### 4. **Performance Optimization**

- Use prefetch limits to control message consumption
- Implement message batching for high-throughput scenarios
- Use connection pooling for multiple consumers
- Monitor queue depths and processing times

## 🚀 Next Steps

- Learn about [Dependency Injection](/docs/getting-started/providers) for service management
- Explore [Modules](/docs/getting-started/modules) for application organization
- Check out [Controllers](/docs/getting-started/controllers) for API development
- Understand [Testing Strategies](/docs/getting-started/testing) for message queue testing
- Review [Performance Optimization](/docs/advanced/performance) for queue optimization
