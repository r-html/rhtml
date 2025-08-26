---
sidebar_position: 5
---

# Mongoose Integration

@rhtml provides MongoDB integration through the `@rhtml/mongoose` package, offering a simple module-based approach for connecting to MongoDB databases using Mongoose.

## 🚀 Installation

```bash
npm install @rhtml/mongoose
```

## 🎯 Quick Start

### Basic Setup

The `@rhtml/mongoose` package provides a `MongoDbModule` that can be imported into your application modules:

### Usage in Application

```typescript
import { Bootstrap, Module } from '@rhtml/di';
import { CoreModule } from './core.module';

@Module({
  imports: [MongoDbModule.forRoot(mongoose, 'mongodb://localhost:27017/myapp')],
})
class AppModule {}

// Bootstrap your application with MongoDB support
await Bootstrap(AppModule);
```

## 📦 Package Information

### Dependencies

- **mongoose**: MongoDB ODM (version 8.14.2)

## 🔧 Integration with @rhtml Framework

### Module-based Architecture

The mongoose integration follows the @rhtml module pattern:

```typescript
import { Module } from '@rhtml/di';
import mongoose from 'mongoose';
import { MongoDbModule } from '@rhtml/mongoose';

@Module({
  imports: [
    MongoDbModule.forRoot(mongoose, process.env.MONGODB_CONNECTION_STRING),
  ],
  providers: [
    // Your services that use MongoDB
  ],
})
export class AppModule {}
```

### Mongoose model

```typescript
import { GlobalModelOptions } from '@rhtml/mongoose';
import { Document, Model, model, ObjectId, Schema } from 'mongoose';

export class File extends Document {
  id: ObjectId;
  metadata: {
    extension: string;
    fileName: string;
    size: number;
    type: string;
  };
  amazonMetadata: {
    Key: string;
    Bucket: string;
  };
}

const ModelSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
    },
    metadata: {
      type: JSON,
    },
    amazonMetadata: {
      type: JSON,
    },
  },
  GlobalModelOptions
);

export const FileModel = model<File, Model<File>>(
  'files',
  ModelSchema,
  'files'
);
```

### Models Module

```typescript
import { Module } from '@rhtml/di';

import { FileModel } from './entities';
import { Repositories } from './models.tokens';

import { InjectionToken } from '@rhtml/di';
import { Model } from 'mongoose';

import { File } from './entities';

export interface Repositories {
  file: Model<File>;
  routeRule: Model<RouteRules>;
  serviceClient: Model<ServiceClient>;
}

export const Repositories = new InjectionToken<Repositories>();

@Module({
  providers: [
    {
      provide: Repositories,
      useFactory: (): Repositories => ({
        file: FileModel,
      }),
    },
  ],
})
export class ModelsModule {}
```

### Service Integration

Create services that use Mongoose models:

```typescript
import { Injectable, Inject } from '@rhtml/di';
import mongoose from 'mongoose';

@Injectable()
export class UserService {
  constructor(@Inject(Repositories) private repos: Repositories) {}

  createFile(file: File) {
    return this.repos.file.create(file);
  }

  listFiles() {
    return this.repos.file.find();
  }
}
```

## 🎯 Best Practices

### 1. **Environment Configuration**

- Use environment variables for connection strings
- Never hardcode database credentials
- Use different databases for development, testing, and production

### 2. **Module Organization**

- Import `MongoDbModule` in your core application module
- Keep database configuration centralized
- Use dependency injection for services

### 3. **Connection Management**

- Let the module handle connection lifecycle
- Use proper error handling for connection failures
- Monitor connection status in production

## 🚀 Next Steps

- Learn about [Dependency Injection](/docs/getting-started/providers) for service management
- Explore [Modules](/docs/getting-started/modules) for application organization
- Check out [Controllers](/docs/getting-started/controllers) for API development
- Understand [Testing Strategies](/docs/getting-started/testing) for database testing
