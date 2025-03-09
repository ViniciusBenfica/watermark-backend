import { PrismaClient, type User as PrismaUser } from "@prisma/client";
import type User from "../../../domain/user/entity/user.entity";
import UserFactory from "../../../domain/user/factory/user.factory";
import type UserRepositoryInterface from "../../../domain/user/repositories/user.repository";

export default class UserRepository implements UserRepositoryInterface {
	prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async create(entity: User) {
		await this.prisma.user.create({
			data: {
				id: entity.id,
				name: entity.name,
				email: entity.email,
				password: entity.password,
			},
		});
	}

	async find(entity: Partial<User>): Promise<User | null> {
		const user = await this.prisma.user.findFirst({
			where: {
				OR: [{ id: entity.id }, { email: entity.email }],
			},
			include: {
				subscription: true,
			},
		});

		if (!user) {
			return null;
		}

		const userEntity = UserFactory.create(user.name, user.email, user.password, user.subscription[0]?.planId, user.id);

		return userEntity;
	}
}
