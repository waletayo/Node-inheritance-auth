import ProfileController from './profile.controller';
import ProfileModel from "./profile.model";
import {Router} from "express";

const router = Router();
const profileCtrl = new ProfileController(ProfileModel);

router.route('/profile')
    .post(profileCtrl.create)
    .put(profileCtrl.updateProfile);


export default router;