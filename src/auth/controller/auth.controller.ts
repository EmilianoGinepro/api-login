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
  async findEmail(@Body() userEmailDto: UserEmailDto) {
    const email = await this.authService.getEmail(userEmailDto);
    if (email == true) {
      console.log(email, true);
      return true;
    }
    console.log(email, false);
    return false;
  }

  @Post()
  @ApiOperation({ summary: 'Creacion de usuario' })
  @ApiResponse({
    status: 400,
    description: 'El nombre, email y contraseña son obligatorios',
  })
  @ApiResponse({ status: 200, description: 'Usuario creado' })
  async createUser(@Res() res, @Body() createUserDto: CreateUserDto) {
    try {
      const { name, password, email } = createUserDto;
      if (!name || !password || !email) {
        res.status(HttpStatus.BAD_REQUEST).json({
          messages: 'El nombre, email y contraseña son obligatorios',
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
