import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    const userDoc = user as UserDocument;
    if (userDoc && (await bcrypt.compare(pass, userDoc.passwordHash))) {
      const { passwordHash, ...result } = userDoc.toObject();
      return result;
    }
    return null;
  }

  async login(user: UserDocument) {
    const payload = { username: user.username, sub: user._id.toString(), role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

