import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { error } from 'console';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/user.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const plainToHash = await hash(password, 10);
    createUserDto = { ...createUserDto, password: plainToHash };
    const createUser = new this.userModel(createUserDto);
    return createUser.save();
  }

  async getEmail(email: string) {
    const findEmail = await this.userModel.findOne({
      email: email,
    });
    if (findEmail !== null) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'El email ya existe',
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
    return 'ok';
  }
}
