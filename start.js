const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE, { useMongoClient: true });
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(err.message);
});

require('./models/User');
require('./models/Theme');
require('./models/Message');


const server = require('./app');
const app = server.listen(process.env.PORT || 3000, () => {
    console.log('ready on %s', server.url);
});