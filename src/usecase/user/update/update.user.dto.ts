export interface InputUpdateUserDto {
	userId: string;
	password: string;
}
export interface OutputUpdateUserDto {
	id: string;
	name: string;
	email: string;
	token: string;
}
