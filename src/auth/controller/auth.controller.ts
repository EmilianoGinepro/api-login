import { Body, Controller, HttpStatus, Post, Put, Res } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../dto/user.dto';
import { UpdatePasswordDto } from '../dto/updatePassword.dto';
import { LoginUserDto } from '../dto/loginUser.dto';

@Controller('/user')
@ApiTags('User')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //falta mejorar la documentacion en general
  //Creacion de usuario
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
    const { email } = createUserDto;
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
  //Actualizacion de contraseña
  @Put()
  @ApiParam({
    name: 'email',
    required: true,
    type: 'string',
    example: 'example@email.com',
  })
  @ApiOperation({
    summary:
      'Genera una nueva contraseña de forma aletoria y la envia por mail',
  })
  @ApiOkResponse({
    description: 'Contraseña actualizada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error al actualizar la contraseña',
  })
  async updatePassword(
    @Res() res,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<any> {
    const { email, password } = updatePasswordDto;
    try {
      await this.authService.updatePassword(email, password);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Contraseña actualizada exitosamente' });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).send(err);
    }
  }
  //Login y envio de jwt
  @Post('/login')
  @ApiParam({
    name: 'email',
    required: true,
    type: 'string',
    example: 'example@email.com',
  })
  @ApiParam({
    name: 'password',
    required: true,
    type: 'string',
    example: '123abc78',
  })
  @ApiOperation({ summary: 'Autenticacion de usuario' })
  @ApiCreatedResponse({
    description: 'Login exitoso, se envia token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'El email y contraseña son obligatorios',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El mail y/o la contraseña son incorrectos',
  })
  async loginUser(
    @Res() res,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<any> {
    try {
      const login = await this.authService.postLogin(loginUserDto);
      return res.status(HttpStatus.OK).send(login);
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).send(err);
    }
  }
}
