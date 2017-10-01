export {
  LoggerConfig,
  TYPE_CONFIG_LOGGER,
  ILoggerService,
  TYPE_SERVICE_LOGGER,
  ITraceService,
  TYPE_SERVICE_TRACE
} from 'urbanjs-tools-core/dist/types';

export {
  TYPE_DRIVER_CHALK
} from 'urbanjs-tools-core/dist/services/console-logger-service';

export const TYPE_LOG_SERVICE = 'TYPE_LOG_SERVICE';

export type Log = string;

export interface ILogService {
  createLog(log: Log): Promise<void>;
}