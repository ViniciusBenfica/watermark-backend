import type User from "../entity/user.entity";

export default interface UserRepositoryInterface {
	create(entity: User): Promise<void>;
	find(entity: Partial<User>): Promise<User>;
}
