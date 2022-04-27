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

export enum GET_PATIENTS_ORDER_PARAM {
  LASTNAMEASC = 'lastName:asc',
  LASTNAMEDESC= 'lastName:desc',
  FIRSTNAMEASC = 'firstName:asc',
  FIRSTNAMEDESC = 'firstName:desc',
  IDASC =  'id:asc',
  IDDESC =  'id:desc',
  BIRTHDATEASC = 'birthdate:desc',
  BIRTHDATEDESC = 'birthdate:desc',
  WEIGHTASC = 'weight:asc',
  WEIGHTDESC = 'weight:desc',
  HEIGHTASC = 'height:asc',
  HEIGHTDESC = 'height:desc'
}

export enum USER_ROLE {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export const MIN_WEIGHT_VALUE = 1
export const MAX_WEIGHT_VALUE = 200

export const GENDERS = Object.values(GENDER)
export const SUBSTANCE_TIMESUNITS = Object.values(SUBSTANCES_TIMEUNIT)
export const PERSON_TYPES = Object.values(PERSON_TYPE)
export const GET_PATIENTS_ORDER_PARAMS = Object.values(GET_PATIENTS_ORDER_PARAM)
export const USER_ROLES = Object.values(USER_ROLE)