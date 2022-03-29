import { Request, Response } from 'express'


export const workflow = (req: Request, res: Response) => {
  res.json({
    patients: [{
      id: 1,
      name: "john doe"
    }]
  })
}