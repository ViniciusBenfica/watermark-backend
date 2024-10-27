import type UserRepositoryInterface from "../../../domain/user/repositories/user.repository";
import type UseCaseInterface from "../../../shared/usecase.interface";
import type { InputFindUserDto, OutputFindUserDto } from "./find.user.dto";

export default class FindUserUseCase implements UseCaseInterface<InputFindUserDto, OutputFindUserDto> {
	constructor(private userRepository: UserRepositoryInterface) {}

	async execute(input: InputFindUserDto) {
		const user = await this.userRepository.find(input);

		if (!user) {
			throw new Error("Usuário não encontrado");
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
		};
	}
}
