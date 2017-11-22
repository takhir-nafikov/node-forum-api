const {JwtStrategy, ExtractJwt} = require('passport-jwt');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      User.findOne({id: jwt_payload.id}, (err, user) =>{
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
  };