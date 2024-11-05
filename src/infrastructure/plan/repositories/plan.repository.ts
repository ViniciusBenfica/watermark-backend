import { PrismaClient } from "@prisma/client";
import PlanFactory from "../../../domain/plan/factory/plan.factory";
import type PlanRepositoryInterface from "../../../domain/plan/repositories/plan.repository";

export default class PlanRepository implements PlanRepositoryInterface {
	prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async find(id: string) {
		const plan = await this.prisma.plan.findFirst({
			where: {
				id,
			},
		});

		if (!plan) {
			return null;
		}

		return PlanFactory.create(plan.name, plan.description, plan.price, plan.duration, plan.id);
	}

	async findAll() {
		const plan = await this.prisma.plan.findMany();
		
		return plan.map((plan) => PlanFactory.create(plan.name, plan.description, plan.price, plan.duration, plan.id));
	}
}
