import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface TrackingInfo {
  status: string;
  date: string;
  location: string;
  description: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string; // Format: BBL-XXXXXX

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ type: [MongooseSchema.Types.Mixed], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true, default: 0 })
  shipping: number;

  @Prop({ required: true, default: 0 })
  tax: number;

  @Prop({ required: true })
  total: number;

  @Prop({ 
    type: String, 
    enum: Object.values(OrderStatus), 
    default: OrderStatus.PENDING 
  })
  status: OrderStatus;

  @Prop({ 
    type: String, 
    enum: Object.values(PaymentStatus), 
    default: PaymentStatus.PENDING 
  })
  paymentStatus: PaymentStatus;

  @Prop()
  paymentMethod: string; // 'card' or 'paypal'

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  trackingHistory: TrackingInfo[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Database indexes for query optimization
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ status: 1, paymentStatus: 1 }); // Compound index for filtering
OrderSchema.index({ 'shippingAddress.email': 1 }); // For customer order lookups
