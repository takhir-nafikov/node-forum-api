const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: 'Please Supply an email adderess',
    },
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    photo: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    likes: [
        {type: mongoose.Schema.ObjectId, ref: 'Message'},
    ]
});

userSchema.pre('save', function(next) {
    if (this.isModified('password') || this.isNew) this.password = bcrypt.hashSync(this.password, 12);
    next();
});

userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
