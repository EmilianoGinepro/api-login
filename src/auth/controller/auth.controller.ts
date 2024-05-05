import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserDto } from '../dto/user.dto';

@Controller('/controller')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(@Body() userDto: UserDto) {
    await this.authService.create(userDto);
  }
}
