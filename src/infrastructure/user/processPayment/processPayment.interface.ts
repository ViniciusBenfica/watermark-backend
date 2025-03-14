export interface InputProcessPaymentDto {
	productId: string;
	userId: string;
	productPrice: number;
	productName: string;
	currency: string;
	quantity: number;
}

export interface OutputProcessPaymentDto {
	url: string;
}

export default interface ProcessPaymentInterface {
	userPurchase(input: InputProcessPaymentDto): Promise<OutputProcessPaymentDto>;
}
