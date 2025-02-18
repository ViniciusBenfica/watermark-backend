import type Payment from "../entity/payment.entity";

export default interface PaymentRepositoryInterface {
	create(input: Payment): Promise<void>;
	find(id: string): Promise<Payment | null>;
}
