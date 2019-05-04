import mongoose from 'mongoose';
import Validator from 'validatorjs';

const Schema = require("mongoose");

/**
 * User Schema
 */
const ProfileSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    Pmedia: {
        type: Schema.Types.ObjectId,
        ref: 'profileImage'
    },

    handle: {
        type: String,
    },

    Nickname: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    facebook: {
        type: String,
    },
    bio:{
      type:String,
      required:true
    },
    linkdin: {
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
ProfileSchema.statics.validateCreate = (obj) => {
    let rules = {
        handle: 'required',
        Nickname: 'required',
        facebook: 'required',
        linkdin: 'required',
    };
    return new Validator(obj, rules);
};

/**
 * @typedef UserSchema
 */
export default mongoose.model('profile', ProfileSchema);