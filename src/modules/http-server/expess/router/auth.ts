import { Router, Request, Response, NextFunction } from 'express';
import { PATH_APP } from '../../../../constants';
import {
  PATH_AUTH_LOGOUT,
  PATH_AUTH_FACEBOOK_CALLBACK,
  PATH_AUTH_FACEBOOK,
  PATH_AUTH_FACEBOOK_RESTART
} from '../../../../constants';
import { STRATEGY_FACEBOOK, Passport } from '../passport';
import { ILoggerService } from '../../../log/types';
import { AuthenticateOptions } from 'passport-facebook';

export type AuthRouterConfig = {
  passport: Passport;
  loggerService: ILoggerService;
};

export function createAuthRouter({passport, loggerService}: AuthRouterConfig) {
  const requiredPermissions = [
    'public_profile',
    'user_photos',
    'email'
  ];

  const router = Router();
  const getRedirectUriFromRequest = (req: Request) => {
    let redirectUrisInPriority: string[] = [
      req.query && req.query.redirect_uri || '',
      req.headers && req.headers.referer || '',
      PATH_APP
    ];

    const filteredRedirectUris = redirectUrisInPriority
      .filter((redirectUri) => !!redirectUri);

    return filteredRedirectUris[0];
  };

  router.get(PATH_AUTH_LOGOUT, (req: Request & { user: object, logout: () => void }, res: Response) => {
    loggerService.debug('logging out...', req.user);
    req.logout();

    const redirectUri = getRedirectUriFromRequest(req);
    loggerService.debug('redirecting...', redirectUri);
    res.redirect(redirectUri);
  });

  router.get(
    PATH_AUTH_FACEBOOK,
    (req: Request, res: Response, next: NextFunction) => {
      const redirectUri = getRedirectUriFromRequest(req);
      loggerService.debug('logging in with facebook...', redirectUri);

      passport.authenticate(STRATEGY_FACEBOOK, <AuthenticateOptions> {
        scope: requiredPermissions,
        state: JSON.stringify({redirectUri})
      })(req, res, next);
    }
  );

  router.get(
    PATH_AUTH_FACEBOOK_RESTART,
    (req: Request, res: Response, next: NextFunction) => {
      const redirectUri = getRedirectUriFromRequest(req);
      loggerService.debug('logging in with facebook (clean)...', redirectUri);

      passport.authenticate(STRATEGY_FACEBOOK, <AuthenticateOptions> {
        scope: requiredPermissions,
        authType: 'rerequest',
        state: JSON.stringify({redirectUri})
      })(req, res, next);
    }
  );

  router.get(
    PATH_AUTH_FACEBOOK_CALLBACK,
    passport.authenticate(STRATEGY_FACEBOOK),
    (req: Request, res: Response) => {
      loggerService.debug('logged in with facebook...');

      let redirectUri = PATH_APP;
      try {
        redirectUri = JSON.parse(req.query.state).redirectUri;
      } catch (e) {
        loggerService.error('session parse failed', req.query.state);
      }

      loggerService.debug('redirecting...', redirectUri);
      res.redirect(redirectUri);
    }
  );

  return router;
}
