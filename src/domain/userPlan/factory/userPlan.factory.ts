import { v4 as uuid } from "uuid";
import UserPlan from "../entity/userPlan.entity";

export default class UserPlanFactory {
	static create(userId: string, planId: string, buyDate: Date, expirationDate: Date, id?: string): UserPlan {
		return new UserPlan(id || uuid(), userId, planId, buyDate, expirationDate);
	}
}
