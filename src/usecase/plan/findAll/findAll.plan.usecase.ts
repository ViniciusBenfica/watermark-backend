import type PlanRepositoryInterface from "../../../domain/plan/repositories/plan.repository";
import type UseCaseInterface from "../../../shared/usecase.interface";
import type { OutputFindAllPlanDto } from "./findAll.plan.dto";

export default class FindAllPlanUseCase implements UseCaseInterface<void, OutputFindAllPlanDto[]> {
	constructor(private planRepository: PlanRepositoryInterface) {}

	async execute() {
		const plan = await this.planRepository.findAll();

		return plan.map((plan) => {
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
