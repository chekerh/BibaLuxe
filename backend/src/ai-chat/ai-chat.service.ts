import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiChat, AiChatDocument } from './schemas/ai-chat.schema';
import { CreateAiChatDto } from './dto/create-ai-chat.dto';
import { UpdateAiChatDto } from './dto/update-ai-chat.dto';
import {
  getLocalizedText,
  getLocaleFromRequest,
  Locale,
} from '../products/utils/localization.util'; // Reusing localization utilities

@Injectable()
export class AiChatService {
  constructor(
    @InjectModel(AiChat.name) private aiChatModel: Model<AiChatDocument>,
  ) {}

  private localizeAiChat(aiChat: AiChatDocument, locale: Locale): any {
    return {
      ...aiChat.toObject(),
      answer: getLocalizedText(aiChat.answer, locale),
    };
  }

  async create(createAiChatDto: CreateAiChatDto): Promise<AiChat> {
    const createdAiChat = new this.aiChatModel(createAiChatDto);
    return createdAiChat.save();
  }

  async findAll(locale?: string): Promise<any[]> {
    const loc = getLocaleFromRequest(locale);
    const aiChats = await this.aiChatModel.find().exec();
    return aiChats.map((aiChat) => this.localizeAiChat(aiChat, loc));
  }

  async findOne(id: string, locale?: string): Promise<any> {
    if (!id || id.trim().length === 0) {
      throw new NotFoundException('Invalid AI Chat ID');
    }
    const aiChat = await this.aiChatModel.findById(id).exec();
    if (!aiChat) {
      throw new NotFoundException('AI Chat entry not found');
    }
    const loc = getLocaleFromRequest(locale);
    return this.localizeAiChat(aiChat, loc);
  }

  async update(id: string, updateAiChatDto: UpdateAiChatDto): Promise<AiChat> {
    const existingAiChat = await this.aiChatModel.findById(id).exec();
    if (!existingAiChat) {
      throw new NotFoundException('AI Chat entry not found');
    }

    const updateObject: any = { ...updateAiChatDto };

    // Handle multilingual answer field
    if (updateAiChatDto.answer) {
      updateObject.answer = { ...existingAiChat.answer, ...updateAiChatDto.answer };
    }

    return this.aiChatModel
      .findByIdAndUpdate(id, updateObject, { new: true })
      .exec();
  }

  async remove(id: string): Promise<AiChat> {
    const deletedAiChat = await this.aiChatModel.findByIdAndDelete(id).exec();
    if (!deletedAiChat) {
      throw new NotFoundException('AI Chat entry not found');
    }
    return deletedAiChat;
  }
}

