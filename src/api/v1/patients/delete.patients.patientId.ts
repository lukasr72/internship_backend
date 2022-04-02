import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { PatientModel } from "../../../db/models/patients";
import { IMessage, IPatientsMessageResponse } from "../../../utils/interfaces";

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
    const patient = await PatientModel.findByPk(patientId)
    if(!patient) {
      throw new Error('Patient not found.')
    }

    await PatientModel.destroy({
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
