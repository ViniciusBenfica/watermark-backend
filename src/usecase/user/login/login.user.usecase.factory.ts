import UserRepository from '../../../infrastructure/user/repositories/user.repository';
import LoginUserUseCase from './login.user.usecase';

export default class LoginUserUsecaseFactory {
  static create() {
    return new LoginUserUseCase(new UserRepository());
  }
}
