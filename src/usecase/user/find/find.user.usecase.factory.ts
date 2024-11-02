import UserRepository from "../../../infrastructure/user/repositories/user.repository";
import FindUserUseCase from "./find.user.usecase";

export default class FindUserUsecaseFactory {
	static create() {
		return new FindUserUseCase(new UserRepository());
	}
}
