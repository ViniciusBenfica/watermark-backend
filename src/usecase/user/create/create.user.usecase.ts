import type { JwtPayload } from "jsonwebtoken";
import UserFactory from "../../../domain/user/factory/user.factory";
import type UserRepositoryInterface from "../../../domain/user/repositories/user.repository";
import type AuthTokenInterface from "../../../infrastructure/user/auth/token.interface";
import type CreateCustomerInterface from "../../../infrastructure/user/createCustomer/createCustomer.interface";
import type FindUserUseCase from "../find/find.user.usecase";
import type { InputCreateUserDto, OutputCreateUserDto } from "./create.user.dto";

export default class CreateUserUseCase {
	constructor(
		private userRepository: UserRepositoryInterface,
		private findUserUseCase: FindUserUseCase,
		private authTokenUser: AuthTokenInterface<JwtPayload>,
		private createCustomer: CreateCustomerInterface,
	) {}

	async execute(input: InputCreateUserDto): Promise<OutputCreateUserDto> {
		if (await this.findUserUseCase.execute({ email: input.email })) {
			throw new Error("User already exists");
		}

		const customer = await this.createCustomer.createCustomer(input);

		const user = UserFactory.create(input.name, input.email, input.password, null, customer.customerId);

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
