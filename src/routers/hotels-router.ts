import { Router } from 'express';
import { showHotels } from '@/controllers/hotels-controller';
import { authenticateToken, validateSteps } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken, validateSteps).get('/', showHotels).get('/:hotelsId', showHotels);

export { hotelsRouter };
