import UserCrypterFactory from "../factory/user.factory.crypter";

export default class User {
	private _id: string;
	private _name: string;
	private _password: string;
	private _email: string;
	private _planId: string | null;

	constructor(id: string, name: string, email: string, password: string, planId: string | null) {
		this._id = id;
		this._name = name;
		this._password = password;
		this._email = email;
		this._planId = planId;
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}

	get email(): string {
		return this._email;
	}

	get planId(): string | null {
		return this._planId;
	}

	encryptPassword(password: string) {
		this._password = UserCrypterFactory.create().crypter(password);
	}
}
