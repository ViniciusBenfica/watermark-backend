import { env } from "@/app/env";
import PaymentFactory from "@/domain/payment/factory/payment.factory";
import type PaymentRepositoryInterface from "@/domain/payment/repositories/payment.repository";
import PlanFactory from "@/domain/plan/factory/plan.factory";
import UserPlanFactory from "@/domain/subscription/factory/subscription.factory";
import type FindPlanUseCase from "@/usecase/plan/find/find.plan.usecase";
import type CreateSubscriptionUseCase from "@/usecase/subscription/create/subscription.userPlan.usecase";
import Stripe from "stripe";
import type { InputCreatePaymentDto } from "./create.payment.dto";

export default class CreatePaymentUseCase {
	private stripe: Stripe;

	constructor(
		private paymentRepository: PaymentRepositoryInterface,
		private findPlanUseCase: FindPlanUseCase,
		private createSubscriptionUseCase: CreateSubscriptionUseCase,
	) {
		this.stripe = new Stripe(env.STRIPE_SECRET_KEY);
	}

	async execute(input: InputCreatePaymentDto) {
		const event = this.stripe.webhooks.constructEvent(input.rawBody, input.sig, env.STRIPE_WEBHOOK_SECRET);
		await this.handleStripeEvent(event);
	}

	private async handleStripeEvent(event: Stripe.Event) {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session;
				await this.handleCheckoutCompleted(session);
				break;
			}
			case "invoice.payment_failed": {
				const invoice = event.data.object as Stripe.Invoice;
				await this.handlePaymentFailed(invoice);
				break;
			}
			case "customer.subscription.deleted": {
				const subscription = event.data.object as Stripe.Subscription;
				await this.handleSubscriptionCanceled(subscription);
				break;
			}
		}
	}

	private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
		const userId = session.metadata?.userId;
		const planId = session.metadata?.planId;

		if (!userId || !planId) {
			throw new Error("Missing required metadata");
		}

		const planData = await this.findPlanUseCase.execute({ id: planId });

		if (!planData) {
			throw new Error("Plan not found");
		}

		const buyDate = new Date();

		const plan = PlanFactory.create(planData.name, planData.description, planData.price, planData.duration, planData.id);

		const expirationDate = plan.calculateExpirationDate(buyDate);

		const payment = PaymentFactory.create(userId, planId, buyDate);

		this.paymentRepository.create(payment);

		this.createSubscriptionUseCase.execute({
			userId,
			planId,
			buyDate,
			expirationDate,
		});

		UserPlanFactory.create(userId, planId, buyDate, expirationDate);
	}

	private async handlePaymentFailed(invoice: Stripe.Invoice) {
		console.log("❌ Payment failed for invoice:", invoice.id);
	}

	private async handleSubscriptionCanceled(subscription: Stripe.Subscription) {
		console.log("🚫 Subscription canceled:", subscription.id);
	}
}
