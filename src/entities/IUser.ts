export interface IUser {
  name: string,
  email: string,
  photo: string,
  password: string,
  jewelry: number,
  creatAt: Date
}

export interface IUserDTO {
  name: string,
  email: string,
  jewelry: number,
  photo: string,
}
