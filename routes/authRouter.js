import express from 'express';
import {register, login, logout, getCurrent} from '../controllers/authControllers.js';
import validateBody from '../helpers/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import authenticate from '../middleware/authenticate.js';
import { updateSubscription } from '../controllers/authControllers.js';
import { updateSubscriptionSchema } from '../schemas/authSchemas.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), register);
authRouter.post('/login', validateBody(loginSchema), login);
authRouter.post('/logout', authenticate, logout);
authRouter.get('/current', authenticate, getCurrent);
authRouter.patch('/subscription', authenticate, validateBody(updateSubscriptionSchema), updateSubscription);

export default authRouter;