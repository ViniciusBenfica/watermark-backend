import bcryptjs from "bcryptjs";
import type CrypterInterface from "../../../shared/crypter.interface";

export default class UserCrypter implements CrypterInterface {
	private _saltRounds = 10;

	crypter(text: string): string {
		return bcryptjs.hashSync(text, this._saltRounds);
	}
	compare(text: string, hash: string): boolean {
		return bcryptjs.compareSync(text, hash);
	}
}
