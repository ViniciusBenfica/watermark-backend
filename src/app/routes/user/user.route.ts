import fs from "node:fs";
import path from "node:path";
import ManageSubscription from "@/infrastructure/subscription/manageSubscription/manageSubscription.service";
import ApplyImagesUserUsecaseFactory from "@/usecase/user/applyImages/applyImages.user.usecase.factory";
import archiver from "archiver";
import { type Request, type Response, Router } from "express";
import multer from "multer";
import BuyUserUsecaseFactory from "../../../usecase/user/buy/buy.user.usecase.factory";
import CreateUserUsecaseFactory from "../../../usecase/user/create/create.user.usecase.factory";
import FindUserUsecaseFactory from "../../../usecase/user/find/find.user.usecase.factory";
import LoginUserUsecaseFactory from "../../../usecase/user/login/login.user.usecase.factory";
import { jwtMiddleware } from "./jwt.middleware";

class UserRoute {
	router: Router;
	multer = multer({
		storage: multer.diskStorage({
			destination: (req, file, cb) => {
				const uploadPath = path.resolve(__dirname, "../../../../uploads/input");
				fs.mkdirSync(uploadPath, { recursive: true });
				cb(null, uploadPath);
			},
			filename: (req, file, cb) => {
				cb(null, `${Date.now()}-${file.originalname}`);
			},
		}),
	});

	constructor() {
		this.router = Router();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post("/createUser", this.createUser);
		this.router.post("/loginUser", this.loginUser);
		this.router.get("/findUser/:id", this.findUser);
		this.router.get("/stripeManager/:userId", this.stripeManager);
		this.router.post("/buyProduct", this.buyPlan);
		this.router.post(
			"/applyWatermark",
			this.multer.fields([
				{ name: "images", maxCount: 10 },
				{ name: "watermark", maxCount: 1 },
			]),
			jwtMiddleware,
			this.applyWatermark.bind(this),
		);
	}

	async applyWatermark(req: Request, res: Response) {
		const outputFolder = path.resolve(__dirname, "../../../../uploads/output");
		const inputFolder = path.resolve(__dirname, "../../../../uploads/input");

		try {
			const files = req?.files as { [key: string]: Express.Multer.File[] };
			const watermark = files?.watermark?.[0];
			const images = files?.images;

			if (!watermark || !images?.length) {
				res.status(400).send({ message: "Files not uploaded correctly" });
				return;
			}

			fs.mkdirSync(outputFolder, { recursive: true });

			const useCase = ApplyImagesUserUsecaseFactory.create();

			const userDto = {
				watermarkPath: watermark?.path,
				images,
				outputFolder,
				userId: req?.body?.user?.data?.userId,
			};

			await useCase.execute(userDto);

			await this.createZipStream(outputFolder, res);

			this.cleanupFiles([outputFolder, inputFolder]);
		} catch (error) {
			this.cleanupFiles([outputFolder, inputFolder]);
			if (error instanceof Error) {
				res.status(500).send({ message: error.message });
			} else {
				res.status(500).send({ message: "Internal server error" });
			}
		}
	}

	private async createZipStream(outputFolder: string, res: Response) {
		res.setHeader("Content-Type", "application/zip");
		res.setHeader("Content-Disposition", "attachment; filename=processed_images.zip");

		const archive = archiver("zip", { zlib: { level: 9 } });
		archive.pipe(res);

		const files = fs.readdirSync(outputFolder);

		for (const file of files) {
			const filePath = path.join(outputFolder, file);
			if (fs.statSync(filePath).isFile()) {
				archive.file(filePath, { name: file });
			}
		}

		await archive.finalize();
	}

	private cleanupFiles(folders: string[]) {
		for (const folder of folders) {
			if (fs.existsSync(folder)) {
				fs.rmSync(folder, { recursive: true, force: true });
			}
		}
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
		const param = req.params as { id: string };

		try {
			const output = await useCase.execute(param);
			res.send(output);
		} catch (error) {
			if (error instanceof Error) {
				res.status(404).send({ message: error.message });
			}
		}
	}

	async buyPlan(req: Request, res: Response) {
		const useCase = BuyUserUsecaseFactory.create();
		const { userId, planId } = req.body;
		const userDto = { userId, planId };
		try {
			const output = await useCase.execute(userDto);
			res.send(output);
		} catch (error) {
			if (error instanceof Error) {
				res.status(404).send({ message: error.message });
			}
		}
	}
	async stripeManager(req: Request, res: Response) {
		const { userId } = req.params;

		try {
			const useCase = new ManageSubscription();
			const session = await useCase.manageSubscriptionStripe({ userId });
			res.send(session);
		} catch (error) {
			if (error instanceof Error) {
				res.status(404).send({ message: error.message });
			}
		}
	}
}

export default new UserRoute().router;
