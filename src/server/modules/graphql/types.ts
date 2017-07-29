import { IResolvers } from 'graphql-tools/dist/Interfaces';
import { User } from '../user/types';

export const TYPE_GRAPHQL_TYPE_DEFS = 'TYPE_GRAPHQL_TYPE_DEFS';
export const TYPE_GRAPHQL_RESOLVER = 'TYPE_GRAPHQL_RESOLVER';
export const TYPE_GRAPHQL_RESOLVERS_FACTORY = 'TYPE_GRAPHQL_RESOLVERS_FACTORY';

export type GraphqlTypeDefs = string;
export type GraphqlResolvers = IResolvers;
export type GraphqlResolversFactory = () => IResolvers;
export type GraphqlResolverContext = {
  user: null | User
};

export interface IGraphqlResolver<T> {
  resolve(obj: object, args: object, context: GraphqlResolverContext): T;
}
