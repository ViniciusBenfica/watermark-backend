import SubscriptionRepository from "@/infrastructure/subscription/repositories/subscription.repository";
import CreateSubscriptionUseCase from "./subscription.userPlan.usecase";

export default class CreateSubscriptionUsecaseFactory {
	static create() {
		return new CreateSubscriptionUseCase(new SubscriptionRepository());
	}
}
