const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    token: {
        type: String,
        required: true
    },

}, {timestamps: true});

const token = mongoose.model('tokenSchema', tokenSchema,);
module.exports = token;
