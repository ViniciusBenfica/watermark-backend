import PaymentRepository from "@/infrastructure/payment/repositories/payment.repository";
import FindPlanUsecaseFactory from "@/usecase/plan/find/find.plan.usecase.factory";
import CreateUserPlanUsecaseFactory from "@/usecase/userPlan/create/create.userPlan.usecase.factory";
import CreatePaymentUseCase from "./create.payment.usecase";

export default class CreatePaymentUsecaseFactory {
	static create() {
		const findPlanUseCase = FindPlanUsecaseFactory.create();
		const createUserPlanUseCase = CreateUserPlanUsecaseFactory.create();
		return new CreatePaymentUseCase(new PaymentRepository(), findPlanUseCase, createUserPlanUseCase);
	}
}
