import CrypterInterface from '../../../shared/crypter.interface';
import UserCrypter from '../crypter/user.crypter';

export default class UserCrypterFactory {
  static create(): CrypterInterface {
    return new UserCrypter();
  }
}
