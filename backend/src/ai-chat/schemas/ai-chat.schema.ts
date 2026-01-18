import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MultilingualText } from '../../products/schemas/product.schema'; // Reusing MultilingualText

export type AiChatDocument = AiChat & Document;

@Schema({ timestamps: true })
export class AiChat {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  answer: MultilingualText;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ type: [String], default: [] })
  categories?: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const AiChatSchema = SchemaFactory.createForClass(AiChat);

// Database indexes for query optimization
AiChatSchema.index({ isActive: 1 });
AiChatSchema.index({ tags: 1 });
AiChatSchema.index({ categories: 1 });
AiChatSchema.index({ createdAt: -1 });

