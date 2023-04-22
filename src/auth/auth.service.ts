import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PostgresErrorCodesEnum } from '../database/postgresErrorCodes.enum';
import { LoginUserDto } from '../user/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadInterface } from './tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.createUser(createUserDto);
      newUser.password = undefined;
      return newUser;
    } catch (err) {
      if (err?.code === PostgresErrorCodesEnum.UniqueValidation) {
        throw new HttpException('email already exists', HttpStatus.BAD_REQUEST)
      }

      throw new HttpException('something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async loginUser(email: string, plainPassword: string) {
    try {
      // 이메일 확인
      const user = await this.userService.getUserByEmail(email)
      // 패스워드 매칭
      const isPasswordMatching = await bcrypt.compare(plainPassword, user.password)
      if (!isPasswordMatching) {
        throw new HttpException('password do not matched', HttpStatus.BAD_REQUEST)
      }
      user.password = undefined;
      return user;
    } catch (err) {
      throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST)
    }
  }

  public generateJwt(userId: string) {
    const payload: TokenPayloadInterface = { userId }
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESSTOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESSTOKEN_EXPIRATION_TIME')}s`
    })
    return token;
  }
}
