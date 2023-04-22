import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Provider } from '../../user/entities/provider.enum';
import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, Provider.LOCAL) {
  constructor(
    private authService: AuthService
  ) {
    super({
      usernameField: 'email'
    });
  }

  async validate(email: string, password: string): Promise<User> {
    return this.authService.loginUser(email, password);
  }
}