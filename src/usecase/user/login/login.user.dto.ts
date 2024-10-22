export interface InputLoginUserDto {
	password: string;
	email: string;
}
export interface OutputLoginUserDto {
	id: string;
	name: string;
	email: string;
	token: string;
}
