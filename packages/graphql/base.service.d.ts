import { ApolloClient, QueryOptions, MutationOptions, SubscriptionOptions } from '@rxdi/graphql-client';
import { Observable } from 'rxjs';
import { WatchQueryOptions } from 'apollo-client';
export declare class BaseService {
    graphql: ApolloClient;
    query<T>(options: QueryOptions): Observable<{
        data: T;
    }>;
    mutate<T>(options: MutationOptions): Observable<{
        data: T;
    }>;
    watchQuery(options: WatchQueryOptions): import("apollo-client").ObservableQuery<any, import("apollo-client").OperationVariables>;
    subscribe<T>(options: SubscriptionOptions): Observable<{
        data: T;
    }>;
}
