import { forbidden, serverError } from '@/presentation/helpers/http/http-helper';
import { LoadSurveyResultController } from './load-survey-result-controller';
import {
  type LoadSurveyById,
  type HttpRequest
} from './load-survey-result-controller-protocols';
import { mockLoadSurveyById } from '@/data/test';
import { InvalidParamError } from '@/presentation/errors';
import { throwError } from '@/domain/test';

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub);
  return {
    sut,
    loadSurveyByIdStub
  };
};

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
});

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = vi.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(makeFakeRequest());
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should return 403 if LoadSurveyByUd returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    vi.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(
      Promise.resolve(null)
    );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 500 if LoadSurveyByUd throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    vi.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should throw a generic error if some dependency throws an error that is not a instance of Error', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    vi.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(
      async () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        return await Promise.reject(null);
      }
    );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      serverError(new Error('Error while handle load survey result'))
    );
  });
});
