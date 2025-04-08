import type Payment from "@/domain/payment/entity/payment.entity";
import PaymentFactory from "@/domain/payment/factory/payment.factory";
import type PaymentRepositoryInterface from "@/domain/payment/repositories/payment.repository";
import { PrismaClient, type Payment as PrismaPayment } from "@prisma/client";

export default class PaymentRepository implements PaymentRepositoryInterface {
	prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async find(id: string): Promise<Payment | null> {
		const payment = await this.prisma.payment.findFirst({
			where: {
				id,
			},
		});

		if (!payment) {
			return null;
		}

		return PaymentFactory.create(payment.userId, payment.planId, payment.buyDate, payment.status, payment.price, payment.id);
	}

	async create(entity: Payment): Promise<void> {
		await this.prisma.payment.create({
			data: {
				id: entity.id,
				buyDate: entity.buyDate,
				planId: entity.planId,
				userId: entity.userId,
				status: entity.status,
				price: entity.price,
			},
		});
	}

	async findAllByUserId(userId: string): Promise<Payment[]> {
		const payments = await this.prisma.payment.findMany({
			where: {
				userId,
			},
		});

		return payments.map((payment: PrismaPayment) => {
			return PaymentFactory.create(payment.userId, payment.planId, payment.buyDate, payment.status, payment.price, payment.id);
		});
	}
}
