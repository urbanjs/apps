import 'reflect-metadata';
import 'dotenv/config';
import { IHttpServer, TYPE_HTTP_SERVER } from '../../modules/http-server/types';
import { container } from './container';

container.get<IHttpServer>(TYPE_HTTP_SERVER).start();