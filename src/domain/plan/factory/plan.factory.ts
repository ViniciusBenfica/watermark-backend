import { v4 as uuid } from "uuid";
import type Plan from "../entity/plan.entity";
import Payment from "../entity/plan.entity";

export default class PlanFactory {
	static create(name: string, description: string, price: number, duration: number, id?: string): Plan {
		return new Payment(id || uuid(), name, description, price, duration);
	}
}
