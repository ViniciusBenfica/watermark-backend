import type ManageSubscriptionInterface from "@/infrastructure/subscription/manageSubscription/manageSubscription.interface";
import type {
	InputManageSubscriptionDto,
	OutputManageSubscriptionDto,
} from "@/infrastructure/subscription/manageSubscription/manageSubscription.interface";
import Stripe from "stripe";
import { env } from "../../../app/env";

export default class ManageSubscription implements ManageSubscriptionInterface {
	private stripe: Stripe;

	constructor() {
		this.stripe = new Stripe(env.STRIPE_SECRET_KEY);
	}

	async manageSubscriptionStripe(input: InputManageSubscriptionDto): Promise<OutputManageSubscriptionDto> {
		try {
			const session = await this.stripe.billingPortal.sessions.create({
				customer: input.userId,
				return_url: env.FRONTEND_URL,
			});

			return { url: session.url };
		} catch (error) {
			console.log(error);
			throw new Error("Error when finding the subscription");
		}
	}
}
