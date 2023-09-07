import jwt from 'jsonwebtoken';
import { type Encrypter } from '../../../data/protocols/criptography/encrypter';
import { type Decrypter } from '../../../data/protocols/criptography/decrypter';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  encrypt (value: string): string {
    const accessToken = jwt.sign({ id: value }, this.secret);
    return accessToken;
  }

  decrypt (value: string): string | null {
    const id = jwt.verify(value, this.secret);
    return id as string;
  }
}
