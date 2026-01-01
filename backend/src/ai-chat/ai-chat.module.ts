import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiChatService } from './ai-chat.service';
import { AiChatController } from './ai-chat.controller';
import { AiChat, AiChatSchema } from './schemas/ai-chat.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: AiChat.name, schema: AiChatSchema }])],
  controllers: [AiChatController],
  providers: [AiChatService],
  exports: [AiChatService], // Export if you need to use it in other modules
})
export class AiChatModule {}

