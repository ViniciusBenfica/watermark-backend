import type Payment from "@/domain/payment/entity/payment.entity";
import type PaymentRepositoryInterface from "@/infrastructure/payment/repositories/payment.repository";
import type { OutputFindPaymentsByUserIdDto } from "./findPaymentsByUserId.payment.dto";

export default class FindPaymentsByUserIdUseCase {
	constructor(private paymentRepository: PaymentRepositoryInterface) {}

	async execute(userId: string): Promise<OutputFindPaymentsByUserIdDto[]> {
		const payments = await this.paymentRepository.findAllByUserId(userId);

		return payments.map((payment: Payment) => {
			return {
				id: payment.id,
				userId: payment.userId,
				planId: payment.planId,
				buyDate: payment.buyDate,
				status: payment.status,
				price: payment.price,
			};
		});
	}
}
