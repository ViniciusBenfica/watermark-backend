import { PrismaClient, type User as PrismaUser } from "@prisma/client";
import type User from "../../../domain/user/entity/user.entity";
import UserFactory from "../../../domain/user/factory/user.factory";
import type UserRepositoryInterface from "../../../domain/user/repositories/user.repository";

export default class UserRepository implements UserRepositoryInterface {
	prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async create(entity: User): Promise<void> {
		await this.prisma.user.create({
			data: {
				userId: entity.id,
				name: entity.name,
				email: entity.email,
				password: entity.password,
			},
		});
	}

	async find(entity: Partial<User>): Promise<User> {
		let user: PrismaUser;

		try {
			user = await this.prisma.user.findFirstOrThrow({
				where: {
					OR: [{ userId: entity.id }, { email: entity.email }],
				},
			});
		} catch (error) {
			throw new Error("User not found");
		}

		return UserFactory.create(user.name, user.email, user.password);
	}
}
