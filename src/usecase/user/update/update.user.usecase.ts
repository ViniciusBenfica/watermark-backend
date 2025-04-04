import type AuthTokenInterface from "@/infrastructure/user/auth/token.interface";
import type { JwtPayload } from "jsonwebtoken";
import UserFactory from "../../../domain/user/factory/user.factory";
import type UserRepositoryInterface from "../../../domain/user/repositories/user.repository";
import type CreateCustomerInterface from "../../../infrastructure/user/createCustomer/createCustomer.interface";
import type FindUserUseCase from "../find/find.user.usecase";
import type { InputUpdateUserDto, OutputUpdateUserDto } from "./update.user.dto";

export default class UpdateUserUseCase {
	constructor(
		private userRepository: UserRepositoryInterface,
		private findUserUseCase: FindUserUseCase,
		private authTokenUser: AuthTokenInterface<JwtPayload>,
	) {}

	async execute(input: InputUpdateUserDto): Promise<OutputUpdateUserDto> {
		const user = await this.findUserUseCase.execute({ id: input.userId });

		if (!user) {
			throw new Error("User not found");
		}

		const newUser = UserFactory.create(user.name, user.email, input.password, null, user.id);

		newUser.encryptPassword(input.password);
		await this.userRepository.update(newUser);

		const token = this.authTokenUser.createToken({ username: user.name, userId: user.id });

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			token: token,
		};
	}
}
