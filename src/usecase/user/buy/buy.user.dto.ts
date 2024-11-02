export interface InputCreatePaymentDto {
	userId: string;
	planId: string;
}

export interface OutputCreatePaymentDto {
	id: string;
	client_secret: string | null;
}
