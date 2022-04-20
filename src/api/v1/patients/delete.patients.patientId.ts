import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { IMessage, IPatientsMessageResponse } from "../../../utils/interfaces";
import { models } from "../../../db";
import { PatientModel } from "../../../db/models/patients";

export const schema = Joi.object({
  body: Joi.object(),
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
  const { Patient } = models

  const patientId: number = Number(req.params.patientId)

  try {
    const patient: PatientModel = await Patient.findByPk(patientId)
    if(!patient) {
      throw new Error('Patient not found.')
    }

    await Patient.destroy({
      where: {
        id: patientId
      }
    })

    const message: IMessage = { message: 'Patient deleted.', type: 'SUCCESS' }
    const responseMessage: IPatientsMessageResponse = { messages: [message] }

    res.status(200).json(responseMessage)
  } catch (error) {
    return next(error)
  }

}
