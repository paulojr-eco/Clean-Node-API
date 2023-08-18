import jwt from 'jsonwebtoken';
import { type Encrypter } from 'data/protocols/criptography/encrypter';

export class JwtAdapter implements Encrypter {
  private readonly secret;
  constructor (secret: string) {
    this.secret = secret;
  }

  encrypt (value: string): string {
    const accessToken = jwt.sign({ id: value }, this.secret);
    return accessToken;
  }
}
