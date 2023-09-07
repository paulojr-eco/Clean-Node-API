import { type Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route-adapter';
import { makeAddSurveyController } from '../../main/factories/controllers/add-survey/add-survey-controller-factory';

export default (router: Router): void => {
  /* eslint-disable @typescript-eslint/no-misused-promises */
  router.post('/surveys', adaptRoute(makeAddSurveyController()));
};
