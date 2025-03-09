export default interface AuthTokenInterface<T> {
	createToken(data: string): string;
	verifyToken(token: string): T;
}
