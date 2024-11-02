import PlanRepository from "../../../infrastructure/plan/repositories/plan.repository";
import FindPlanUseCase from "./find.plan.usecase";

export default class FindPlanUsecaseFactory {
	static create() {
		return new FindPlanUseCase(new PlanRepository());
	}
}
