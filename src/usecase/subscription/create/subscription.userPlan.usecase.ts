import SubscriptionFactory from "@/domain/subscription/factory/subscription.factory";
import type SubscriptionRepositoryInterface from "@/domain/subscription/repositories/subscription.repository.interface";
import type { InputCreateSubscriptionDto, OutputCreateSubscriptionDto } from "./subscription.userPlan.dto";

export default class CreateSubscriptionUseCase {
	constructor(private subscriptionRepository: SubscriptionRepositoryInterface) {}

	async execute(input: InputCreateSubscriptionDto): Promise<OutputCreateSubscriptionDto> {
		const subscription = SubscriptionFactory.create(input.userId, input.planId, input.buyDate, input.expirationDate);
		await this.subscriptionRepository.create(subscription);

		return {
			id: subscription.id,
			userId: subscription.userId,
			planId: subscription.planId,
			buyDate: subscription.buyDate,
			expirationDate: subscription.expirationDate,
		};
	}
}
