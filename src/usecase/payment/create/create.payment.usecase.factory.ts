import PaymentRepository from "@/infrastructure/payment/repositories/payment.repository";
import FindPlanUsecaseFactory from "@/usecase/plan/find/find.plan.usecase.factory";
import CreateSubscriptionUsecaseFactory from "@/usecase/subscription/create/subscription.userPlan.usecase.factory";
import CreatePaymentUseCase from "./create.payment.usecase";

export default class CreatePaymentUsecaseFactory {
	static create() {
		const findPlanUseCase = FindPlanUsecaseFactory.create();
		const createSubscriptionUseCase = CreateSubscriptionUsecaseFactory.create();
		return new CreatePaymentUseCase(new PaymentRepository(), findPlanUseCase, createSubscriptionUseCase);
	}
}
