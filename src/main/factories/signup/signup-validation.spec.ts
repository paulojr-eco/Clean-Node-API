import {
  RequiredFieldValidation,
  ComprareFieldsValidation,
  EmailValidation,
  ValidationComposite
} from '../../../presentation/helpers/validators';
import { makeSignUpValidation } from './signup-validation';
import { type Validation } from '../../../presentation/protocols/validation';
import { type EmailValidator } from '../../../presentation/protocols/email-validator';

vi.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new ComprareFieldsValidation('password', 'passwordConfirmation')
    );
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
