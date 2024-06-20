import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/user.dto';
import { LoginUserDto } from '../dto/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const { name, password, email } = createUserDto;
    if (!name) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          success: false,
          error: 'El nombre es obligatorios',
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
    if (!password) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          success: false,
          error: 'La contraseña es obligatorios',
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
    if (!email) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          success: false,
          error: 'El email es obligatorios',
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
    if (password.length < 8) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          success: false,
          error: `la contraseña debe tener minimo 8 caracteres. tiene: ${password.length} la pass es: ${password}`,
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
    const plainToHash = await bcrypt.hash(password, 10);
    createUserDto = { ...createUserDto, password: plainToHash };
    const createUser = new this.userModel(createUserDto);
    const newUser = await createUser.save();
    return {
      status: HttpStatus.OK,
      success: true,
      message: 'Usuario creado con exito',
      data: newUser,
    };
  }

  async getEmail(email: string) {
    const findEmail = await this.userModel.findOne({
      email: email,
    });
    if (findEmail !== null) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          success: false,
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

  async updatePassword(email: string, pwd: string) {
    const searchEmail = await this.userModel.findOne({
      email: email,
    });
    if (!pwd) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          success: false,
          error: 'Ingrese una contraseña',
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
    if (searchEmail == null) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          success: false,
          error: 'El email no existe',
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }

    const plainToHash = await bcrypt.hash(pwd, 10);
    searchEmail.password = plainToHash;
    searchEmail.updateDate = new Date();
    await searchEmail.save();
    return {
      status: HttpStatus.OK,
      success: true,
      message: 'Password actualizada',
    };
  }

  async postLogin(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;
    const findUser = await this.userModel.findOne({
      email: email,
    });
    //valido que el email o el password no vengan vacios
    if (!email || !password) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          success: false,
          error: 'El email y la contraseña son obligatorios',
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
    //valido que el mail exista
    if (findUser == null) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          success: false,
          error: 'el email o la contraseña no son validos',
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
    //valido que la contraseña sea correcta
    const passwordCorrect = await bcrypt.compare(password, findUser.password);
    if (!passwordCorrect) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          success: false,
          error: 'el email o la contraseña no son validos',
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
    const playLoad = { id: findUser._id, userName: findUser.name };
    const token = this.jwtService.sign(playLoad);
    const data = {
      id: findUser._id,
      name: findUser.name,
      lastName: findUser.lastName,
      email: findUser.email,
      token,
    };
    return {
      status: HttpStatus.OK,
      success: true,
      message: 'Login correcto',
      data: data,
    };
  }
}
