import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../../../app/env";
import type AuthTokenInterface from "./token.interface";

export default class UserAuthToken implements AuthTokenInterface<JwtPayload> {
	createToken(text: string): string {
		return jwt.sign({ data: text }, env.JWT_TOKEN, {
			expiresIn: env.TOKEN_EXPIRE_TIME,
		});
	}

	verifyToken(token: string): JwtPayload {
		return jwt.verify(token, env.JWT_TOKEN) as JwtPayload;
	}
}
