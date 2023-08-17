import { RequiredFieldValidation } from 'presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { makeSignUpValidation } from './signup-validation';
import { type Validation } from 'presentation/helpers/validators/validation';
import { ComprareFieldsValidation } from 'presentation/helpers/validators/compare-fields-validation';

vi.mock('../../presentation/helpers/validators/validation-composite');

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new ComprareFieldsValidation('password', 'passwordConfirmation'));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
