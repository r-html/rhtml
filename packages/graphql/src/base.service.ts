import { Injectable, Injector } from '@rxdi/core';
import {
  ApolloClient,
  MutationOptions,
  QueryOptions,
  SubscriptionOptions
} from '@rxdi/graphql-client';
import { WatchQueryOptions } from 'apollo-client';
import { from, Observable } from 'rxjs';

@Injectable()
export class BaseService {
  @Injector(ApolloClient)
  public graphql: ApolloClient;

  query<T>(options: QueryOptions) {
    return from(this.graphql.query.bind(this.graphql)(options)) as Observable<{
      data: T;
    }>;
  }

  mutate<T>(options: MutationOptions) {
    return from(this.graphql.mutate.bind(this.graphql)(options)) as Observable<{
      data: T;
    }>;
  }

  watchQuery(options: WatchQueryOptions) {
    return this.graphql.watchQuery(options);
  }

  subscribe<T>(options: SubscriptionOptions) {
    return from(
      this.graphql.subscribe.bind(this.graphql)(options)
    ) as Observable<{ data: T }>;
  }
}
