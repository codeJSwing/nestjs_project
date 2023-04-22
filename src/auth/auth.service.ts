import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PostgresErrorCodesEnum } from '../database/postgresErrorCodes.enum';
import { LoginUserDto } from '../user/dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService
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
      if (!user) {
        throw new HttpException('no user', HttpStatus.NOT_FOUND)
      }
      // 패스워드 매칭
      await bcrypt.compare(plainPassword, user.password)
      return user;
    } catch (err) {
      throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST)
    }
  }
}
