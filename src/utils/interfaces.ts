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