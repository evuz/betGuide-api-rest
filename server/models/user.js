'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    displayName: String,
    avatar: String,
    password: String,
    signUpDate: { type: Date, default: Date.now() },
    lastLogin: Date,
    statsByMonths: [new Schema({
        id: String,
        winPicks: { type: Number, default: 0 },
        lostPicks: { type: Number, default: 0 },
        voidPicks: { type: Number, default: 0 },
        profits: { type: Number, default: 0 },
        totalOdd: { type: Number, default: 0 },
        totalStake: { type: Number, default: 0 }
    })]
});

UserSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) next(err);
            user.password = hash;
            next();
        })
    })
});

UserSchema.methods.validPassword = function (password) {
    let user = this;
    return bcrypt.compareSync(password, user.password);
}

UserSchema.methods.gravatar = function () {
    if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`;

    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

module.exports = mongoose.model('User', UserSchema);