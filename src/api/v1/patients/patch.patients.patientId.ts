import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { GENDER } from "../../../utils/enums";
import { IMessage, IPatientsMessageResponse } from "../../../utils/interfaces";
import { models } from "../../../db";
import { Op } from "sequelize";
import { PatientModel } from "../../../db/models/patients";
import { DiagnoseModel } from "../../../db/models/diagnoses";

export const schema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().max(100),
    lastName: Joi.string().max(100),
    birthdate: Joi.date(),
    height: Joi.number().min(1),
    weight: Joi.number().max(200),
    identificationNumber: Joi.string().pattern(/^[a-zA-Z0-9]*$/).length(12),
    gender: Joi.string().valid(...Object.values(GENDER)),
    diagnoseID: Joi.number().integer().min(1)
  }),
  query: Joi.object(),
  params: Joi.object({
    patientId: Joi.number().integer().required()
  })
})

export const responseSchema = Joi.object({
  messages: Joi.array()
    .items(
      Joi.object({
        message: Joi.string().required(),
        type: Joi.string().max(50).required(),
      }).required()
    ).required()
})

export const workflow = async (req: Request, res: Response, next: NextFunction) => {
  const { Patient, Diagnose } = models

  const patientId: number = Number(req.params.patientId)
  const patientNewData: PatientModel = req.body

  try {
    const patientModel: PatientModel = await Patient.findByPk(patientId)
    if(!patientModel) {
      throw new Error('Patient not found.')
    }

    if(patientNewData.diagnoseID) {
      const diagnose: DiagnoseModel = await Diagnose.findByPk(patientNewData.diagnoseID)
      if (!diagnose) {
        throw new Error('Diagnose not found.')
      }
    }

    if(patientNewData.identificationNumber) {
      const patientUnique: PatientModel = await Patient.findOne({
        where: {
          id: {
            [Op.not]: patientId,
          },
          identificationNumber: patientNewData.identificationNumber
        }
      })
      if (patientUnique) {
        throw new Error('Patient\'s identification number already exists.')
      }
    }

    await patientModel.update(patientNewData)
    await patientModel.save()

    const message: IMessage = { message: 'Patient updated.', type: 'SUCCESS' }
    const responseMessage: IPatientsMessageResponse = { messages: [message] }

    res.status(200).json(responseMessage)
  } catch (error) {
    return next(error)
  }

}
