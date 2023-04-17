import passport from "passport";
import passportJWT from "passport-jwt";
import { User } from "../models/user.js";

export const setUpPassport = (app) => {
  // Set up passport
  app.use(passport.initialize());

  // Configure JWT strategy
  const JWTStrategy = passportJWT.Strategy;
  const ExtractJWT = passportJWT.ExtractJwt;
  const privateKey = "mylongsecretkey";
  const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: privateKey, // Replace with your own secret key
  };

  passport.use(
    new JWTStrategy(opts, async (jwtPayload, done) => {
      // console.log('payload',jwtPayload);
      // console.log('sub',jwtPayload.sub);
      try {
        const user = await User.findById(jwtPayload.userId);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(err, false);
      }
    })
  );
};
