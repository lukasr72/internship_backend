import supertest from 'supertest'
import { expect } from 'chai'
import app from '../../../../../src/app'
import { responseSchema } from '../../../../../src/api/v1/patients/post.patients'
import { responseSchemaGetPatient } from '../../../../../src/api/v1/patients/get.patients.patientId'

const endpoint = (patientID: number | string) => `/api/v1/patients/${patientID}`
let patientID: number

const url = '/api/v1/patients'

describe(`[POST] ${url}`, () => {
  it('Response should return message and id of new patient', async () => {
    const response = await supertest(app)
      .post(url)
      .send({
        firstName: "Oscar",
        lastName: "Smith",
        birthdate: "1977-08-15T03:25:36.443Z",
        weight: 95,
        height: 195,
        identificationNumber: "LPWUs9VlLPWU",
        gender: "MALE",
        diagnoseID: 9
      })
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(200)
    expect(response.type).to.eq('application/json')

    const validationResult = responseSchema.validate(response.body)
    expect(validationResult.error).to.eq(undefined)

    patientID = response.body.patient.id
  })

  it('Response should return the patient who was added', async () => {
    const response = await supertest(app)
      .get(endpoint(patientID))
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(200)
    expect(response.type).to.eq('application/json')

    const validationResult = responseSchemaGetPatient.validate(response.body)
    expect(validationResult.error).to.eq(undefined)

    expect(response.body.patient.id).to.eq(patientID)
  })

})