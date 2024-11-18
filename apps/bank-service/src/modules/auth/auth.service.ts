import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  // Simulated user data (replace with actual database logic)
  private readonly users = [
    {
      userId: 1,
      username: 'admin',
      password: 'password',
    },
    {
      userId: 2,
      username: 'user',
      password: 'password',
    },
  ];

  constructor(private readonly jwtService: JwtService) {}


  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find(
      u => u.username === username && u.password === password,
    );
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
