import UserPlanFactory from "@/domain/userPlan/factory/userPlan.factory";
import type UserPlanRepositoryInterface from "@/domain/userPlan/repositories/userPlan.repository.interface";
import type { InputCreateUserPlanDto, OutputCreateUserPlanDto } from "./create.userPlan.dto";

export default class CreateUserPlanUseCase {
	constructor(private userPlanRepository: UserPlanRepositoryInterface) {}

	async execute(input: InputCreateUserPlanDto): Promise<OutputCreateUserPlanDto> {
		const userPlan = UserPlanFactory.create(input.userId, input.planId, input.buyDate, input.expirationDate);
		await this.userPlanRepository.create(userPlan);

		return {
			id: userPlan.id,
			userId: userPlan.userId,
			planId: userPlan.planId,
			buyDate: userPlan.buyDate,
			expirationDate: userPlan.expirationDate,
		};
	}
}
