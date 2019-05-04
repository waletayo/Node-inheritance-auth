import {Router} from 'express';
import UserModel from './register.model';
import RegisterController from './register.controller';

const router = Router();
const regCtrl = new RegisterController(UserModel);

router.route('/user')
    .post(regCtrl.create)
    .post(regCtrl.confimEmail)
    .post(regCtrl.resendEmail);

export default router;