import mongoose from 'mongoose';
import Validator from 'validatorjs';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    isverified: {
        type: Boolean,
        default: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

/**
 * @param {Object} obj The object to perform validation on
 * @return {Validator} The validator object with the specified rules.
 */
UserSchema.statics.validateCreate = (obj) => {
    let rules = {
        name: 'required',
        username: 'required',
        phoneNumber: 'required',
        email: 'required',
        password: 'required'
    };
    return new Validator(obj, rules);
};

/**
 * @typedef UserSchema
 */
export default mongoose.model('user', UserSchema);