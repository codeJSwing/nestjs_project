import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/signup')
  async signupUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registerUser(createUserDto)
  }

  // @Post('/login')
  // async loginUser(@Body() loginUserDto: LoginUserDto) {
  //   return await this.authService.loginUser(loginUserDto.email, loginUserDto.password)
  // }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async loginUser(@Req() req: any) {
    const user = req.user
    return user
  }
}
