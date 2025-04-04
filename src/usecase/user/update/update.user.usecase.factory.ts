import CreateCustomer from "@/infrastructure/user/createCustomer/createCustomer.service";
import UserAuthToken from "../../../infrastructure/user/auth/token.usecase";
import UserRepository from "../../../infrastructure/user/repositories/user.repository";
import FindUserUsecaseFactory from "../find/find.user.usecase.factory";
import UpdateUserUseCase from "./update.user.usecase";

export default class UpdateUserUsecaseFactory {
	static create() {
		const findUserUseCase = FindUserUsecaseFactory.create();
		return new UpdateUserUseCase(new UserRepository(), findUserUseCase, new UserAuthToken());
	}
}
