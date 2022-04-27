import { Request, Response } from "express";
import { UserModel } from "../../../db/models/users";
import { USER_ROLE } from "../../../utils/enums";

export const workflow = async (req: Request, res: Response) => {
  const users: UserModel[] = []

  for (let i = 1; i <= 10; i++) {
    await UserModel.create({
      name: `Lukas-${i}`,
      role: USER_ROLE.USER,
      patientID: i
    })
  }

  await UserModel.create({
    name: 'Admin',
    role: USER_ROLE.ADMIN
  })

  await UserModel.create({
    name: 'SuperAdmin',
    role: USER_ROLE.SUPER_ADMIN
  })

  return res.status(200).json(users)
}
