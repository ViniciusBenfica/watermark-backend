import type { JwtPayload } from "jsonwebtoken";
import UserOwnerCrypter from "../../../domain/user/crypter/user.crypter";
import type UserRepositoryInterface from "../../../domain/user/repositories/user.repository";
import type AuthTokenInterface from "../../../infrastructure/user/auth/token.interface";
import type UseCaseInterface from "../../../shared/usecase.interface";
import type { InputLoginUserDto, OutputLoginUserDto } from "./login.user.dto";

export default class LoginUserUseCase
	implements UseCaseInterface<InputLoginUserDto, OutputLoginUserDto>
{
	constructor(
		private userRepository: UserRepositoryInterface,
		private authTokenUser: AuthTokenInterface<JwtPayload>,
	) {}

	async execute(input: InputLoginUserDto): Promise<OutputLoginUserDto> {
		const user = await this.userRepository.find(input);

		if (!user) {
			throw new Error("User not found");
		}

		if (!new UserOwnerCrypter().compare(input.password, user.password)) {
			throw new Error("Wrong password");
		}

		const token = this.authTokenUser.createToken(user.name);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			token: token,
		};
	}
}
