import { loginPath } from './paths/login-path';
import { badRequest, serverError, unauthorized } from './components';
import { accountSchema, errorSchema, loginParamsSchema } from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API com objetivo de construir enquetes sobre temas diversos',
    version: '2.2.0',
    license: {
      name: 'MIT License',
      url: 'https://github.com/paulojr-eco/Clean-Node-API/blob/main/LICENSE'
    }
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
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    serverError,
    unauthorized
  }
};
