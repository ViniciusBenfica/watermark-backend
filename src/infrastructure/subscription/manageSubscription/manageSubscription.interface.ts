export interface InputManageSubscriptionDto {
	userId: string;
}

export interface OutputManageSubscriptionDto {
	url: string;
}

export default interface ManageSubscriptionInterface {
	manageSubscriptionStripe(input: InputManageSubscriptionDto): Promise<OutputManageSubscriptionDto>;
}
