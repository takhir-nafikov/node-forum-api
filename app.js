const restify = require('restify');
const mongoose = require('mongoose');
const passport = require('passport');
require('./handlers/passport');

const server = restify.createServer();

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({mapParams: true }));

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

server.use(passport.initialize());

//Connect the BodyParser so because otherwise it does not work multer
//I realize that the decision is wrong, but I could not decide otherwise
require('./routes')(server, restify.plugins.bodyParser({mapParams: true}));

server.use((err, req, res, next) => {  
  res.status(500);
  res.json(err);
});

module.exports = server;