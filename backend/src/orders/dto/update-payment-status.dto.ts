import { IsEnum } from 'class-validator';
import { PaymentStatus } from '../schemas/order.schema';

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;
}
