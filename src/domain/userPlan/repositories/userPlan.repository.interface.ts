import type UserPlan from "../entity/userPlan.entity";

export default interface UserPlanRepositoryInterface {
	create(userPlan: UserPlan): Promise<void>;
	find(id: string): Promise<UserPlan | null>;
}
