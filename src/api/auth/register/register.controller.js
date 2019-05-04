import AppController from '../../core/app.controller';
import crypto from "crypto";
import bcrypt from "bcryptjs";
import sendGrid from "../../../middleware/mailer";
import User from "./register.model";
import {
    BAD_REQUEST,
    CATCH,
    CONFLICT,
    CREATED,
    EXIST, FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    INVALID,
    NOT_FOUND,
    NOUSER, SUCESS, VERIFIED
} from "../../../utils/status-codes";
import Token from "../../../middleware/verifyToken";
import logger from "../../../utils/logger";

/**
 * The App controller class where other controller inherits or
 * overrides pre defined and existing properties
 */
class RegisterController extends AppController {
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
        User.findOne({email: req.body.email})
            .then(user => {
                if (user) {
                    return res.status(CONFLICT).json({
                        status: CONFLICT,
                        message: EXIST,
                    })
                } else {
                    let obj = req.body;
                    const newUser = User(obj);
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    let token = new Token({
                                        user: user._id,
                                        token: crypto.randomBytes(16).toString('hex')
                                    });
                                    token.save((err) => {
                                        if (err) {
                                            return res.status(INTERNAL_SERVER_ERROR).json({
                                                status: false,
                                                code: INTERNAL_SERVER_ERROR,
                                                message: CATCH
                                            })
                                        }
                                        let sendEmail = sendGrid.sendMail("no-reply@movement", user.email, "Account Verification Token",
                                            "Hello    // _userId: user._id," + user.name + " \n" +
                                            ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api/reg/confirm\/' + token.token + '.\n');

                                        if (sendEmail) {
                                            logger.log("send email success", sendEmail);
                                        } else {
                                            logger.log("send email failed", sendEmail);
                                        }
                                        logger.log("user:", user);
                                        res.json({
                                            status: true,
                                            message: "signup successful and an email have been sent to" + req.body.email + "your auth token" + token.token,
                                            data: user
                                        });
                                    });
                                })
                                .catch(err => {
                                    return res.status(INTERNAL_SERVER_ERROR).json({
                                        status: false,
                                        code: INTERNAL_SERVER_ERROR,
                                        data: err
                                    })
                                })
                        })
                    })
                }
            })
    }


    /**
     * @param{Object} req this hold the request parameter of the end point
     * @param{Object} res this holds the response parameter of the endpoint
     * @param{object} next this holds the next action incase of a  delay or error
     * */
    confimEmail(req, res, next) {
        let token = req.params.token;
        Token.findOne({token: token}, (err, userToken) => {
            if (!userToken) {
                return res.status(NOT_FOUND).json({
                    status: INVALID,
                    code: NOT_FOUND,
                    message: INVALID
                })
            }
            if (userToken) {
                User.findById(userToken.user, (err, user) => {
                    if (!user) {
                        return res.status(NOT_FOUND).json({
                            status: false,
                            code: NOT_FOUND,
                            message: NOUSER
                        })
                    }
                    if (user.isverified) {
                        return res.status(FORBIDDEN).json({
                            status: false,
                            code: FORBIDDEN,
                            message: VERIFIED
                        })
                    }
                    user.isverified = true;
                    user.save(err => {
                        if (err) {
                            return res.status(BAD_REQUEST).json({
                                status: false,
                                code: BAD_REQUEST,
                                message: CATCH
                            })
                        } else {
                            return res.status(CREATED).json({
                                status: true,
                                code: CREATED,
                                message: SUCESS
                            })
                        }
                    })
                })
            }

        })


    }

    /**
     * @param{Object} req this hold the request parameter of the end point
     * @param{Object} res this holds the response parameter of the endpoint
     * @param{object} next this holds the next action incase of a  delay or error
     * */

    resendEmail(req, res, next) {
        User.findOne({email: req.body.email}, (err, user) => {
            if (!user) {
                return res.status(NOT_FOUND).json({
                    status: false,
                    code: NOT_FOUND,
                })
            }
            if (user.isverified) {
                return res.status(CREATED).json({
                    status: false,
                    code: CREATED,
                    message: VERIFIED
                })
            }
            let token = new Token({
                _userId: user._id, token: crypto.randomBytes(16).toString('hex')
            });
            token.save(err => {
                if (err) {
                    return res.status(BAD_REQUEST).json({
                        status: false,
                        message: err
                    })
                }
                let sendEmail = sendGrid.sendMail("no-reply@movement", user.email, "Account Verification Token",
                    "Hello " + user.name + " \n" +
                    ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n');

                if (sendEmail) {
                    logger.log("send email success", sendEmail);
                } else {
                    logger.log("send email failed", sendEmail);
                }
                logger.log("user:", user);
                res.status(CREATED).json({
                    status: true,
                    message: "Email have been resent to " + req.body.email + "your auth token" + token.token,
                    data: user
                });

            })
        })


    }
}


export default RegisterController;