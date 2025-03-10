import { v4 as uuid } from "uuid";
import Payment from "../entity/payment.entity";

export default class PaymentFactory {
	static create(userId: string, planId: string, buyDate: Date, status: string, price: number, id?: string): Payment {
		return new Payment(id || uuid(), userId, planId, buyDate, status, price);
	}
}
