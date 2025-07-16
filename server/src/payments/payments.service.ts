import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, user: any) {
    const transactionId = createPaymentDto.transactionId || `txn_${uuidv4()}`;

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      transactionId,
      userId: user?.sub || user?.userId, // JWT compatible
    });

    return this.paymentRepository.save(payment);
  }

  async findAll(query: any) {
    const { status, method, page = 1, limit = 10 } = query;

    const where: any = {};
    if (status) where.status = status;
    if (method) where.method = method;

    const [data, total] = await this.paymentRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: Number(limit),
      relations: ['user'],
    });

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async findByUserId(userId: string) {
    return this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.paymentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async getStats() {
    // Basic statistics: revenue, failures, today's total, this week's total
    const raw = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('COALESCE(SUM(payment.amount), 0)', 'totalRevenue')
      .addSelect('COUNT(*) FILTER (WHERE payment.status = \'failed\')', 'failedTransactions')
      .addSelect('COUNT(*) FILTER (WHERE DATE(payment.createdAt) = CURRENT_DATE)', 'totalPaymentsToday')
      .addSelect('COUNT(*) FILTER (WHERE payment.createdAt >= NOW() - INTERVAL \'7 days\')', 'totalPaymentsThisWeek')
      .getRawOne();

    // Revenue trend for last 7 days
    const chart = await this.paymentRepository.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('day', "createdAt"), 'YYYY-MM-DD') AS date,
        COALESCE(SUM(amount), 0) AS revenue
      FROM payment
      WHERE "createdAt" >= NOW() - INTERVAL '7 days'
      GROUP BY 1
      ORDER BY 1
    `);

    // Payment count per method (for pie chart)
    const byMethod = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('payment.method', 'method')
      .addSelect('COUNT(*)', 'count')
      .groupBy('payment.method')
      .getRawMany();

    return {
      totalRevenue: Number(raw.totalRevenue),
      failedTransactions: Number(raw.failedTransactions),
      totalPaymentsToday: Number(raw.totalPaymentsToday),
      totalPaymentsThisWeek: Number(raw.totalPaymentsThisWeek),
      revenueChart: chart.map((row: any) => ({
        date: row.date,
        revenue: Number(row.revenue),
      })),
      paymentsByMethod: byMethod.map((row: any) => ({
        method: row.method,
        count: Number(row.count),
      })),
    };
  }
}
