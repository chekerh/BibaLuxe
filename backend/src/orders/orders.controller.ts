import { Controller, Get, Post, Body, Param, Patch, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { Order, OrderStatus, PaymentStatus } from './schemas/order.schema';
import { Throttle } from '@nestjs/throttler';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @Throttle({ default: { limit: 200, ttl: 60000 } }) // 200 requests per minute
  async findAll(
    @Query('status') status?: OrderStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
  ): Promise<Order[]> {
    const orders = await this.ordersService.findAll();
    
    // Filter by status if provided
    if (status) {
      return orders.filter(order => order.status === status);
    }
    
    // Filter by payment status if provided
    if (paymentStatus) {
      return orders.filter(order => order.paymentStatus === paymentStatus);
    }
    
    return orders;
  }

  @Get('track/:orderNumber')
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  async trackOrder(@Param('orderNumber') orderNumber: string): Promise<Order> {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @Get(':id')
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  async findOne(@Param('id', ParseMongoIdPipe) id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  async updateStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.ordersService.updateStatus(
      id,
      updateOrderStatusDto.status,
      updateOrderStatusDto.trackingInfo,
    );
  }

  @Patch(':id/payment-status')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  async updatePaymentStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ): Promise<Order> {
    return this.ordersService.updatePaymentStatus(id, updatePaymentStatusDto.paymentStatus);
  }
}
