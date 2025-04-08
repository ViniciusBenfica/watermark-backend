import type Plan from "@/domain/plan/entity/plan.entity";
import type PlanRepositoryInterface from "../../../domain/plan/repositories/plan.repository";
import type { OutputFindAllPlanDto } from "./findAll.plan.dto";

export default class FindAllPlanUseCase {
	constructor(private planRepository: PlanRepositoryInterface) {}

	async execute(): Promise<OutputFindAllPlanDto[]> {
		const plan = await this.planRepository.findAll();

		return plan.map((plan: Plan) => {
			return {
				id: plan.id,
				name: plan.name,
				description: plan.description,
				price: plan.price,
				duration: plan.duration,
			};
		});
	}
}
