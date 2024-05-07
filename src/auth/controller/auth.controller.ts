import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../dto/user.dto';

@Controller('/user')
@ApiTags('User')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiParam({
    name: 'name',
    required: true,
    type: 'string',
    example: 'John',
  })
  @ApiParam({
    name: 'lastname',
    required: false,
    type: 'string',
    example: 'Doe',
  })
  @ApiParam({
    name: 'email',
    required: true,
    type: 'string',
    example: 'example@email.com',
  })
  @ApiParam({
    name: 'password',
    required: true,
    description: 'La contraseña debe ser mayor a 8 caracteres',
    type: 'string',
    example: '123abc78',
  })
  @ApiOperation({ summary: 'Creacion de usuario' })
  @ApiCreatedResponse({
    description: 'Usuario creado con exito',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'El nombre, email y contraseña son obligatorios',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El mail ya esta asignado a otro usuario',
  })
  async createUser(
    @Res() res,
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    const { name, password, email } = createUserDto;
    if (!name) {
      res.status(HttpStatus.BAD_REQUEST).json({
        messages: 'El nombre es obligatorios',
      });
    }
    if (!password) {
      res.status(HttpStatus.BAD_REQUEST).json({
        messages: 'La contraseña es obligatorios',
      });
    }
    if (!email) {
      res.status(HttpStatus.BAD_REQUEST).json({
        messages: 'El email es obligatorios',
      });
    }
    if (password.length < 8) {
      res.status(HttpStatus.BAD_REQUEST).json({
        messages: 'la contraseña debe tener minimo 8 caracteres',
      });
    }
    //compruebo que el email no exista
    const emailCheck = await this.authService.getEmail(email);
    if (emailCheck !== 'ok') {
      return emailCheck;
    }

    try {
      const user = await this.authService.createUser(createUserDto);
      return res.status(HttpStatus.OK).json({
        message: 'Usuario creado con exito',
        usuario: user,
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).send(err);
    }
  }
}
