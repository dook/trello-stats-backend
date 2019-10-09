import passport from 'passport'
import TrelloStrategy from 'passport-trello'
import JWTStrategy from 'passport-jwt'
import jwt from 'jsonwebtoken'

import authConfig from '../config/oauth'
import User from '../models/user'
import { StatusError } from '../utils/error'

passport.use('oauth', new TrelloStrategy.Strategy({
  consumerKey: authConfig.KEY,
  consumerSecret: authConfig.SECRET,
  callbackURL: authConfig.CALLBACK,
  passReqToCallback: true,
  trelloParams: {
    scope: 'read,account',
    name: authConfig.APP_NAME,
    expiration: 'never'
  }
}, async (req, accessToken, tokenSecret, profile, done) => {
  const redirect = req.session.redirectUrl || authConfig.FRONTEND_URL
  try {
    const user = await User.findOneOrCreate({trelloId: profile.id}, {
      email: profile._json.email,
      username: profile._json.username,
      fullName: profile._json.fullName,
      avatarUrl: profile._json.avatarUrl && `${profile._json.avatarUrl}/170.png`,
      idBoards: profile._json.idBoards,
      idOrganizations: profile._json.idOrganizations
    })
    const userJWT = { id: user._id, accessToken, tokenTS: user.tokenTS }
    const tokenJWT = jwt.sign(userJWT, authConfig.JWT_SECRET)
    return done(null, user, {token: tokenJWT, redirect})
  } catch (err) {
    return done(err)
  }
}))

passport.use('jwt', new JWTStrategy.Strategy({
  jwtFromRequest: JWTStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: authConfig.JWT_SECRET
}, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.id)
    if (user) {
      if (new Date(jwtPayload.tokenTS).toISOString() !== new Date(user.tokenTS).toISOString()) {
        throw new StatusError(401, 'Invalid token.')
      }
      return done(null, user, {accessToken: jwtPayload.accessToken})
    }
  } catch (err) {
    return done(err)
  }
}
))

export const authenticate = () => passport.authenticate('oauth', {session: false})
export const authorize = () => passport.authenticate('jwt', {session: false})
export const passRedirectUrlToSession = (req, res, next) => {
  req.session.redirectUrl = req.query.redirect
  return next()
}
export default passport
