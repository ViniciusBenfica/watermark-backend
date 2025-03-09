import { v4 as uuid } from "uuid";
import Subscription from "../entity/subscription.entity";

export default class SubscriptionFactory {
	static create(userId: string, planId: string, buyDate: Date, expirationDate: Date, id?: string): Subscription {
		return new Subscription(id || uuid(), userId, planId, buyDate, expirationDate);
	}
}
