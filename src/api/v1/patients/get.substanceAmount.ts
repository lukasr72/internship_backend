import { Request, Response } from "express";
import Joi from "joi";
import { PERSON_TYPE, PERSON_TYPES } from "../../../utils/enums";
import { calcSubstanceAmount, isAdult } from "../../../utils/helpers";

interface IDataResult {
  weight: number
  category: PERSON_TYPE
  amount: number
}

export const responseSchema = Joi.array()
    .items(
      Joi.object({
        weight: Joi.number().integer().min(1).max(200).required(),
        category: Joi.string().valid(...PERSON_TYPES).required(),
        amount: Joi.number().required(),
      }).required()
    ).required()

export const workflow = async (req: Request, res: Response) => {
  let result: IDataResult[] = []

  for (let i = 1; i <= 200; i++) {
    const adult: IDataResult = {
      weight: i,
      category: PERSON_TYPE.ADULT,
      amount: calcSubstanceAmount(PERSON_TYPE.ADULT, i)
    }
    result.push(adult)

    if (!isAdult(1, i)) {
      const child: IDataResult = {
        weight: i,
        category: PERSON_TYPE.CHILD,
        amount: calcSubstanceAmount(PERSON_TYPE.CHILD, i)
      }
      result.push(child)
    }
  }

  return res.json(result)
}
