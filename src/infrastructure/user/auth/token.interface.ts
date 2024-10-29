export default interface AuthTokenInterface<T> {
	createToken(data: any): string;
	verifyToken(token: string): T;
}
