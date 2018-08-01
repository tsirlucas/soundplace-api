import {SubscriptionController} from 'controllers';
import {Router} from 'express';

export const importationRouter = Router();

importationRouter.get('/', SubscriptionController.getInstance().importData);
