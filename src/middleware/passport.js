'use strict';
import User from "../api/auth/register/register.model";
import {INVALID} from "../utils/status-codes";

const Jwtstra = require("passport-jwt").Strategy;
const ExtJwt = require("passport-jwt").ExtractJwt;


const opts = {};
opts.jwtFromRequest = ExtJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = app.superSecret;
module.exports = passport => {
    passport.use(
        new Jwtstra(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false, INVALID);
                })
                .catch(err => {
                    if (err) {
                        return done(err, null);
                    }
                });
        })
    );
};
