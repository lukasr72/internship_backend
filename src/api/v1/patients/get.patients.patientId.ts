import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { PatientModel } from "../../../db/models/patients";
import { DiagnoseModel } from "../../../db/models/diagnoses";
import { SubstanceModel } from "../../../db/models/substances";
import { calcSubstanceAmount, getAge, getPersonType } from "../../../utils/helpers";

export const schema = Joi.object({
  body: Joi.object(),
  query: Joi.object(),
  params: Joi.object({
    patientId: Joi.number().integer().required()
  })
})

export const workflow = async (req: Request, res: Response, next: NextFunction) => {

  const patientId: number = Number(req.params.patientId)

  try {
    const patient = await PatientModel.findByPk(patientId, {
      include: {
        model: DiagnoseModel,
        include: [{ model: SubstanceModel }]
      }
    })
    if(!patient) {
      throw new Error('Patient not found.')
    }

    const age = getAge(patient.birthdate)
    const personType = getPersonType(age, patient.weight)
    const substanceAmount = calcSubstanceAmount(personType, patient.weight)

    res.status(200).json({
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
    })
  } catch (error) {
    return next(error)
  }

}
