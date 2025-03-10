import CreatePaymentUsecaseFactory from "@/usecase/payment/create/create.payment.usecase.factory";
import FindPaymentsByUserIdUsecaseFactory from "@/usecase/payment/findPaymentsByUserId/findPaymentsByUserId.payment.usecase.factory";
import { type Request, type Response, Router } from "express";

class PaymentRoute {
	router: Router;

	constructor() {
		this.router = Router();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post("/webhooks/stripe", this.handleStripeWebhook);
		this.router.get("/findPaymentsByUserId/:id", this.findPaymentsByUserId);
	}

	private async handleStripeWebhook(req: Request, res: Response) {
		try {
			const sig = req.headers["stripe-signature"] as string;

			const useCase = CreatePaymentUsecaseFactory.create();
			const input = {
				sig,
				rawBody: req.body,
			};

			await useCase.execute(input);
		} catch (error) {
			if (error instanceof Error) {
				res.status(404).send({ message: error.message });
			}
		}
	}

	async findPaymentsByUserId(req: Request, res: Response) {
		const useCase = FindPaymentsByUserIdUsecaseFactory.create();

		try {
			const output = await useCase.execute(req.params.id);
			res.send(output);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).send({ message: error.message });
			}
		}
	}
}

export default new PaymentRoute().router;
