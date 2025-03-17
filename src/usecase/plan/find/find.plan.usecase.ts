import type PlanRepositoryInterface from "../../../domain/plan/repositories/plan.repository";
import type { InputFindPlanDto, OutputFindPlanDto } from "./find.plan.dto";

export default class FindPlanUseCase {
	constructor(private planRepository: PlanRepositoryInterface) {}

	async execute(input: InputFindPlanDto): Promise<OutputFindPlanDto> {
		const plan = await this.planRepository.find(input.id);

		if (!plan) {
			throw new Error("Plan not found");
		}

		return {
			id: plan.id,
			name: plan.name,
			description: plan.description,
			price: plan.price,
			duration: plan.duration,
		};
	}
}
