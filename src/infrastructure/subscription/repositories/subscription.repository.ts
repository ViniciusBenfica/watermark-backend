import type Subscription from "@/domain/subscription/entity/subscription.entity";
import SubscriptionFactory from "@/domain/subscription/factory/subscription.factory";
import type SubscriptionRepositoryInterface from "@/domain/subscription/repositories/subscription.repository.interface";
import { PrismaClient, type Subscription as PrismaSubscription } from "@prisma/client";

export default class SubscriptionRepository implements SubscriptionRepositoryInterface {
	prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async create(entity: Subscription): Promise<void> {
		await this.prisma.subscription.create({
			data: {
				id: entity.id,
				buyDate: entity.buyDate,
				expirationDate: entity.expirationDate,
				planId: entity.planId,
				userId: entity.userId,
			},
		});
	}

	async findAll(): Promise<Subscription[]> {
		const subscriptions = await this.prisma.subscription.findMany();

		return subscriptions.map((subscription: PrismaSubscription) => {
			return SubscriptionFactory.create(
				subscription.userId,
				subscription.planId,
				subscription.buyDate,
				subscription.expirationDate,
				subscription.id,
			);
		});
	}
}
