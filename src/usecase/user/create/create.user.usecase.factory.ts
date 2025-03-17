import CreateCustomer from "@/infrastructure/user/createCustomer/createCustomer.service";
import UserAuthToken from "../../../infrastructure/user/auth/token.usecase";
import UserRepository from "../../../infrastructure/user/repositories/user.repository";
import FindUserUsecaseFactory from "../find/find.user.usecase.factory";
import CreateUserUseCase from "./create.user.usecase";

export default class CreateUserUsecaseFactory {
	static create() {
		const findUserUseCase = FindUserUsecaseFactory.create();
		return new CreateUserUseCase(new UserRepository(), findUserUseCase, new UserAuthToken(), new CreateCustomer());
	}
}
