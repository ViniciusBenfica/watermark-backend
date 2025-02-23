import type UserPlan from "@/domain/userPlan/entity/userPlan.entity";
import type UserPlanRepositoryInterface from "@/domain/userPlan/repositories/userPlan.repository.interface";
import { PrismaClient } from "@prisma/client";

export default class UserPlanRepository implements UserPlanRepositoryInterface {
	prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async create(entity: UserPlan): Promise<void> {
		await this.prisma.userPlan.create({
			data: {
				id: entity.id,
				buyDate: entity.buyDate,
				expirationDate: entity.expirationDate,
				planId: entity.planId,
				userId: entity.userId,
			},
		});
	}
}
