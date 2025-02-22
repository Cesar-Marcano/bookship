import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

import { authService, userService } from "../services";
import { jwtSecret } from "./";
import { JwtPayload, TokenType } from "../types/jwtPayload";
import { UnauthorizedError } from "../errors/unauthorized.error";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await authService.loginUser(email, password);

        if (!user) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    },
    async (payload: JwtPayload, done) => {
      try {
        if (payload.type !== TokenType.Access)
          return done(new UnauthorizedError("Expected: Access Token, Received: Refresh Token."), false);

        const userData = await userService.getUserByEmail(
          payload.userData.email
        );

        if (!userData) return done(null, false);

        if (userData.password) userData.password = "";

        const user = {
          userData,
          tokenUuid: payload.uuid,
        };

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
