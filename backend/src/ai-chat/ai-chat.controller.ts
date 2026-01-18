import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AiChatService } from './ai-chat.service';
import { CreateAiChatDto } from './dto/create-ai-chat.dto';
import { UpdateAiChatDto } from './dto/update-ai-chat.dto';
import { Throttle } from '@nestjs/throttler';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  // ADMIN ONLY: Create chat entry
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  create(@Body() createAiChatDto: CreateAiChatDto) {
    return this.aiChatService.create(createAiChatDto);
  }

  // PUBLIC: Get all chat entries (customer FAQ)
  @Get()
  @Throttle({ default: { limit: 200, ttl: 60000 } }) // 200 requests per minute
  findAll(@Query('locale') locale?: string) {
    if (locale && !['en', 'fr', 'ar'].includes(locale)) {
      throw new BadRequestException('Invalid locale');
    }
    return this.aiChatService.findAll(locale);
  }

  // PUBLIC: Get chat entry by ID
  @Get(':id')
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query('locale') locale?: string,
  ) {
    if (locale && !['en', 'fr', 'ar'].includes(locale)) {
      throw new BadRequestException('Invalid locale');
    }
    return this.aiChatService.findOne(id, locale);
  }

  // ADMIN ONLY: Update chat entry
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateAiChatDto: UpdateAiChatDto,
  ) {
    return this.aiChatService.update(id, updateAiChatDto);
  }

  // ADMIN ONLY: Delete chat entry
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.aiChatService.remove(id);
  }
}

