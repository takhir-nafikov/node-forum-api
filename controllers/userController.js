const mongoose = require('mongoose');
const User = mongoose.model('User');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const validator = require('validator');
const path = require('path');


const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            next({ message: 'That filetype isn\'t allowed!'}, false);
        }
        else {
            next(null, true)
        }
    },
};

exports.upload = multer(multerOptions).single('photo');

exports.setAvatar = async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) {
        res.status(404);
        return res.json({success: false, message: 'User not found'})
    }
    user.photo = req.photo;
    await user.save();
    res.json({success: true, message: 'avatar downloaded'});
}; 

exports.resize = async (req, res, next) => {
    // check if there is no new file to resize
    if (!req.file) {
        next();
        return;
    }
    const ext = path.extname(req.file.originalname);
    //give a unique name with the current extension
    req.photo = `${uuid.v4()}${ext}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(400, jimp.AUTO);
    await photo.write(`./public/uploads/${req.photo}`);
    next();
};

exports.validateRegister = (req, res, next) => {
    if (validator.isEmpty(req.body.email) || validator.isEmpty(req.body.name) 
        || validator.isEmpty(req.body.password) || validator.isEmpty(req.body.passwordConfirm)){
            res.status(409);
            return res.json({success: false, message: 'All fields must be filled'});
    }
    if (!validator.isEmail(req.body.email)){
        res.status(409);
        return res.json({success: false, message: 'Invalid email'})
    }
    if (!validator.equals(req.body.password, req.body.passwordConfirm)){
        res.status(409);
        return res.json({success: false, message: 'Your passwords do not match'})
    }
    validator.normalizeEmail(req.body.email, {
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    next();
};

exports.register = async (req, res) => {
    const isExist = await User.findOne({email: req.body.email});
    if (isExist){
        res.status(409);
        return res.json({success: false, message: 'User with this email exists'});
    }
    const user = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
    });
    await user.save();
    res.status(201);
    res.json({success: true, message: 'Successful created new user'});
};

exports.me = async (req, res) => {
    const user = await User.findById(req.userId, { password: 0 });
    if (!user) {
        res.status(404);
        return res.json({success: false, message: 'Not found user'});
    }
    res.json({success:true, user: user});
};

exports.update = async (req, res) => {
    const updates = {
        name: req.body.name,
    };

    const user = await User.findOneAndUpdate(
        {_id: req.user._id},
        {$set: updates},
        {new: true, runValidators: true, context: 'query'},
    );
    res.json({success: true, message: 'Update successful'});
};