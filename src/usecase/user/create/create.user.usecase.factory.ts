import UserRepository from "../../../infrastructure/user/repositories/user.repository";
import CreateUserUseCase from "./create.user.usecase";

export default class CreateUserUsecaseFactory {
	static create() {
		return new CreateUserUseCase(new UserRepository());
	}
}
