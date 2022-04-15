export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum GENDER_PARAM {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  ALL = 'ALL'
}

export enum SUBSTANCES_TIMEUNIT {
  MINUTE = 'MINUTE',
  HOUR = 'HOUR',
  SECOND = 'SECOND',
  DAY = 'DAY'
}

export enum PERSON_TYPE {
  CHILD = 'CHILD',
  ADULT = 'ADULT'
}

export const MIN_WEIGHT_VALUE = 1
export const MAX_WEIGHT_VALUE = 200

export const GENDERS = Object.values(GENDER)
export const SUBSTANCE_TIMESUNITS = Object.values(SUBSTANCES_TIMEUNIT)
export const PERSON_TYPES = Object.values(PERSON_TYPE)
