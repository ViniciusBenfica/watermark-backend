export default interface AuthTokenInterface<T> {
	createToken(data: T): string;
	verifyToken(token: string): T;
}
