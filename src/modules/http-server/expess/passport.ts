import { Strategy as FacebookStrategy, VerifyFunction } from 'passport-facebook';
import { Request } from 'express';
import { Passport } from 'passport';
import { ValidationError } from '../../error/errors';
import { IUserService, User } from '../../user/types';
import { ILoggerService } from '../../log/types';
import { IJWTService } from '../../jwt/types';
import { IFacebookApiService } from '../../facebook/types';

export { Passport } from 'passport';

export type SessionTokenPayload = { userId: string };

export type PassportConfig = {
  facebookAppId: string;
  facebookAppSecret: string;
  facebookCallbackPath: string;
  jwtService: IJWTService;
  userService: IUserService;
  loggerService: ILoggerService;
  facebookApiService: IFacebookApiService;
};

export const STRATEGY_FACEBOOK = 'facebook';

export function createPassport({
                                 facebookAppId,
                                 facebookAppSecret,
                                 facebookCallbackPath,
                                 userService,
                                 loggerService,
                                 jwtService,
                                 facebookApiService
                               }: PassportConfig) {
  const passport = new Passport();
  const strategyOptions = {
    clientID: facebookAppId,
    clientSecret: facebookAppSecret,
    callbackURL: 'unknown-yet',
    enableProof: true,
    profileFields: [
      'id',
      'displayName',
      'photos',
      'email'
    ]
  };

  const verifyFunction: VerifyFunction = async (accessToken, refreshToken, profile, cb) => {
    try {
      loggerService.debug('passport verification...', profile);

      if (!profile.emails || !profile.emails.length) {
        throw new ValidationError('missing email from facebook');
      } else if (!profile.photos || !profile.photos.length) {
        throw new ValidationError('missing avatar from facebook');
      }

      const facebookToken = await facebookApiService.getLongLivedToken(accessToken);

      const user = await userService.createUser({
        facebookId: profile.id,
        facebookToken: facebookToken,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        avatar: profile.photos[0].value
      });

      cb(null, user);
      loggerService.debug('passport verification succeeded');
    } catch (e) {
      loggerService.debug('passport verification failed with', e);
      cb(e);
    }
  };

  const facebookStrategy = new FacebookStrategy(strategyOptions, verifyFunction);

  const oldAuthenticate = facebookStrategy.authenticate;
  facebookStrategy.authenticate = function (req: Request, options: object) {
    const serverOrigin = `${req.protocol}://${req.headers.host}`;
    return oldAuthenticate.call(this, req, {
      ...options,
      callbackURL: `${serverOrigin}${facebookCallbackPath}`
    });
  };

  passport.use(STRATEGY_FACEBOOK, facebookStrategy);

  passport.serializeUser((user: User, cb) => {
    loggerService.debug('passport serialization...', user);
    cb(null, jwtService.sign({userId: user.id} as SessionTokenPayload));
  });

  passport.deserializeUser(async (token: string, cb) => {
    loggerService.debug('passport deserialization...', token);

    try {
      const payload = jwtService.verify<SessionTokenPayload>(token);
      loggerService.debug('passport deserialization succeeded', payload);

      cb(null, payload);
    } catch (e) {
      loggerService.debug('passport deserialization failed with', e);
      cb(e);
    }
  });

  return passport;
}
