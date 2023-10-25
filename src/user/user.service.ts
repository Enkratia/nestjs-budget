import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const saltRounds = 10;

    const isExist = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (isExist) throw new BadRequestException('This email already exist');

    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, saltRounds),
    });

    return { user };
  }

  // findOne(id: number) {
  //   return `This action returns all user`;
  // }
}