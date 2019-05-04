import {Router} from 'express';
import LoginCtrl from "./login.controller"
import UserModel from "../register/register.model";

const Ctrl = new LoginCtrl(UserModel);
const router = Router();


router.route('/login')
    .post(Ctrl.userLogin);

export default router;