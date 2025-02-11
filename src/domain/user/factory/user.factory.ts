import User from '../entity/user.entity';
import { v4 as uuid } from 'uuid';

export default class UserFactory {
  static create(
    name: string,
    email: string,
    password: string,
    planId?: string | null,
    id?: string,
  ): User {
    return new User(id || uuid(), name, email, password, planId || null);
  }
}
