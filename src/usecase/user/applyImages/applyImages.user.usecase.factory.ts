import FindUserUsecaseFactory from "../find/find.user.usecase.factory";
import UserBuyProductUseCase from "./applyImages.user.usecase";

export default class ApplyImagesUserUsecaseFactory {
	static create() {
		const findUser = FindUserUsecaseFactory.create();

		return new UserBuyProductUseCase(findUser);
	}
}
