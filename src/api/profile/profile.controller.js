import AppController from "../core/app.controller";
import Profile from "./profile.model";
import _ from "underscore";
import {
    CATCH,
    CREATED,
    INTERNAL_SERVER_ERROR,
    NOUSER,
    SUCESS,
    UNABLE_TO_UPDATE,
    UPDATED
} from "../../utils/status-codes";

/**
 * The App controller class where other controller inherits or
 * overrides pre defined and existing properties
 */
class ProfileController extends AppController {
    /**
     * @param {Model} model The default model object
     * for the controller. Will be required to create
     * an instance of the controller
     */
    constructor(model) {
        super(model);
    }

    /**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {function} next The callback to the next program handler
     * @return {Object} res The response object
     */
    create(req, res, next) {
        let obj = req.body;
        _.extend(obj, {user: req.user.id});
        let profile = new Profile(obj);
        profile.save((error, saveProfile) => {
            if (error) {
                return res.status(INTERNAL_SERVER_ERROR).json({
                    status: false,
                    code: INTERNAL_SERVER_ERROR,
                    message: CATCH
                })

            }
            if (saveProfile) {
                return res.status(CREATED).json({
                    status: true,
                    message: SUCESS,
                    code: CREATED,
                    data: saveProfile
                })
            }
        })
    }

    /**
     * @param{Object} req this hold the request parameter of the end point
     * @param{Object} res this holds the response parameter of the endpoint
     * @param{function} next this holds the next action incase of a  delay or error
     * */

    updateProfile(req, res) {
        let obj = req.body;
        _.extend(obj, {user: req.user.id});
        Profile.findOne({user: obj.user}, (err, profile) => {
            if (err) {
                return res.status(INTERNAL_SERVER_ERROR).json({
                    status: false,
                    message: NOUSER,
                    code: INTERNAL_SERVER_ERROR
                });
            }

            _.assign(profile, obj);
            profile.save((err, updatedProfile) => {
                if (err) {
                    return res.status(INTERNAL_SERVER_ERROR).json({
                        status: false,
                        message: UNABLE_TO_UPDATE,
                        code: INTERNAL_SERVER_ERROR
                    });
                }

                if (updatedProfile) {
                    return res.status(CREATED).json({
                        status: false,
                        message: UPDATED,
                        code: 200,
                        data: updatedProfile
                    });
                }
            })
        })


    }


}

export default ProfileController;