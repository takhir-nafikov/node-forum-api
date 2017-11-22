const mongoose = require('mongoose');
const Message = mongoose.model('Message');
const Theme = mongoose.model('Theme');
const User = mongoose.model('User');

exports.addMessage = async (req, res) => {
    req.body.author = req.userId;
    req.body.theme = req.params.idTheme;
    const message = await (new Message(req.body)).save();
    res.status(201);
    res.json({success: true, id: message._id});
};

exports.getMessages = async (req, res) => {
    const page = req.params.page || 1;
    const limit = req.params.limit || 4;
    const skip = (page * limit) - limit;

    const messagePromise = Message
    .find()
    .skip(skip)
    .limit(limit);

    //Find the number of records for counting the number of pages
    const countPromise = Message.count({theme: req.params.idTheme});

    const [messages, count] = await Promise.all([messagePromise, countPromise]);
    const pages = Math.ceil(count / limit);
    //If the user requested a nonexistent page
    if (!messages.length && skip) {
        return res.json({success: false, message:`You asked for page ${page}. But that doesn't exist`})
    }
    res.json({success: true, pages:pages, messages: messages});
};

exports.getMessage = async (req, res) => {
    const message = await Message.findOne({_id: req.params.idMessage, theme: req.params.idTheme});
    if(!message){
        return res.json({success: false, message: 'Not found message'});
    }
    res.json({success: true, message: message});
};

exports.updateMessage = async (req, res) => {
    const updateMessage = await Message.findOne({_id: req.params.idMessage, theme: req.params.idTheme});
    if (!updateMessage.author.equals(req.userId)) {
        res.status(403);
        return res.json({success: false, message: 'You must own a message in order to edit it!'});
    }
    updateMessage.text = req.body.text;
    await updateMessage.save();
    res.json({success: true, message: 'Successfully update'});
};

exports.deleteMessage = async (req, res) => {
    const deleteMessage = await Message.findOne({_id: req.params.idMessage, theme: req.params.idTheme});
    if (!deleteMessage.author.equals(req.userId)) {
        return res.json({success: false, message: 'You must own a message in order to edit it!'});
    }
    await deleteMessage.remove();
    res.json({success: true, message: 'Successfully delete'});
};

exports.likeMessage = async (req, res) => {
    const message = await Message.findOne({_id: req.params.idMessage, theme: req.params.idTheme});
    if(!message){
        return res.json({success: false, message: 'Not found message'});
    }
    const userL = await User.findById(req.userId);
    if (!userL) {
        res.status(404);
        return res.send("No user found.");
    }
    //Check did the user like this message
    const likes = userL.likes.map((obj) => obj.toString());
    const operator = likes.includes(req.params.idMessage) ? '$pull' : '$addToSet';
    // if yes then delete else put 
    const user = await User
        .findByIdAndUpdate(req.userId,
            {[operator]: {likes: req.params.idMessage}},
            {new: true},
        );
    res.json({success: true});
};