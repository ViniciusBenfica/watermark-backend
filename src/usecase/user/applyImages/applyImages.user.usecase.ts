import path from "node:path";
import sharp from "sharp";
import type FindUserUseCase from "../find/find.user.usecase";
import type { InputApplyImagesDto } from "./applyImages.user.dto";

export default class UserApplyImagesProductUseCase {
	constructor(private findUser: FindUserUseCase) {}

	async execute(input: InputApplyImagesDto): Promise<boolean> {
		if (input.images.length > 1) {
			const user = await this.findUser.execute({ id: input?.userId });

			if (!user?.planId) {
				return false;
			}
		}

		for (const image of input.images) {
			const outputImagePath = path.join(input.outputFolder, path.basename(image.path));

			const imageMetadata = await sharp(image.path).metadata();
			const { width: imageWidth, height: imageHeight } = imageMetadata;

			const watermarkWidth = Math.floor(imageWidth! / 5);
			const watermarkHeight = Math.floor(imageHeight! / 5);

			const resizedWatermark = await sharp(input.watermarkPath)
				.resize(watermarkWidth, watermarkHeight, { fit: "inside" })
				.toFormat("png")
				.composite([
					{
						input: Buffer.from([0, 0, 0, 128]),
						raw: {
							width: 1,
							height: 1,
							channels: 4,
						},
						tile: true,
						blend: "dest-in",
					},
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
				{ left: imageWidth! - watermarkWidth, top: imageHeight! - watermarkHeight },
			];

			const compositeArray = positions.map((pos) => ({
				input: resizedWatermark,
				left: Math.floor(pos.left),
				top: Math.floor(pos.top),
			}));

			await sharp(image.path).composite(compositeArray).toFile(outputImagePath);
		}

		return true;
	}
}
