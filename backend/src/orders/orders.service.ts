import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus, PaymentStatus, TrackingInfo } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  /**
   * Generate a unique order number
   */
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BBL-${timestamp}-${random}`;
  }

  /**
   * Create initial tracking history
   */
  private createInitialTrackingHistory(): TrackingInfo[] {
    return [
      {
        status: 'Order Placed',
        date: new Date().toISOString().split('T')[0],
        location: 'BibaLuxe Warehouse',
        description: 'Your order has been confirmed and payment processed.',
      },
    ];
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const orderNumber = this.generateOrderNumber();
    const trackingHistory = this.createInitialTrackingHistory();

    const order = new this.orderModel({
      ...createOrderDto,
      orderNumber,
      status: OrderStatus.PENDING,
      paymentStatus: createOrderDto.paymentStatus || PaymentStatus.PENDING,
      trackingHistory,
    });

    return order.save();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order.toObject();
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderModel.findOne({ orderNumber }).exec();
    if (!order) {
      throw new NotFoundException(`Order with order number ${orderNumber} not found`);
    }
    return order.toObject();
  }

  async findAll(filters?: { status?: OrderStatus; paymentStatus?: PaymentStatus }): Promise<Order[]> {
    const query: Record<string, any> = {};
    
    if (filters?.status) {
      query.status = filters.status;
    }
    if (filters?.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }
    
    // Use lean() for read-only queries to reduce memory usage
    return this.orderModel.find(query).sort({ createdAt: -1 }).lean().exec();
  }

  async updateStatus(id: string, status: OrderStatus, trackingInfo?: TrackingInfo): Promise<Order> {
    const order: OrderDocument | null = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    order.status = status;
    
    if (trackingInfo) {
      order.trackingHistory.push(trackingInfo);
    }
    
    const savedOrder = await order.save();
    return savedOrder.toObject();
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Order> {
    const order: OrderDocument | null = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    order.paymentStatus = paymentStatus;
    const savedOrder = await order.save();
    return savedOrder.toObject();
  }
}
