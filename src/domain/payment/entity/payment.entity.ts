export default class Payment {
	private _id: string;
	private _buyDate: Date;
	private _expirationDate: Date;
	private _userId: string;
	private _planId: string;

	constructor(id: string, userId: string, planId: string, buyDate: Date, expirationDate: Date) {
		this._id = id;
		this._buyDate = buyDate;
		this._expirationDate = expirationDate;
		this._userId = userId;
		this._planId = planId;
	}

	get id(): string {
		return this._id;
	}

	get buyDate(): Date {
		return this._buyDate;
	}

	get expirationDate(): Date {
		return this._expirationDate;
	}

	get userId(): string {
		return this._userId;
	}

	get planId(): string {
		return this._planId;
	}
}
