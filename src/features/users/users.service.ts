import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      email: 'a.shehata.dev@gmail.com',
      password: 'password123',
    },
    {
      userId: 2,
      email: 'test@gmail.com',
      password: 'test',
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
