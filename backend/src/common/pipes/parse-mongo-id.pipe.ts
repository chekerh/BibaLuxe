import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    // Security: Validate MongoDB ObjectId format to prevent injection
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`Invalid MongoDB ObjectId: ${value}`);
    }
    return value;
  }
}

