export interface InputCreateUserPlanDto {
	userId: string;
	planId: string;
	buyDate: Date;
	expirationDate: Date;
}

export interface OutputCreateUserPlanDto {
	id: string;
	userId: string;
	planId: string;
	buyDate: Date;
	expirationDate: Date;
}
