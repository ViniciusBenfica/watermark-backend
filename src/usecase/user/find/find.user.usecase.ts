import type UserRepositoryInterface from "../../../domain/user/repositories/user.repository";
import type UseCaseInterface from "../../../shared/usecase.interface";
import type { InputFindUserDto, OutputFindUserDto } from "./find.user.dto";

export default class FindUserUseCase
	implements UseCaseInterface<InputFindUserDto, OutputFindUserDto>
{
	constructor(private userRepository: UserRepositoryInterface) {}

	async execute(input: InputFindUserDto): Promise<OutputFindUserDto> {
		const user = await this.userRepository.find(input);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
		};
	}
}
