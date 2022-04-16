import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { models } from "../../../db";
import { calcSubstanceAmount, getAge, getPersonType } from "../../../utils/helpers";
import { GENDER, MAX_WEIGHT_VALUE, MIN_WEIGHT_VALUE, PERSON_TYPE, SUBSTANCES_TIMEUNIT } from "../../../utils/enums";

export const schema = Joi.object({
  body: Joi.object(),
  query: Joi.object(),
  params: Joi.object({
    patientId: Joi.number().integer().required()
  })
})

export const responseSchemaGetPatient = Joi.object({
  patient: Joi.object({
    id: Joi.number().integer().min(1).required(),
    firstName: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required(),
    birthdate: Joi.date().iso().required(),
    weight: Joi.number().integer().min(MIN_WEIGHT_VALUE).max(MAX_WEIGHT_VALUE).required(),
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
})

export const workflow = async (req: Request, res: Response, next: NextFunction) => {
  const { Patient, Diagnose, Substance } = models

  try {
    const patientId: number = Number(req.params.patientId)

    const patient = await Patient.findByPk(patientId, {
      include: {
        model: Diagnose,
        required: true,
        include: [{
          model: Substance,
          required: true
        }]
      }
    })
    if(!patient) {
      throw new Error('Patient not found.')
    }

  const age: number = getAge(patient.birthdate)
  const personType: PERSON_TYPE = getPersonType(age, patient.weight)
  const substanceAmount: number = calcSubstanceAmount(personType, patient.weight)

    return res.json({
      patient: {
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
    })
  } catch (error) {
    return next(error)
  }

}
