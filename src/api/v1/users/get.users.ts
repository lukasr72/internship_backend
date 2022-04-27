import { Request, Response } from 'express'
import { UserModel } from "../../../db/models/users";

export const workflow = async (req: Request, res: Response) => {

  const users: UserModel[] = await UserModel.findAll()

  return res.json(users)
}
