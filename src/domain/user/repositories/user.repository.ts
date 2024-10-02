import User from '../entity/user.entity';

export default interface UserRepositoryInterface {
  create(entity: User): Promise<void>;
  find(id: string): Promise<User>;
}
