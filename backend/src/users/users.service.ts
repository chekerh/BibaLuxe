import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { password, ...userData } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({
      ...userData,
      passwordHash,
    });
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-passwordHash').exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = await this.userModel.findById(id).select('-passwordHash').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Invalid user ID');
    }
    const existingUser = await this.userModel.findById(id).exec();
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updateObject: any = { ...updateUserDto };

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateObject.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      delete updateObject.password; // Remove plain password from update object
    }

    return this.userModel
      .findByIdAndUpdate(id, updateObject, { new: true })
      .select('-passwordHash')
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Invalid user ID');
    }
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }

  async findByUsername(username: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ email }).exec();
  }
}

