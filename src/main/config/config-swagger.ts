import swaggerConfig from '@/main/docs';
import { type Express } from 'express';
import { bodyParser } from '../middlewares';
import { serve, setup } from 'swagger-ui-express';

export default (app: Express): void => {
  app.use(bodyParser);
  app.use('/api-docs', serve, setup(swaggerConfig));
};
