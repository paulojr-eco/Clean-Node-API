import { loginPath, surveyPath, signUpPath } from './paths';
import { badRequest, serverError, unauthorized, forbidden } from './components';
import { accountSchema, errorSchema, loginParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema, apiKeyAuth, signUpParamsSchema, addSurveyParamsSchema } from './schemas';

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
    },
    {
      name: 'Enquetes'
    }
  ],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath,
    '/signup': signUpPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    signUpParams: signUpParamsSchema,
    addSurveyParams: addSurveyParamsSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth
    },
    badRequest,
    serverError,
    unauthorized,
    forbidden
  }
};
