import { GENDER } from "./enums";

export interface IMessage {
  message: string
  type: string
}

export interface IPatient {
  id: number
}

export interface IPatientsPostResponse {
  messages: Array<IMessage>
  patient: IPatient
}

export interface IPatientsMessageResponse {
  messages: Array<IMessage>
}

export interface IPatientModel {
  firstName: string
  lastName: string
  birthdate: Date
  height: number
  weight: number
  identificationNumber: string
  gender: GENDER
  diagnoseID: number
}