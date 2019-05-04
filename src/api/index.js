import config from 'config';
import apiAuth from '../middleware/api'
import register from "./auth/register/register.route";
import login from "./auth/login/login.router";
import errorHandler from '../setup/errors'
import profile from "../api/profile/profile.route";

const prefix = config.get('api.prefix');
import Q from 'q';

/**
 * The routes will add all the application defined routes
 * @param {app} app The app is an instance of an express application
 * @return {Promise<void>}
 */
export default (app) => {// app.use(prefix, apiAuth);
    app.use(prefix, register);
    app.use(prefix, login);
    app.use(prefix, profile);
    // app.use(prefix, apiAuth);
    // check url for state codes     and api version


    app.use(errorHandler);
    return Q.resolve(app);
};
