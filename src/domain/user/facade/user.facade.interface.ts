export interface InputFindUserFacadeDto {
  id: string;
}
export interface OutputFindUserFacadeDto {
  id: string;
  name: string;
  email: string;
}

export default interface UserFacadeInterface {
  findUser(input: InputFindUserFacadeDto): Promise<OutputFindUserFacadeDto>;
}
