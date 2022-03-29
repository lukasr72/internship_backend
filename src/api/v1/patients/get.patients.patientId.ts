import { Request, Response } from 'express'


export const workflow = (req: Request, res: Response) => {

  const responseData = {
    "patient": {
      "id": 1,
      "firstName": "string",
      "lastName": "string",
      "birthdate": "2022-03-29T11:01:27.571Z",
      "weight": 200,
      "height": 1,
      "identificationNumber": "VI4ttYSyTM66",
      "gender": "MALE",
      "age": 0,
      "personType": "ADULT",
      "substanceAmount": 1,
      "diagnose": {
        "id": 1,
        "name": "string",
        "description": "string",
        "substance": {
          "id": 1,
          "name": "string",
          "timeUnit": "SECOND",
          "halfLife": 0
        }
      }
    }
  }

  res.json(responseData)
}
