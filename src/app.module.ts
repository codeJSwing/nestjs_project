import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      // DB 관련
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.string().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),

      // token
      JWT_ACCESSTOKEN_SECRET: Joi.string().required(),
      JWT_ACCESSTOKEN_EXPIRATION_TIME: Joi.string().required(),
      PORT: Joi.number(),
    }),
  }),
    DatabaseModule,
    ProductModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
