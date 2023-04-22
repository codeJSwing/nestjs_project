import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  // db의 전체 데이터를 가져오는 로직
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
  }

  // user를 가져오는 API
  async getAllUsers() {
    return await this.userRepository.find();
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new HttpException('no user', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('no id', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }


}
