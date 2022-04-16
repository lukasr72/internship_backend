import supertest from 'supertest'
import { expect } from 'chai'
import app from '../../../../../src/app'
import { responseSchema } from '../../../../../src/api/v1/patients/get.patients'
import { forEach } from "lodash";

const url = '/api/v1/patients'

describe(`[GET] ${url}`, () => {
  it('Response should return list (length = 25) of patients', async () => {
    const response = await supertest(app)
      .get(url)
      .query({
        gender: 'FEMALE',
        order: 'lastName:asc',
        limit: 100,
        page: 1
      })
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(200)
    expect(response.type).to.eq('application/json')

    const validationResult = responseSchema.validate(response.body)
    expect(validationResult.error).to.eq(undefined)

    expect(response.body.patients.length).to.eq(100)
  })

  it('Response should return bad request error - wrong query', async () => {
    const response = await supertest(app)
      .get(url)
      .query({
        gender: 'FEMA'
      })
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(400)
    expect(response.type).to.eq('application/json')
  })

  it('Response should return list of patients - only FEMALE', async () => {
    const response = await supertest(app)
      .get(url)
      .query({
        gender: 'FEMALE',
        order: 'lastName:asc',
        limit: 25,
        page: 1
      })
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(200)
    expect(response.type).to.eq('application/json')

    const validationResult = responseSchema.validate(response.body)
    expect(validationResult.error).to.eq(undefined)

    let noFemalePatientsCount = 0;
    forEach(response.body.patients, (patient) => {
      if (patient.gender !== 'FEMALE') noFemalePatientsCount++
    })
    expect(noFemalePatientsCount).to.eq(0)
  })

  it('Response should return list of patients - only MALE', async () => {
    const response = await supertest(app)
      .get(url)
      .query({
        gender: 'MALE',
        order: 'lastName:asc',
        limit: 25,
        page: 1
      })
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(200)
    expect(response.type).to.eq('application/json')

    const validationResult = responseSchema.validate(response.body)
    expect(validationResult.error).to.eq(undefined)

    let noFemalePatientsCount = 0;
    forEach(response.body.patients, (patient) => {
      if (patient.gender !== 'MALE') noFemalePatientsCount++
    })
    expect(noFemalePatientsCount).to.eq(0)
  })

  it('Response should return list of patients - limit query unfilled - default limit = 25', async () => {
    const response = await supertest(app)
      .get(url)
      .query({
        gender: 'MALE',
        order: 'lastName:asc',
        page: 1
      })
      .set('Content-Type', 'application/json')

    expect(response.status).to.eq(200)
    expect(response.type).to.eq('application/json')

    const validationResult = responseSchema.validate(response.body)
    expect(validationResult.error).to.eq(undefined)

    expect(response.body.patients.length).to.eq(25)
  })

})