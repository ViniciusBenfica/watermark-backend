import type Subscription from "../entity/subscription.entity";

export default interface SubscriptionRepositoryInterface {
	create(subscription: Subscription): Promise<void>;
}
