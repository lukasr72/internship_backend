import supertest from 'supertest'
import { expect } from 'chai'
import app from '../../../../../src/app'
import { responseSchema } from '../../../../../src/api/v1/patients/post.patients'

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
  })

})