import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { UserEmail } from '../schemas/userEmail.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/user.dto';
import { UserEmailDto } from '../dto/userEmail.dto';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserEmail.name) private userEmailModel: Model<UserEmail>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const plainToHash = await hash(password, 10);
    createUserDto = { ...createUserDto, password: plainToHash };
    const createUser = new this.userModel(createUserDto);
    return createUser.save();
  }

  async getEmail(userEmailDto: UserEmailDto): Promise<boolean> {
    const findEmail = await this.userEmailModel.findOne({
      email: userEmailDto,
    });
    if (findEmail) {
      return true;
    }
    return false;
  }
}
