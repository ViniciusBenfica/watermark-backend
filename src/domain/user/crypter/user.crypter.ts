import bcrypt from "bcrypt";
import type CrypterInterface from "../../../shared/crypter.interface";

export default class UserCrypter implements CrypterInterface {
	private _saltRounds = 10;

	crypter(text: string): string {
		return bcrypt.hashSync(text, this._saltRounds);
	}
	compare(text: string, hash: string): boolean {
		return bcrypt.compareSync(text, hash);
	}
}
