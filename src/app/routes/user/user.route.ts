import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { type Request, type Response, Router } from "express";
import multer from "multer";
import UserBuyProductUseCase from "../../../usecase/user/buy/buy.user.usecase";
import BuyUserUsecaseFactory from "../../../usecase/user/buy/buy.user.usecase.factory";
import CreateUserUsecaseFactory from "../../../usecase/user/create/create.user.usecase.factory";
import FindUserUsecaseFactory from "../../../usecase/user/find/find.user.usecase.factory";
import LoginUserUsecaseFactory from "../../../usecase/user/login/login.user.usecase.factory";
import { jwtMiddleware } from "./jwt.middleware";
import archiver from "archiver";
class UserRoute {
	router: Router;
	multer = multer({
		storage: multer.diskStorage({
			destination: (req, file, cb) => {
				const uploadPath = path.resolve(__dirname, "../../../../uploads/input");
				if (!fs.existsSync(uploadPath)) {
					fs.mkdirSync(uploadPath, { recursive: true });
				}
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
		this.router.post("/buyProduct", this.buyPlan);
		this.router.post(
			"/applyWatermark",
			this.multer.fields([
				{ name: "images", maxCount: 10 },
				{ name: "watermark", maxCount: 1 },
			]),
			this.applyWatermark.bind(this),
		);
	}

	async applyWatermark(req: Request, res: Response) {
		try {
			const files = req.files as { [key: string]: Express.Multer.File[] };
			const watermark = files.watermark;
			const images = files.images;
	
			if (!watermark || !images) {
				res.status(400).send({ message: "Files not uploaded correctly" });
				return;
			}
	
			const watermarkFolder = path.resolve(__dirname, "../../../../uploads/watermark");
			const inputFolder = path.resolve(__dirname, "../../../../uploads/input");
			const outputFolder = path.resolve(__dirname, "../../../../uploads/output");
	
			[watermarkFolder, inputFolder, outputFolder].forEach((folder) => {
				if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
			});
	
			const watermarkPath = path.join(watermarkFolder, watermark[0].filename);
			fs.renameSync(watermark[0].path, watermarkPath);
	
			images.forEach((file) => {
				const destPath = path.join(inputFolder, file.filename);
				fs.renameSync(file.path, destPath);
			});
	
			const rustExecutable = path.resolve(
				__dirname,
				"../../../../../watermark-service/target/release/watermark-service"
			);
	
			execFile(
				rustExecutable,
				[watermarkFolder, inputFolder, outputFolder],
				(error, stdout, stderr) => {
					if (error) {
						this.cleanupFiles([], [watermarkFolder, inputFolder, outputFolder]);
						res.status(500).send({ message: `Error processing images: ${stderr}` });
					}
	
					fs.readdir(outputFolder, (err, files) => {
						if (err || files.length === 0) {
							this.cleanupFiles([], [watermarkFolder, inputFolder, outputFolder]);
							res.status(500).send({ message: "No processed images found" });
						}

						res.setHeader("Content-Type", "application/zip");
						res.setHeader("Content-Disposition", "attachment; filename=processed_images.zip");

						const archive = archiver("zip", { zlib: { level: 9 } });

						archive.on("close", () => {
							this.cleanupFiles([], [watermarkFolder, inputFolder, outputFolder]);
						});

						archive.pipe(res);
						archive.directory(outputFolder, false);
						archive.finalize();
					});
				}
			);
		} catch (error) {
			res.status(500).send({ message: "Internal error" });
		}
	}

	private cleanupFiles(files: string[], folders: string[]) {
		files.forEach((file) => {
			if (fs.existsSync(file)) fs.unlinkSync(file);
		});
		folders.forEach((folder) => {
			if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true, force: true });
		});
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
}

export default new UserRoute().router;
