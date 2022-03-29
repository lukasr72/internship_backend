import { Request, Response } from 'express'


export const workflow = (req: Request, res: Response) => {

  const response = {
    "messages": [
      {
        "message": "New patient added.",
        "type": "SUCCESS"
      }
    ],
    "patient": {
      "id": 1
    }
  }

  res.json(response)
}
