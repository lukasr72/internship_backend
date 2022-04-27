import express, { Request } from "express";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from "passport-jwt";

import v1 from "./api/v1";
import { UserModel } from "./db/models/users";

passport.use('jwt-api', new JwtStrategy({
  audience: 'jwt-api',
  jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromUrlQueryParameter('token')]),
  passReqToCallback: true,
  secretOrKey: process.env.JWT_SECRET
}, async (req: Request, payload: { userID: number, name: string, aud: string }, done: VerifiedCallback) => {

  const user: UserModel = await UserModel.findByPk(payload.userID)
  try {
    if (!user) {
      throw new Error('Unauthorized')
    }

  } catch (error) {
    return done(error, false)
  }

  return done(null, user)
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