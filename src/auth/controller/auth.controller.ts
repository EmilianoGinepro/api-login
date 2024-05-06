import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../dto/user.dto';
import { UserEmailDto } from '../dto/userEmail.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/user')
@ApiTags('User')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //da problemas con el schema
  @Get()
  @ApiOperation({ summary: 'Busca un usuario por el email' })
  async findEmail(@Res() res, @Body() userEmailDto: UserEmailDto) {
    const email = await this.authService.getEmail(userEmailDto);
    return res.status(HttpStatus.OK).json({
      message: email,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Creacion de usuario' })
  @ApiResponse({
    status: 400,
    description: 'El nombre, email y contraseña son obligatorios',
  })
  @ApiResponse({ status: 200, description: 'Usuario creado' })
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
    /*const emailSend = { ...UserEmailDto, email: createUserDto.email };
      if ((await this.findEmail(emailSend)) == true) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Ya existe un usuario con ese email',
        });
      }*/
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
