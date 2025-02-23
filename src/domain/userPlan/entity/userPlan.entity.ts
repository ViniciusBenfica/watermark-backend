export default class UserPlan {
	private _id: string;
	private _userId: string;
	private _planId: string;
	private _buyDate: Date;
	private _expirationDate: Date;

	constructor(id: string, userId: string, planId: string, buyDate: Date, expirationDate: Date) {
		this._id = id;
		this._userId = userId;
		this._planId = planId;
		this._buyDate = buyDate;
		this._expirationDate = expirationDate;
	}

	get id(): string {
		return this._id;
	}

	get userId(): string {
		return this._userId;
	}

	get planId(): string {
		return this._planId;
	}

	get buyDate(): Date {
		return this._buyDate;
	}

	get expirationDate(): Date {
		return this._expirationDate;
	}

	isExpired(): boolean {
		return new Date() > this._expirationDate;
	}

	isActive(): boolean {
		return !this.isExpired();
	}
}
