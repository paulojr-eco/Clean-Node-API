import { InvalidParamError } from 'presentation/errors';
import { type Validation } from './validation';

export class ComprareFieldsValidation implements Validation {
  private readonly fieldName: string;
  private readonly fieldToCompareName: string;
  constructor (fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName;
    this.fieldToCompareName = fieldToCompareName;
  }

  validate (input: any): Error | null {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }
    return null;
  }
}
