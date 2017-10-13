import fetch from 'node-fetch';
import { relative } from 'path';
import {
  HttpServerConfig,
  TYPE_HTTP_CONFIG
} from '../../modules/http-server/types';
import {
  Fetch,
  TYPE_DRIVER_FETCH
} from '../../modules/http/types';
import {
  JWTServiceConfig,
  TYPE_JWT_SERVICE_CONFIG
} from '../../modules/jwt/types';
import {
  FacebookApiServiceConfig,
  TYPE_FACEBOOK_API_SERVICE_CONFIG
} from '../../modules/facebook/types';
import { createContainer as createRawContainer } from '../utils/container';
import { config } from './config';

export const createContainer = () => {
  const container = createRawContainer({devMode: config.devMode});

  container.bind<Fetch>(TYPE_DRIVER_FETCH).toConstantValue(fetch);

  container.bind<HttpServerConfig>(TYPE_HTTP_CONFIG).toConstantValue({
    port: config.port,
    corsAllowedOriginPatterns: config.corsAllowedOriginPatterns.split(','),
    devMode: config.devMode,
    enableGraphQLEditor: config.devMode,
    sessionSecret: config.sessionSecret,
    facebookAppId: config.facebookAppId,
    facebookAppSecret: config.facebookAppSecret,
    absolutePublicPath: config.absolutePublicPath,
    relativePublicPath: relative(process.cwd(), config.absolutePublicPath)
  });

  container.bind<FacebookApiServiceConfig>(TYPE_FACEBOOK_API_SERVICE_CONFIG).toConstantValue({
    appId: config.facebookAppId,
    appSecret: config.facebookAppSecret
  });

  container.bind<JWTServiceConfig>(TYPE_JWT_SERVICE_CONFIG).toConstantValue({
    jwtSignatureSecret: config.sessionSecret
  });

  container.load(
    require('../../modules/authorization').authorizationModule,
    require('../../modules/monitor').monitorModule,
    require('../../modules/http-server').httpServerModule,
    require('../../modules/http').httpModule,
    require('../../modules/graphql').graphqlModule,
    require('../../modules/user').userModule,
    require('../../modules/error').errorModule,
    require('../../modules/uuid').uuidModule,
    require('../../modules/route').routeModule,
    require('../../modules/json').jsonModule,
    require('../../modules/facebook').facebookModule,
    require('../../modules/date').dateModule,
    require('../../modules/jwt').jwtModule
  );

  return container;
};
