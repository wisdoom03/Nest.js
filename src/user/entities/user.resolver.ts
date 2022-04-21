import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/auth/authguard.guard';
import { CurrentUser, ICurrentUser } from 'src/auth/gql-user.param';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Query(() => [User], { name: 'user' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User)
  fetchUser(@Args('userId', { type: () => ID }) userId: string) {
    return this.userService.fetchUser(userId);
  }

  @Query(() => [User], { nullable: true })
  fetchAllUser() {
    return this.userService.fetchAllUser();
  }

  @Query(() => [User])
  fetchUsers(
    @Args('page', { type: () => Int, nullable: true }) page: number,
    @Args('perPage', { type: () => Int, nullable: true }) perPage: number,
  ) {
    return this.userService.fetchUsers(page, perPage);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.userService.updateUser(updateUserInput, currentUser.id);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(@CurrentUser() currentUser: ICurrentUser) {
    return this.userService.deleteUser(currentUser.id);
  }
}
