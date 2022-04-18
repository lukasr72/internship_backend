import supertest from 'supertest'
import { expect } from 'chai'
import app from '../../../../../src/app'
import { responseSchema } from '../../../../../src/api/v1/patients/get.substanceAmount'

const endpoint: string = `/api/v1/patients/substanceAmount`

describe(`[GET] ${endpoint}`, () => {
  it(`Response should return data for line chart - array of substance amount - weight: <1, 200>`, async () => {
    const response = await supertest(app)
      .get(endpoint)
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(200)
    expect(response.type).to.eq('application/json')

    const validationResult = responseSchema.validate(response.body)
    expect(validationResult.error).to.eq(undefined)

  })

})