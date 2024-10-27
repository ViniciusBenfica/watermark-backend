import { type Request, type Response, Router } from "express";
import CreateUserUsecaseFactory from "../../../usecase/user/create/create.user.usecase.factory";
import FindUserUsecaseFactory from "../../../usecase/user/find/find.user.usecase.factory";
import LoginUserUsecaseFactory from "../../../usecase/user/login/login.user.usecase.factory";
import { jwtMiddleware } from "./jwt.middleware";

class UserRoute {
	router: Router;

	constructor() {
		this.router = Router();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post("/createUser", this.createUser);
		this.router.post("/loginUser", this.loginUser);
		this.router.get("/findUser/:id", this.findUser);
	}

	async createUser(req: Request, res: Response) {
		const useCase = CreateUserUsecaseFactory.create();
		const { name, password, email } = req.body;
		const userDto = {
			name,
			password,
			email,
		};
		try {
			const output = await useCase.execute(userDto);
			res.send(output);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).send({ message: error.message });
			}
		}
	}

	async loginUser(req: Request, res: Response) {
		const userUseCase = LoginUserUsecaseFactory.create();
		const { password, email } = req.body;
		const userDto = {
			password,
			email,
		};
		try {
			const output = await userUseCase.execute(userDto);
			res.send(output);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).send({ message: error.message });
			}
		}
	}

	async findUser(req: Request, res: Response) {
		const useCase = FindUserUsecaseFactory.create();
		const query = req.query as { email?: string; id?: string };
		try {
			const output = await useCase.execute(query);
			res.send(output);
		} catch (error) {
			if (error instanceof Error) {
				res.status(404).send({ message: error.message });
			}
		}
	}


}

export default new UserRoute().router;
