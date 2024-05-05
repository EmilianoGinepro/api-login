import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { AppController } from 'src/app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserEmail, UserEmailSchema } from './schemas/userEmail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserEmail.name, schema: UserEmailSchema },
    ]),
  ],
  controllers: [AuthController, AppController],
  providers: [AuthService],
})
export class AuthModule {}
