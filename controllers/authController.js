const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');



exports.login = async (req, res) => {
    const user = await User.findOne({email: req.body.email}); 
    if (!user) {
        res.status(401);
        return res.json({success: false, message: 'Authentication failed. User not found'});
    }
        // check if password matches
    user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
            // if user is found and password is right create a token
            let token = jwt.sign(user.toJSON(), process.env.SECRET, {
                expiresIn: 86400 // expires in 24 hours
              });
            // return the information including token as JSON
            res.json({success: true, message: 'Authentication success', token: token});
        } else {
            res.status(401);
            res.json({success: false, message: 'Authentication failed. Wrong password'});
        }
    });
};

exports.verifyToken = (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (!token){
        res.status(403);
        return res.send({ success: false, message: 'No token provided'}); 
    }
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            res.status(500);
            return res.send({ success: false, message: 'Failed to authenticate token'});
        }
        //Send to red to then find user
        req.userId = decoded._id;
        console.log('hi now i send decoded id ' + req.userId);
        next();
    });
};

exports.forgot = async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        res.status(404);
        return req.json({success: false, message: 'No account with that email exists'});
    }

    user.resetPasswordToken = crypto.randomBytes(20).toString('hex'); //generate token, we will be looking for a user on this token 
    user.resetPasswordExpires = Date.now() + 3600000; // expires in 24 hours
    await user.save();

    res.json({success: true, message: 'You can update password during 24 hours', token: user.resetPasswordToken});
};

exports.update = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.body.token,
        resetPasswordExpires: {$gt: Date.now()}, //did 24 hours pass
    });
    if (!user) {
        res.status(404);
        return res.json({success: false, message:  'Password reset is invalid or has expired'});
    }
    user.password = req.body.password;
    
    // password changed, no data needed
    user.resetPasswordToken = undefined; 
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({success: true, message: 'Your password has been reset'});
};