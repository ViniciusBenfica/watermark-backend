import type ProcessPaymentInterface from "../../../infrastructure/user/processPayment/processPayment.interface";
import type FindPlanUseCase from "../../plan/find/find.plan.usecase";
import type FindUserUseCase from "../find/find.user.usecase";
import type { InputCreatePaymentDto, OutputCreatePaymentDto } from "./buy.user.dto";

export default class UserBuyProductUseCase {
	constructor(
		private findUser: FindUserUseCase,
		private findPlan: FindPlanUseCase,
		private processPayment: ProcessPaymentInterface,
	) {}

	async execute(input: InputCreatePaymentDto): Promise<OutputCreatePaymentDto> {
		await this.findUser.execute({ id: input.userId });

		const plan = await this.findPlan.execute({ id: input.planId });

		const paymentDto = {
			productId: plan.id,
			userId: input.userId,
			productPrice: plan.price,
			productName: plan.name,
			currency: "brl",
			quantity: 1,
		};

		const payment = await this.processPayment.userPurchase(paymentDto);

		return {
			id: payment.id,
			client_secret: payment.client_secret,
		};
	}
}
