import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ApolloError } from 'apollo-server-express';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async loginUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) return new ApolloError('일치하는 유저 정보가 없습니다.');
    if (user.password !== password)
      return new ApolloError('비밀번호가 틀립니다.');
    const accessToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      {
        secret: 'potato',
        algorithm: 'HS256',
        subject: 'accessToken',
        expiresIn: '2h',
      },
    );
    return accessToken;
  }
}
