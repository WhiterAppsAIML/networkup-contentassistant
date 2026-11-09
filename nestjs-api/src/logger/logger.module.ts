import { Module, Global } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                  },
                },
            formatters: {
              level: (label) => ({ level: label }),
            },
            timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
            customProps: (req, res) => ({
              context: 'HTTP',
              reqId: req.id,
            }),
            autoLogging: {
              ignore: (req) => req.url === '/health/live' || req.url === '/health/ready',
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}