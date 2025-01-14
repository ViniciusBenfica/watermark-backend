export interface InputCreateUserDto {
	name: string;
	password: string;
	email: string;
}
export interface OutputCreateUserDto {
	id: string;
	name: string;
	email: string;
	token: string;
}
