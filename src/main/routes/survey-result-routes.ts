import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory';
import { type Router } from 'express';
import { adaptRoute } from '../adapters/express-route-adapter';
import { auth } from '../middlewares/auth';

export default (router: Router): void => {
  /* eslint-disable @typescript-eslint/no-misused-promises */
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()));
};
