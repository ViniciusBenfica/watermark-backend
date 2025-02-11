import type UserRepositoryInterface from "../../../domain/user/repositories/user.repository";
import type { InputFindUserDto, OutputFindUserDto } from "./find.user.dto";

export default class FindUserUseCase {
	constructor(private userRepository: UserRepositoryInterface) {}

	async execute(input: InputFindUserDto): Promise<OutputFindUserDto | null> {
		const user = await this.userRepository.find(input);

		if (!user) {
			return null;
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			planId: user.planId,
		};
	}
}
