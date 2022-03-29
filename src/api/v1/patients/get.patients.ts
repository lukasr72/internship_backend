import { Request, Response } from 'express'


export const workflow = (req: Request, res: Response) => {

  const responseData = {
    "patients": [
      {
        "id": 1,
        "firstName": "string",
        "lastName": "string",
        "birthdate": "2022-03-29T10:53:27.848Z",
        "weight": 200,
        "height": 1,
        "identificationNumber": "dzfx0UstqO8q",
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
    ],
    "pagination": {
      "limit": 1,
      "page": 1,
      "totalPages": 0,
      "totalCount": 0
    }
  }


  res.json(responseData)
}
