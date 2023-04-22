import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

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
      throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST)
    }
  }

}
