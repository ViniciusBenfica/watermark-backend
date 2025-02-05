import type { NextFunction, Request, Response } from "express";
import UserAuthToken from "../../../infrastructure/user/auth/token.usecase";

export const jwtMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const authTokenService = new UserAuthToken();

	const files = req.files as { [fieldname: string]: Express.Multer.File[] };
	const images = files?.images;

	if(images?.length == 1) {
		next();
		return;
	}

	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];

	if (!token) {
		res.status(401).json({ message: "Token not provided" });
		return;
	}

	try {
		const decoded = authTokenService.verifyToken(token);
		req.body.user = decoded;
		next();
	} catch (err) {
		res.status(403).json({ message: "Invalid or expired token" });
		return;
	}
};
