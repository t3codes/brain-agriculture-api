// src/logger/logger.config.ts
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const isProduction = process.env.NODE_ENV === 'production';

export const winstonConfig: winston.LoggerOptions = {
  level: 'debug',
  format: isProduction
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // JSON para Docker/prod
      )
    : winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('AgroAPI', {
          prettyPrint: true,
        }) // Legível para dev
      ),
  transports: [
    new winston.transports.Console(), // stdout para Docker/dev
    // -> Você pode adicionar aqui Sentry, Datadog, etc
  ],
};
