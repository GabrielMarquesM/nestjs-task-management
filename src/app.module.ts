import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from './config.schema';
import databaseConfig from './database.config';
import deployConfig from './deploy.config';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forFeature(databaseConfig),
        ConfigModule.forFeature(deployConfig),
      ],
      inject: [databaseConfig.KEY, deployConfig.KEY],
      useFactory: async (
        databaseConfiguration: ConfigType<typeof databaseConfig>,
        deployConfiguration: ConfigType<typeof deployConfig>,
      ) => {
        const isProduction = deployConfiguration.STAGE == 'prod';
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          url: databaseConfiguration.DB_URL,
        };
      },
    }),
  ],
})
export class AppModule {}
