import { forbidden, serverError, successful } from '@/presentation/helpers/http/http-helper';
import { LoadSurveyResultController } from './load-survey-result-controller';
import {
  type LoadSurveyById,
  type HttpRequest
} from './load-survey-result-controller-protocols';
import { mockLoadSurveyById } from '@/data/test';
import { InvalidParamError } from '@/presentation/errors';
import { mockSurveyResultModel, throwError } from '@/domain/test';
import { mockLoadSurveyResult } from '@/presentation/test';
import { type LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const loadSurveyResultStub = mockLoadSurveyResult();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub);
  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  };
};

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
});

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = vi.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(mockRequest());
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should return 403 if LoadSurveyByUd returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    vi.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(
      Promise.resolve(null)
    );
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    vi.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
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
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(
      serverError(new Error('Error while handle load survey result'))
    );
  });

  test('Should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut();
    const loadSpy = vi.spyOn(loadSurveyResultStub, 'load');
    await sut.handle(mockRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut();
    vi.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(successful(mockSurveyResultModel()));
  });
});
