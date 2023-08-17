import { MissingParamError } from 'presentation/errors';
import { type Validation } from './validation';

export class RequiredFiedlValidation implements Validation {
  private readonly fieldName: string;
  constructor (fieldName: string) {
    this.fieldName = fieldName;
  }

  validate (input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
    return null;
  }
}
