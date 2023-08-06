import { type Router } from 'express';
import { makeSignUpController } from '../../main/factories/signup';
import { adaptRoute } from '../../main/adapters/express-route-adapter';

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/signup', adaptRoute(makeSignUpController()));
};