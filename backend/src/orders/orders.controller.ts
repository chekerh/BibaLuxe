import { Controller, Get, Post, Body, Param, Patch, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { Order, OrderStatus, PaymentStatus } from './schemas/order.schema';
import { Throttle } from '@nestjs/throttler';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // PUBLIC: Customer checkout - no auth required
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  // ADMIN ONLY: List all orders
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Throttle({ default: { limit: 200, ttl: 60000 } }) // 200 requests per minute
  async findAll(
    @Query('status') status?: OrderStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
  ): Promise<Order[]> {
    // Pass filters directly to service for MongoDB-level filtering (efficient)
    return this.ordersService.findAll({ status, paymentStatus });
  }

  // PUBLIC: Customer order tracking - no auth required
  @Get('track/:orderNumber')
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  async trackOrder(@Param('orderNumber') orderNumber: string): Promise<Order> {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  // ADMIN ONLY: Get order by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  async findOne(@Param('id', ParseMongoIdPipe) id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  // ADMIN ONLY: Update order status
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  // ADMIN ONLY: Update payment status
  @Patch(':id/payment-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  async updatePaymentStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ): Promise<Order> {
    return this.ordersService.updatePaymentStatus(id, updatePaymentStatusDto.paymentStatus);
  }
}
