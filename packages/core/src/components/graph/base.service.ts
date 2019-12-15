import { Injector, Injectable } from '@rxdi/core';
import {
  ApolloClient,
  QueryOptions,
  MutationOptions,
  SubscriptionOptions
} from '@rxdi/graphql-client';
import { from, Observable } from 'rxjs';
import { WatchQueryOptions } from 'apollo-client';

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
