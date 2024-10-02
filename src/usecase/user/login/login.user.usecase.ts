import UseCaseInterface from '../../../shared/usecase.interface';
import { InputLoginUserDto, OutputLoginUserDto } from './login.user.dto';
import UserOwnerCrypter from '../../../domain/user/crypter/user.crypter';
import UserRepositoryInterface from '../../../domain/user/repositories/user.repository';

export default class LoginUserUseCase
  implements UseCaseInterface<InputLoginUserDto, OutputLoginUserDto>
{
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(input: InputLoginUserDto): Promise<OutputLoginUserDto> {
    const findUser = await this.userRepository.findUserByEmail(input.email);
    if (!findUser) {
      throw new Error('User not found');
    }

    if (!new UserOwnerCrypter().compare(input.password, findUser.password)) {
      throw new Error('Wrong password');
    }

    return {
      id: findUser.id,
      name: findUser.name,
      email: findUser.email,
    };
  }
}
