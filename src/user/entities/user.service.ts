import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from './user.entity';
import { ApolloError } from 'apollo-server-express';

// 다른 클래스에 주입할 수 있다
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async fetchUsers(page?: number, perPage?: number) {
    page = page ? page : 1;
    perPage = perPage ? perPage : 10;
    const startIdx = (page - 1) * perPage;

    const result = await this.userRepository
      .createQueryBuilder('user')
      .limit(perPage)
      .offset(startIdx)
      .getMany();

    return result;
  }
  async fetchAllUser() {
    return await this.userRepository.find();
  }

  async createUser(createUserInput: CreateUserInput) {
    // try ~ catch 생략해도 됨!

    const user = await this.userRepository.findOne({
      where: { email: createUserInput.email },
    });

    if (user) return new ApolloError('이미 등록된 회원입니다');

    const newUser = await this.userRepository.save({ ...createUserInput });
    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  async fetchUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) return new ApolloError('일치하는 유저 정보가 없습니다.');
    return user;
  }

  async updateUser(updateUserInput: UpdateUserInput, userId: string) {
    const result = await this.userRepository.update(
      { id: userId },
      { ...updateUserInput },
    );

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    return result.affected > 0 ? user : new ApolloError('업데이트 실패');
  }

  async deleteUser(userId: string) {
    const result = await this.userRepository.softDelete({ id: userId });

    return result.affected > 0;
  }
}
