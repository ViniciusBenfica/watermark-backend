import UserPlanRepository from "@/infrastructure/userPlan/repositories/userPlan.repository";
import CreateUserPlanUseCase from "./create.userPlan.usecase";

export default class CreateUserPlanUsecaseFactory {
	static create() {
		return new CreateUserPlanUseCase(new UserPlanRepository());
	}
}
