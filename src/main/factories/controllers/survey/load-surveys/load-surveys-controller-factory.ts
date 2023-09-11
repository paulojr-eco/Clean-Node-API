import { type Controller } from '../../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory';
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-survey/load-survey-controller';
import { makeDbLoadSurveys } from '../../../../../main/factories/usecases/survey/load-surveys/db-add-survey-factory';

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys());
  return makeLogControllerDecorator(controller);
};
