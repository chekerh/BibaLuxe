import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 uploads per minute
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.uploadService.uploadImage(file);
    return {
      success: true,
      url: result.url,
      publicId: result.publicId,
    };
  }

  @Delete('image/:publicId')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async deleteImage(@Param('publicId') publicId: string) {
    // Decode the publicId (it may contain slashes which are URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);
    await this.uploadService.deleteImage(decodedPublicId);
    return {
      success: true,
      message: 'Image deleted successfully',
    };
  }
}
