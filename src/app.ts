import express, { Request } from "express";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from "passport-jwt";

import v1 from './api/v1'
import { USER_ROLE } from "./utils/enums";

passport.use('jwt-api', new JwtStrategy({
  audience: 'jwt-api',
  jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromUrlQueryParameter('token')]),
  passReqToCallback: true,
  secretOrKey: process.env.JWT_SECRET
}, (req: Request, payload: { userID: number, name: string, aud: string }, done: VerifiedCallback) => {
  // ak sa podarilo overit token tak tu mozeme podla userID najst pouzivatela v DB a posunut dalej do req
  // console.log(payload)

  // tu select na db where userID a zistime opravnenia
  if ([1, 2].indexOf(payload.userID)) {
    throw new Error('Unauthorized')
  }

  let user
  if (payload.userID === 1) {
    user = {
      id: payload.userID,
      name: 'Joe',
      role: USER_ROLE.ADMIN
    }
  } else {
    user = {
      id: payload.userID,
      name: 'Jenny',
      role: USER_ROLE.USER
    }
  }

  done(null, user)
}))

passport.use('jwt-admin', new JwtStrategy({
  audience: 'jwt-admin',
  jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromUrlQueryParameter('token')]),
  passReqToCallback: true,
  secretOrKey: process.env.JWT_SECRET
}, (req: Request, payload: any, done: VerifiedCallback) => {
  // ak sa podarilo overit token tak tu mozeme podla userID najst pouzivatela v DB a posunut dalej do req
  console.log(payload)
}))

passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser((user, done) => done(null, user))

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(passport.initialize())

// Register router
app.use('/api/v1', v1())


export default app

