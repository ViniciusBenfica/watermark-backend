import ProcessPayment from "../../../infrastructure/user/processPayment/processPayment.service";
import FindPlanUsecaseFactory from "../../plan/find/find.plan.usecase.factory";
import FindUserUsecaseFactory from "../find/find.user.usecase.factory";
import UserBuyProductUseCase from "./buy.user.usecase";

export default class BuyUserUsecaseFactory {
	static create() {
		const findUser = FindUserUsecaseFactory.create();
		const findPlan = FindPlanUsecaseFactory.create();
		const processPayment = new ProcessPayment();

		return new UserBuyProductUseCase(findUser, findPlan, processPayment);
	}
}
