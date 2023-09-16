import { loginPath } from './paths/login-path';
import { accountSchema } from './schemas/account-schema';
import { loginParamsSchema } from './schemas/login-params-schema';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API com objetivo de construir enquetes sobre temas diversos',
    version: '2.2.0'
  },
  servers: [
    {
      url: '/api',
      description: 'Servidor Principal'
    }
  ],
  tags: [
    {
      name: 'Login'
    }
  ],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema
  }
};
