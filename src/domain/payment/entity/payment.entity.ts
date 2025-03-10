export default class Payment {
	private _id: string;
	private _buyDate: Date;
	private _status: string;
	private _price: number;
	private _userId: string;
	private _planId: string;

	constructor(id: string, userId: string, planId: string, buyDate: Date, status: string, price: number) {
		this._id = id;
		this._buyDate = buyDate;
		this._userId = userId;
		this._planId = planId;
		this._status = status;
		this._price = price;
	}

	get id(): string {
		return this._id;
	}

	get buyDate(): Date {
		return this._buyDate;
	}

	get userId(): string {
		return this._userId;
	}

	get planId(): string {
		return this._planId;
	}

	get status(): string {
		return this._status;
	}

	get price(): number {
		return this._price;
	}
}
