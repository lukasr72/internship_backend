import { Request, Response } from 'express'
import Joi from "joi";
import { GENDER_PARAM, GENDER, SUBSTANCES_TIMEUNIT, PERSON_TYPE } from "../../../utils/enums";
import { map } from "lodash";
import { getAge, getPersonType, calcSubstanceAmount } from '../../../utils/helpers'
import { models } from "../../../db";

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

export const responseSchema = Joi.object({
  patients:Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().min(1).required(),
        firstName: Joi.string().max(100).required(),
        lastName: Joi.string().max(100).required(),
        birthdate: Joi.date().iso().required(),
        weight: Joi.number().integer().min(1).max(200).required,
        height: Joi.number().integer().min(1).required(),
        identificationNumber: Joi.string().alphanum().length(12).required(),
        gender: Joi.string().valid(...Object.values(GENDER)).required(),
        age: Joi.number().integer().min(0).required(),
        personType: Joi.string().valid(...Object.values(PERSON_TYPE)).required(),
        substanceAmount: Joi.number().min(1).required(),
        diagnose: Joi.object({
          id: Joi.number().integer().min(1).required(),
          name: Joi.string().max(100).required(),
          description: Joi.string().max(200).required(),
          substance: Joi.object({
            id: Joi.number().integer().min(1).required(),
            name: Joi.string().max(100).required(),
            timeUnit: Joi.string().valid(...Object.values(SUBSTANCES_TIMEUNIT)).required(),
            halfLife: Joi.number().min(0).required()
          })
        }).required()
      }).required()
    ).required(),
})

export const workflow = async (req: Request, res: Response) => {
  const { Patient, Diagnose, Substance } = models

  const gender = req.query.gender ? req.query.gender : 'ALL'
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

  const queryPatients = await Patient.findAndCountAll({
    include: {
      model: Diagnose,
      include: [{model: Substance}],
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

  const selectedPatients = queryPatients.rows

  return res.json({
    patients: map(selectedPatients, (patient) => {
      const age: number = getAge(patient.birthdate)
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
        age,
        personType,
        substanceAmount,
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
