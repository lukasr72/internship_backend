import supertest from 'supertest'
import { expect } from 'chai'
import app from '../../../../../src/app'
import { responseSchema } from '../../../../../src/api/v1/patients/patch.patients.patientId'
import { responseSchemaGetPatient } from "../../../../../src/api/v1/patients/get.patients.patientId";

const endpoint = (patientID: number | string) => `/api/v1/patients/${patientID}`
const patientID: number = 5

const newData = {
  firstName: "Lukas",
  lastName: "laborum Lorem",
  birthdate: "2000-04-16T12:27:11.746Z",
  weight: 69,
  height: 180
}

describe(`[PATCH] ${endpoint(patientID)}`, () => {
  it('Response should return message - updated patient', async () => {
    const response = await supertest(app)
      .patch(endpoint(patientID))
      .send(newData)
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(200)
    expect(response.type).to.eq('application/json')

    const validationResult = responseSchema.validate(response.body)
    expect(validationResult.error).to.eq(undefined)
  })

  it('Response should return and check updated patient', async () => {
    const response = await supertest(app)
      .get(endpoint(patientID))
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(200)
    expect(response.type).to.eq('application/json')

    const validationResult = responseSchemaGetPatient.validate(response.body)
    expect(validationResult.error).to.eq(undefined)

    let newDataBirthdateModified = { ...newData }
    newDataBirthdateModified.birthdate = newData.birthdate.slice(0, 10)
    Object.entries(newDataBirthdateModified).forEach(([key, value]) => {
      expect(value).to.eq(response.body.patient[key])
    })
  })

})