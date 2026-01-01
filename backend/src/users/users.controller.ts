import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Throttle } from '@nestjs/throttler';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async create(@Body() createUserDto: CreateUserDto) {
    // Security: Check if username or email already exists
    const existingUserByUsername = await this.usersService.findByUsername(createUserDto.username);
    if (existingUserByUsername) {
      throw new BadRequestException('Username already exists');
    }
    const existingUserByEmail = await this.usersService.findByEmail(createUserDto.email);
    if (existingUserByEmail) {
      throw new BadRequestException('Email already exists');
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Throttle({ default: { limit: 200, ttl: 60000 } }) // 200 requests per minute
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Security: Check if username or email already exists if they are being updated
    if (updateUserDto.username) {
      const existingUser: UserDocument = await this.usersService.findByUsername(updateUserDto.username);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new BadRequestException('Username already exists');
      }
    }
    if (updateUserDto.email) {
      const existingUser: UserDocument = await this.usersService.findByEmail(updateUserDto.email);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new BadRequestException('Email already exists');
      }
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}

