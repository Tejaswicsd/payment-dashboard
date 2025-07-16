// src/payments/dto/create-payment.dto.ts
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  UPI = 'upi',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  receiver: string;

  @IsEnum(PaymentMethod, { message: 'method must be a valid PaymentMethod enum value' })
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'status must be a valid PaymentStatus enum value' })
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  transactionId?: string;
}
