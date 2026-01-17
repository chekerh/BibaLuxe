import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

export class TrackingInfoDto {
  @IsString()
  status: string;

  @IsDateString()
  date: string;

  @IsString()
  location: string;

  @IsString()
  description: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  trackingInfo?: TrackingInfoDto;
}
