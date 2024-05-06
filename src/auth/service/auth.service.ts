import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async getEmail(userEmailDto: UserEmailDto) {
    const email = userEmailDto.email;
    const findEmail = await this.userModel.findOne({
      email: email,
    });
    console.log(findEmail);
    if (findEmail !== null) {
      throw new ForbiddenException('El email ya se esta usando');
    }
    return 'ok';
  }
}
