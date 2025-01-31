import { execFile } from "child_process";
import fs from "fs";
import sharp from "sharp";
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
			const watermark = files.watermark?.[0];
			const images = files.images;

			if (!watermark || !images?.length) {
				res.status(400).send({ message: "Files not uploaded correctly" });
				return;
			}

			const outputFolder = path.resolve(__dirname, "../../../../uploads/output");
			const inputFolder = path.resolve(__dirname, "../../../../uploads/input");

			fs.mkdirSync(outputFolder, { recursive: true });

			await this.processImages(images, watermark.path, outputFolder);

			await this.createZipStream(outputFolder, res);
			
			this.cleanupFiles([outputFolder, inputFolder]);

		} catch (error) {
			res.status(500).send({ message: "Internal server error" });
		}
	}

	private async processImages(
		images: Express.Multer.File[],
		watermarkPath: string,
		outputFolder: string
	) {
		for (const image of images) {
			const outputImagePath = path.join(outputFolder, path.basename(image.path));

		const imageMetadata = await sharp(image.path).metadata();
		const { width: imageWidth, height: imageHeight } = imageMetadata;

		const watermarkWidth = Math.floor(imageWidth! / 5);
		const watermarkHeight = Math.floor(imageHeight! / 5);

		const resizedWatermark = await sharp(watermarkPath)
			.resize(watermarkWidth, watermarkHeight, { fit: 'inside' })
			.toFormat('png')
			.composite([
				{
					input: Buffer.from([0,0,0,128]),
					raw: {
						width: 1,
						height: 1,
						channels: 4,
					},
					tile: true,
					blend: 'dest-in',
				}
			])
			.toBuffer();

		const positions = [
			{ left: 0, top: 0 },
			{ left: imageWidth! / 2 - watermarkWidth / 2, top: 0 },
			{ left: imageWidth! - watermarkWidth, top: 0 },

			{ left: 0, top: imageHeight! / 2 - watermarkHeight / 2 },
			{ left: imageWidth! / 2 - watermarkWidth / 2, top: imageHeight! / 2 - watermarkHeight / 2 },
			{ left: imageWidth! - watermarkWidth, top: imageHeight! / 2 - watermarkHeight / 2 },

			{ left: 0, top: imageHeight! - watermarkHeight },
			{ left: imageWidth! / 2 - watermarkWidth / 2, top: imageHeight! - watermarkHeight },
			{ left: imageWidth! - watermarkWidth, top: imageHeight! - watermarkHeight }
		];

		const compositeArray = positions.map(pos => ({
			input: resizedWatermark,
			left: Math.floor(pos.left),
			top: Math.floor(pos.top),
		}));

		await sharp(image.path)
			.composite(compositeArray)
			.toFile(outputImagePath);
		}
	}

	private async createZipStream(outputFolder: string, res: Response) {
		res.setHeader("Content-Type", "application/zip");
		res.setHeader("Content-Disposition", "attachment; filename=processed_images.zip");

		const archive = archiver("zip", { zlib: { level: 9 } });
		archive.pipe(res);

		fs.readdirSync(outputFolder).forEach((file) => {
			const filePath = path.join(outputFolder, file);
			if (fs.statSync(filePath).isFile()) {
				archive.file(filePath, { name: file });
			}
		});

		await archive.finalize();
	}

	private cleanupFiles(folders: string[]) {
		folders.forEach((folder) => fs.existsSync(folder) && fs.rmSync(folder, { recursive: true, force: true }));
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
