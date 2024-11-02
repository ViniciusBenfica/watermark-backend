import type PlanRepositoryInterface from "../../../domain/plan/repositories/plan.repository";
import type UseCaseInterface from "../../../shared/usecase.interface";
import type { InputFindPlanDto, OutputFindPlanDto } from "./find.plan.dto";

export default class FindPlanUseCase implements UseCaseInterface<InputFindPlanDto, OutputFindPlanDto> {
	constructor(private planRepository: PlanRepositoryInterface) {}

	async execute(input: InputFindPlanDto) {
		const plan = await this.planRepository.find(input.id);

		if (!plan) {
			throw new Error("Plano não encontrado");
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
