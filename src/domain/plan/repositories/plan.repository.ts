import type Plan from "../entity/plan.entity";

export default interface PlanRepositoryInterface {
	find(id: string): Promise<Plan>;
}
