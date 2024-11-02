export default class Plan {
	private _id: string;
	private _name: string;
	private _description: string;
	private _price: number;
	private _duration: number;

	constructor(id: string, name: string, description: string, price: number, duration: number) {
		this._id = id;
		this._name = name;
		this._description = description;
		this._price = price;
		this._duration = duration;
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get description(): string {
		return this._description;
	}

	get price(): number {
		return this._price;
	}

	get duration(): number {
		return this._duration;
	}
}
