import CrypterInterface from '../../../shared/crypter.interface';
import bcrypt from 'bcrypt';

export default class UserCrypter implements CrypterInterface {
  private _saltRounds = 10;

  crypter(text: string): string {
    return bcrypt.hashSync(text, this._saltRounds);
  }
  compare(text: string, hash: string): boolean {
    return bcrypt.compareSync(text, hash);
  }
}
