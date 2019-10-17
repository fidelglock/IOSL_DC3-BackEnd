'use strict';

const models = require('../models/index');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var config = require('./authKeys');

module.exports = function (app, passport) {

    //google token strategy
    passport.use('google-token', new GoogleTokenStrategy({
        clientID: config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret
    },
        function (accessToken, refreshToken, profile, done) {
            //upsert the user to our local db and store it's profile information or return user profile
            models.personsModel.upsertGoogleUser(accessToken, refreshToken, profile, function (err, user) {                
                return done(err, user);
            });
        }));
};