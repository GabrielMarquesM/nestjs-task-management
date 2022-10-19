import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import authConfig from '../auth.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from './user.entity';
import { UsersRepository } from './user.repository';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      inject: [authConfig.KEY],
      useFactory: async (authConfiguration: ConfigType<typeof authConfig>) => ({
        secret: authConfiguration.JWT_SECRET,
        signOptions: { expiresIn: 3600 },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [JwtStrategy, PassportModule],
  providers: [AuthService, UsersRepository, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
