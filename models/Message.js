const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const messageSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author',
    },
    theme: {
        type: mongoose.Schema.ObjectId,
        ref: 'Theme',
        required: 'You must supply a store',
    },
    text: {
        type: String,
        required: 'You review must have text',
    },
});

/**
 * 
 * @param {*} next 
 */
function autopopulate(next) {
    this.populate('author', 'name');
    next();
};

messageSchema.pre('find', autopopulate);
messageSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Message', messageSchema);