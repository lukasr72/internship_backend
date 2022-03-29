import { Request, Response } from 'express'


export const workflow = (req: Request, res: Response) => {

  const responseData = {
    "messages": [
      {
        "message": "Patient with ID: " + req.params.patientId + " updated.",
        "type": "SUCCESS"
      }
    ]
  }

  res.json(responseData)
}
