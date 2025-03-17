export interface InputCreateCustomerDto {
	email: string;
	name: string;
}

export interface OutputCreateCustomerDto {
	customerId: string;
}

export default interface CreateCustomerInterface {
	createCustomer(input: InputCreateCustomerDto): Promise<OutputCreateCustomerDto>;
}
