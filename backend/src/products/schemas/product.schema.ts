import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;

// Multilingual text structure
export interface MultilingualText {
  en: string;
  fr?: string;
  ar?: string;
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  name: MultilingualText;

  @Prop({ type: MongooseSchema.Types.Mixed })
  tagline?: MultilingualText;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  description: MultilingualText;

  @Prop({ required: true })
  category: string; // 'mattress' or 'furniture'

  @Prop()
  image: string;

  @Prop()
  model3d: string; // Path to 3D model file (.glb, .gltf)

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  highlights?: MultilingualText[];

  @Prop({ default: 4.5 })
  rating?: number;

  @Prop({ default: 0 })
  reviewsCount?: number;

  @Prop({ type: MongooseSchema.Types.Mixed })
  shippingInfo?: MultilingualText;

  @Prop()
  warrantyYears?: number;

  @Prop({ type: MongooseSchema.Types.Mixed })
  specifications: Record<string, MultilingualText>;

  @Prop({ default: true })
  inStock: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
