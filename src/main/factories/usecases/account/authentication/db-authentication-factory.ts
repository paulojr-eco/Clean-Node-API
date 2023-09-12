import env from '@/main/config/env';
import { DbAuthentication } from '@/data/usecases/account/authenticantion/db-authentication';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-respoitory';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter';
import { type Authentication } from '@/domain/usecases/account/authentication';

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
};
