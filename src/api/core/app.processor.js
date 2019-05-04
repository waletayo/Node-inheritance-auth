import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcryptjs"

const superSecret = config.get('app.superSecret');
const expiresIn = config.get('app.auth.expiresIn');

export const signToken = (obj) => {
    return jwt.sign(obj, superSecret, {expiresIn});
};


// bcrypt.genSalt(10, (err, salt) => {

