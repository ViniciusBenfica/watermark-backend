export interface InputApplyImagesDto {
	images: Express.Multer.File[],
	watermarkPath: string,
	outputFolder: string,
	userId: string,
}