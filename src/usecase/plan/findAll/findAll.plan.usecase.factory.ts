import PlanRepository from "../../../infrastructure/plan/repositories/plan.repository";
import FindAllPlanUseCase from "./findAll.plan.usecase";

export default class FindAllPlanUsecaseFactory {
	static create() {
		return new FindAllPlanUseCase(new PlanRepository());
	}
}
