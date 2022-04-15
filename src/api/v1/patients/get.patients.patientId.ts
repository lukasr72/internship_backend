import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { models } from "../../../db";
import { calcSubstanceAmount, getAge, getPersonType } from "../../../utils/helpers";
import { PERSON_TYPE } from "../../../utils/enums";

export const schema = Joi.object({
  body: Joi.object(),
  query: Joi.object(),
  params: Joi.object({
    patientId: Joi.number().integer().required()
  })
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
    })
  } catch (error) {
    return next(error)
  }

}
