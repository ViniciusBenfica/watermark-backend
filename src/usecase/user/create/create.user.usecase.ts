import type { JwtPayload } from "jsonwebtoken";
import UserFactory from "../../../domain/user/factory/user.factory";
import type UserRepositoryInterface from "../../../domain/user/repositories/user.repository";
import type AuthTokenInterface from "../../../infrastructure/user/auth/token.interface";
import type FindUserUseCase from "../find/find.user.usecase";
import type { InputCreateUserDto, OutputCreateUserDto } from "./create.user.dto";

export default class CreateUserUseCase {
	constructor(
		private userRepository: UserRepositoryInterface,
		private findUserUseCase: FindUserUseCase,
		private authTokenUser: AuthTokenInterface<JwtPayload>,
	) {}

	async execute(input: InputCreateUserDto): Promise<OutputCreateUserDto> {
		if (await this.findUserUseCase.execute({ email: input.email })) {
			throw new Error("User already exists");
		}

		const user = UserFactory.create(input.name, input.email, input.password);

		user.encryptPassword(input.password);
		await this.userRepository.create(user);

		const token = this.authTokenUser.createToken({ username: user.name, userId: user.id });

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			token: token,
		};
	}
}
