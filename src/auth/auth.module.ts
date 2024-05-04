import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { AppController } from 'src/app.controller';

@Module({
  controllers: [AuthController, AppController],
  providers: [AuthService],
})
export class AuthModule {}
