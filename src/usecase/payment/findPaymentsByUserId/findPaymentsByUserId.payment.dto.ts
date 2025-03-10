export interface OutputFindPaymentsByUserIdDto {
	id: string;
	buyDate: Date;
	userId: string;
	planId: string;
	status: string;
	price: number;
}
