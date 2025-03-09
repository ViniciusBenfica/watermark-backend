export interface InputCreateSubscriptionDto {
	userId: string;
	planId: string;
	buyDate: Date;
	expirationDate: Date;
}

export interface OutputCreateSubscriptionDto {
	id: string;
	userId: string;
	planId: string;
	buyDate: Date;
	expirationDate: Date;
}
