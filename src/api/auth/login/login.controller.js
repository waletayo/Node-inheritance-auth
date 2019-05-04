import User from "../register/register.model";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import {
    BAD_REQUEST,
    CATCH,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    OK,
    UNAUTHORIZED,
    VERIFY
} from "../../../utils/status-codes";
import AppController from "../../core/app.controller";
import config from "config";

const superSecret = config.get('app.superSecret');
const expiresIn = config.get('app.expiresIn');

class LoginController extends AppController {


    constructor(name) {
        super(name);

        this.userLogin = this.userLogin.bind(this)
    }

    userLogin(req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        User.findOne({email: email})
            .then(user => {
                if (!user) {
                    return res.status(NOT_FOUND).json({
                        status: false,
                        code: NOT_FOUND,
                        data: user
                    })
                }
                bcrypt.compare(password, user.password, (error, isMatch) => {
                    if (error) {
                        return res.status(BAD_REQUEST).json({
                            status: false,
                            code: BAD_REQUEST,
                            error: error
                        });
                    }
                    if (isMatch) {
                        if (!user.isverified) {
                            return res.status(UNAUTHORIZED).json({
                                status: false,
                                code: UNAUTHORIZED,
                                message: user.email + VERIFY
                            })
                        }
                        const payload = {id: user.id};
                        jwt.sign(payload, superSecret, {expiresIn}, (error, token) => {
                            return res.status(OK).json({
                                status: true,
                                code: OK,
                                message: "Login success",
                                data: {
                                    token: token,
                                    user: user
                                }
                            })
                        });
                        return next();
                    }
                })

            }).catch(error => {
            return res.status(INTERNAL_SERVER_ERROR).json({
                status: false,
                code: INTERNAL_SERVER_ERROR,
                message: CATCH,
                error: error
            })

        })
    };
}

export default LoginController;