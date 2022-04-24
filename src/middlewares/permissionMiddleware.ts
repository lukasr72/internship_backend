import { NextFunction, Request, Response } from "express";

export default (permissions: string[]) => (req: Request, res: Response, next: NextFunction) => {

  console.log(req.user)

  const usr = req.user as any
  // tu spravime overenie pouzivatelskych roli
  if (permissions.includes(usr.role)) {
    return next(new Error('Forbidden'))
  }

  // create jwt vytvori token pre pouzivatela
  // alebo sign pre jsonwebtoken ?

  return next()
}