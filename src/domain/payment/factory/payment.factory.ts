import { v4 as uuid } from "uuid";
import Payment from "../entity/payment.entity";

export default class PaymentFactory {
	static create(userId: string, planId: string, buyDate: Date, expirationDate: Date, id?: string): Payment {
		return new Payment(id || uuid(), userId, planId, buyDate, expirationDate);
	}
}
