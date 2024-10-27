import UserFactory from "../../../domain/user/factory/user.factory";
import type UserRepositoryInterface from "../../../domain/user/repositories/user.repository";
import type UseCaseInterface from "../../../shared/usecase.interface";
import type { InputCreateUserDto, OutputCreateUserDto } from "./create.user.dto";

export default class CreateUserUseCase implements UseCaseInterface<InputCreateUserDto, OutputCreateUserDto> {
	constructor(private userRepository: UserRepositoryInterface) {}

	async execute(input: InputCreateUserDto) {
		const user = UserFactory.create(input.name, input.email, input.password);

		user.encryptPassword(input.password);
		await this.userRepository.create(user);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
		};
	}
}
