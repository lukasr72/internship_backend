import { Request, Response } from 'express'
import { PatientModel } from "../../../db/models/patients";
import { DiagnoseModel } from "../../../db/models/diagnoses";
import { SubstanceModel } from "../../../db/models/substances";
import Joi from "joi";
import { GENDER_PARAM } from "../../../utils/enums";
import { map } from "lodash";
import { getAge, getPersonType, calcSubstanceAmount } from '../../../utils/helpers'

export const schema = Joi.object({
  body: Joi.object(),
  query: Joi.object({
    gender: Joi.string().valid(...Object.values(GENDER_PARAM)),
    order: Joi.string(),
    limit: Joi.number().valid(25, 50, 100),
    page: Joi.number()
  }),
  params: Joi.object()
})

export const workflow = async (req: Request, res: Response) => {

  const gender = req.query.gender
  let qOrder = req.query.order ? (req.query.order as string).split(':') : []
  if (qOrder.length === 0) {
    qOrder[0] = 'lastName'
    qOrder[1] = 'asc'
  }
  const limit: number = Number(req.query.limit) ? Number(req.query.limit) : 25
  const page: number = Number(req.query.page) ? Number(req.query.page) : 1
  const offset: number = (page - 1) * limit

  let whereConditions = {}
  if (gender !== 'ALL') {
    whereConditions = { gender }
  }

  const queryPatients = await PatientModel.findAndCountAll({
    include: {
      model: DiagnoseModel,
      include: [{model: SubstanceModel}],
      attributes: {
        exclude: ['substanceID']
      },
    },
    attributes: {
      exclude: [
        'diagnoseID'
      ]
    },
    where: whereConditions,
    order: [[qOrder[0], qOrder[1]]],
    limit,
    offset
  })

  const selectedPatients: PatientModel[] = queryPatients.rows

  res.json({
    patients: map(selectedPatients, (patient) => {
      const age = getAge(patient.birthdate)
      const personType = getPersonType(age, patient.weight)
      const substanceAmount = calcSubstanceAmount(personType, patient.weight)

      return {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        birthdate: patient.birthdate,
        weight: patient.weight,
        height: patient.height,
        identificationNumber: patient.identificationNumber,
        gender: patient.gender,
        age: age,
        personType: personType,
        substanceAmount: substanceAmount,
        diagnose: {
          id: patient.diagnose.id,
          name: patient.diagnose.name,
          description: patient.diagnose.description,
          substance: {
            id: patient.diagnose.substance.id,
            name: patient.diagnose.substance.name,
            timeUnit: patient.diagnose.substance.timeUnit,
            halfLife: patient.diagnose.substance.halfLife
          }
        }
      }
    }),
    pagination: {
      "limit": limit,
      "page": page,
      "totalPages": Math.ceil(queryPatients.count / limit),
      "totalCount": queryPatients.count
    }
  })
}
