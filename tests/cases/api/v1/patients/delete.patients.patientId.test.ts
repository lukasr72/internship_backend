import supertest from 'supertest'
import { expect } from 'chai'
import app from '../../../../../src/app'
import { responseSchema } from '../../../../../src/api/v1/patients/delete.patients.patientId'

const endpoint = (patientID: number | string) => `/api/v1/patients/${patientID}`
const patientID: number = 8

describe(`[DELETE] ${endpoint(patientID)}`, () => {
  it('Response should return message - deleted patient', async () => {
    const response = await supertest(app)
      .delete(endpoint(patientID))
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(200)
    expect(response.type).to.eq('application/json')

    const validationResult = responseSchema.validate(response.body)
    expect(validationResult.error).to.eq(undefined)
  })

  it('Response should return 404 because patient will be deleted', async () => {
    const response = await supertest(app)
      .get(endpoint(patientID))
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(404)
    expect(response.type).to.eq('application/json')
  })

})