import env from '../../../main/config/env';
import { type Controller } from '../../../presentation/protocols';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { LogControllerDecorator } from '../../../main/decorators/log-controller-decorator';
import { makeLoginValidation } from './login-validation-factory';
import { DbAuthentication } from '../../../data/usecases/authenticantion/db-authentication';
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo-repository';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-respoitory';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter';

export const makeLoginController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation()
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logMongoRepository);
};
