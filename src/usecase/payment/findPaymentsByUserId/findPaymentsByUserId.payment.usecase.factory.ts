import PaymentRepository from "@/infrastructure/payment/repositories/payment.repository";
import FindPaymentsByUserIdUseCase from "./findPaymentsByUserId.payment.usecase";

export default class FindPaymentsByUserIdUsecaseFactory {
	static create() {
		return new FindPaymentsByUserIdUseCase(new PaymentRepository());
	}
}
