import supertest from 'supertest'
import { expect } from 'chai'
import app from '../../../../../src/app'
import { responseSchemaGetPatient } from '../../../../../src/api/v1/patients/get.patients.patientId'

const endpoint = (patientID: number | string) => `/api/v1/patients/${patientID}`
const patientID: number = 5

describe(`[GET] ${endpoint(':patientID')}`, () => {
  it(`Response should return patient with patientID: ${patientID}`, async () => {
    const response = await supertest(app)
      .get(endpoint(patientID))
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(200)
    expect(response.type).to.eq('application/json')

    const validationResult = responseSchemaGetPatient.validate(response.body)
    expect(validationResult.error).to.eq(undefined)

    expect(response.body.patient.id).to.eq(patientID)
  })

  it(`Response should return 404 - patient not found`, async () => {
    const response = await supertest(app)
      .get(endpoint(2000))
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(404)
    expect(response.type).to.eq('application/json')
  })

})