export interface InputCreatePaymentDto {
	sig: string;
	rawBody: string;
}

export interface OutputCreatePaymentDto {
	success: boolean;
	eventType: string;
}
