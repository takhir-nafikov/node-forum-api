const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const themeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a theme name!',
    },
    description: {
        type: String,
        trim: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

themeSchema.virtual('messages', {
    ref: 'Message', 
    localField: '_id',
    foreignField: 'theme',
});

/**
 * 
 * @param {*} next 
 */
function autopopulate(next) {
    this.populate('messages');
    next();
}

themeSchema.pre('find', autopopulate);
themeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Theme', themeSchema);