const mongoose = require('mongoose');
const Theme = mongoose.model('Theme');
const User = mongoose.model('User');

exports.getThemes = async (req, res) => {
    const page = req.params.page || 1;
    const limit = req.params.limit || 4;
    const skip = (page * limit) - limit;

    const themePromise = Theme
    .find()
    .skip(skip)
    .limit(limit)
    .sort({created: 'desc'});

    //Find the number of records for counting the number of pages
    const countPromise = Theme.count();

    const [themes, count] = await Promise.all([themePromise, countPromise]);
    const pages = Math.ceil(count / limit);
    //If the user requested a nonexistent page
    if (!themes.length && skip) {
        return res.json({success: false, message:`You asked for page ${page}. But that doesn't exist`})
    }
    res.json({success: true, pages:pages, themes: themes});
};

exports.getTheme = async (req, res) => {
    const theme = await Theme.findOne({_id: req.params.id}).populate('author', 'name');
    if (!theme) {
        return res.json({success: false, message: 'No theme with that email slug.'});
    } 
    res.json({success: true, theme: theme});
};

exports.createTheme = async (req, res) => {
    req.body.author = req.userId;
    const theme = await (new Theme(req.body)).save();
    res.status(201);
    res.json({success: true, id: theme._id});
};

exports.confirmOwner = async (req, res, next) => {
    const theme = await Theme.findOne({_id: req.params.id});
    if (!theme.author.equals(req.userId)) {
        res.status(403);
        return res.json({success: false, message: 'You must own a theme in order to edit it'});
    }
    next(); 
};

exports.updateTheme = async (req, res) => {
    const theme = await Theme.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true,
        runValidators: true,
    }).exec();
    res.json({success: true, message: `Successfully updated ${theme.name}`});
};

exports.deleteTheme = async (req, res) => {
    const theme = await Theme.findOneAndRemove({_id: req.params.id}).exec();
    res.json({success: true, message: `Successfully deleted ${theme.name}`});
};