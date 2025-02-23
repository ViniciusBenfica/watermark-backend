import Stripe from "stripe";
import { env } from "../../../app/env";
import type ProcessPaymentInterface from "./processPayment.interface";
import type { InputProcessPaymentDto } from "./processPayment.interface";

export default class ProcessPayment implements ProcessPaymentInterface {
	private stripe: Stripe;

	constructor() {
		this.stripe = new Stripe(env.STRIPE_SECRET_KEY);
	}

	async userPurchase(paymentData: InputProcessPaymentDto) {
		try {
			const priceId = await this.getPriceIdByProduct(paymentData.productId);

			if (!priceId) throw new Error("Product not found");

			const session = await this.stripe.checkout.sessions.create({
				payment_method_types: ["card"],
				ui_mode: "embedded",
				mode: "subscription",
				line_items: [
					{
						price: priceId,
						quantity: paymentData.quantity,
					},
				],
				return_url: env.FRONTEND_URL,
				metadata: {
					userId: paymentData.userId,
					planId: paymentData.productId,
				},
			});

			return { id: session.id, client_secret: session.client_secret };
		} catch (error) {
			throw new Error("Error when calling the payment route");
		}
	}

	private async getPriceIdByProduct(productId: string): Promise<string | null> {
		const prices = await this.stripe.prices.list({
			active: true,
			product: productId,
			limit: 1,
			expand: ["data.product"],
		});

		const price = prices.data[0];

		return price.id;
	}
}
