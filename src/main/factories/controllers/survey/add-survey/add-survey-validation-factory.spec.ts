import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { makeAddSurveyValidation } from './add-survey-validation-factory';
import { type Validation } from '@/presentation/protocols/validation';

vi.mock('@/validation/validators/validation-composite');

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation();
    const validations: Validation[] = [];
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
