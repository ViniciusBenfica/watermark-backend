import FindPlanUsecaseFactory from "@/usecase/plan/find/find.plan.usecase.factory";
import { type Request, type Response, Router } from "express";
import FindAllPlanUsecaseFactory from "../../../usecase/plan/findAll/findAll.plan.usecase.factory";

class PlanRoute {
	router: Router;

	constructor() {
		this.router = Router();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get("/findAllPlan", this.findAllPlan);
		this.router.get("/findPlanById/:id", this.findPlanById);
	}

	async findAllPlan(req: Request, res: Response) {
		const useCase = FindAllPlanUsecaseFactory.create();

		try {
			const output = await useCase.execute();
			res.send(output);
		} catch (error) {
			if (error instanceof Error) {
				res.status(404).send({ message: error.message });
			}
		}
	}

	async findPlanById(req: Request, res: Response) {
		const useCase = FindPlanUsecaseFactory.create();

		try {
			const output = await useCase.execute({ id: req.params.id });
			res.send(output);
		} catch (error) {
			if (error instanceof Error) {
				res.status(404).send({ message: error.message });
			}
		}
	}
}

export default new PlanRoute().router;
