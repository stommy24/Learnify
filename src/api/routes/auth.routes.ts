import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateLogin, validateRegister } from '../validators/auth.validator';

const router = express.Router();
const controller = new AuthController();

router.post('/login', validateLogin, controller.login);
router.post('/register', validateRegister, controller.register);
router.post('/refresh-token', controller.refreshToken);
router.post('/reset-password', controller.requestPasswordReset);
router.post('/reset-password/confirm', controller.resetPassword);

export default router; 