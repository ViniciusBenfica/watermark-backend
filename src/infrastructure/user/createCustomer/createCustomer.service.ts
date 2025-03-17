import Stripe from "stripe";
import { env } from "../../../app/env";
import type CreateCustomerInterface from "./createCustomer.interface";
import type { InputCreateCustomerDto, OutputCreateCustomerDto } from "./createCustomer.interface";

export default class CreateCustomer implements CreateCustomerInterface {
	private stripe: Stripe;

	constructor() {
		this.stripe = new Stripe(env.STRIPE_SECRET_KEY);
	}

	async createCustomer(user: InputCreateCustomerDto): Promise<OutputCreateCustomerDto> {
		try {
			const customer = await this.stripe.customers.create({
				email: user.email,
				name: user.name,
			});

			return { customerId: customer.id };
		} catch (error) {
			throw new Error("Error when creating the customer");
		}
	}
}
