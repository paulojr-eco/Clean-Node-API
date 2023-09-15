import { MissingParamError } from '@/presentation/errors';
import { type Validation } from '@/presentation/protocols';
import { ValidationComposite } from './validation-composite';
import { mockValidation } from '../test';

type SutTypes = {
  sut: ValidationComposite
  validationStubs: Validation[]
};

const makeSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()];
  const sut = new ValidationComposite(validationStubs);
  return {
    sut,
    validationStubs
  };
};

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();
    vi.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
      new MissingParamError('field')
    );
    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut();
    vi.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
      new Error()
    );
    vi.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(
      new MissingParamError('field')
    );
    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new Error());
  });

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: 'any_value' });
    expect(error).toBeFalsy();
  });
});
