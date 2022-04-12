import { PERSON_TYPE } from "./enums";

const substanceAmountParams = {
  CHILD: {
    paramA: 1.6,
    paramB: 20,
    limit: 150
  },
  ADULT: {
    paramA: 2,
    paramB: 30,
    limit: 220
  }
}

export const getAge = (dateString: String): number => {
  const today = new Date()
  const birthDate = new Date(`${dateString}`)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export const isAdult = (age: number, weight: number) => {
  return age >= 18 || weight >= 68
}

export const getPersonType = (age: number, weight: number): PERSON_TYPE => {
  return isAdult(age, weight) ? PERSON_TYPE.ADULT : PERSON_TYPE.CHILD
}

export const calcSubstanceAmount = (personType: PERSON_TYPE, weigth: number) => {
  let paramA, paramB, limit
  let amount: number
  if (personType === PERSON_TYPE.ADULT) {
    paramA = substanceAmountParams.ADULT.paramA
    paramB = substanceAmountParams.ADULT.paramB
    limit = substanceAmountParams.ADULT.limit
  } else {
    paramA = substanceAmountParams.CHILD.paramA
    paramB = substanceAmountParams.CHILD.paramB
    limit = substanceAmountParams.CHILD.limit
  }
  amount = paramA * weigth + paramB
  amount = Math.min(amount, limit)
  amount = Math.round(amount)

  return amount
}