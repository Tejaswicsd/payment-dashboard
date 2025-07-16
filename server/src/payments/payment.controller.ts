// src/payments/payments.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    try {
      const user = req.user;
      if (!user || (!user.sub && !user.userId)) {
        throw new UnauthorizedException('User not authenticated');
      }

      return await this.paymentsService.create(createPaymentDto, user);
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to create payment', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(@Query() query: any) {
    try {
      return await this.paymentsService.findAll(query);
    } catch (error) {
      throw new HttpException('Failed to fetch payments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('my-payments')
  async getMyPayments(@Request() req) {
    try {
      const userId = req.user.sub || req.user.userId;
      return await this.paymentsService.findByUserId(userId);
    } catch (error) {
      throw new HttpException('Failed to fetch user payments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('stats')
  async getStats() {
    try {
      return await this.paymentsService.getStats();
    } catch (error) {
      throw new HttpException('Failed to fetch payment stats', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const payment = await this.paymentsService.findOne(id);
      if (!payment) {
        throw new HttpException(`Payment with id ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return payment;
    } catch (error) {
      throw new HttpException('Failed to fetch payment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
