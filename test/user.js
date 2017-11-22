const mongoose = require('mongoose');
const User = require('../models/User');
const chai = require('chai');
const chatHttp = require('chai-http');
const should = chai.should();

mongoose.connect('mongodb://127.0.0.1/testforumapi', { useMongoClient: true });
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(err.message});
});

require('../models/Theme');
require('../models/Message');

const server = require('../app');
const app = server.listen(3000, () => {
    console.log('ready on %s', server.url);
});

let TOKEN;
chai.use(chatHttp);

describe('User', () =>{
    describe('Register', () => {
        it('register without email', (done) => {
            let user = {
                email: '',
                name: 'WW',
                password: '1954',
                passwordConfirm: '1954'
            };
            chai.request(app)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('All fields must be filled');
                    res.body.should.have.property('success').eql(false);
                    done();
                });
        });
        
        it('register with incorrect email', (done) => {
            let user = {
                email: 'ww#ww.com',
                name: 'WW',
                password: '1954',
                passwordConfirm: '1954'
            };
            chai.request(app)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Invalid email');
                    res.body.should.have.property('success').eql(false);
                    done();
                });
        });
    
        it('register with different password', (done) => {
            let user = {
                email: 'ww@ww.com',
                name: 'WW',
                password: '1954',
                passwordConfirm: '1955'
            };
            chai.request(app)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Your passwords do not match');
                    res.body.should.have.property('success').eql(false);
                    done();
                });
        });
    
        it('register with exist email', (done) => {
            let user = {
                email: 'ww@ww.com',
                name: 'WW',
                password: '1954',
                passwordConfirm: '1954'
            };
    
        
            chai.request(app)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User with this email exist');
                    res.body.should.have.property('success').eql(false);
                    done();
                }); 
        });

        it('register new user', (done) => {
            let user = {
                email: 'WW@WW.com',
                name: 'WW',
                password: '1954',
                passwordConfirm: '1954'
            };
            chai.request(app)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Successful created new user');
                    res.body.should.have.property('success').eql(true);
                    done();
                });
        });
    
    });
    
    describe('Login', () => {
        it('login without register', (done) => {
            let user = {
                email: 'EE@WW.com',
                password: '1954'
            };
            chai.request(app)
                .post('/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Authentication failed. User not found');
                    res.body.should.have.property('success').eql(false);
                    done();
                });
        });
    
        it('login with incorrect password', (done) => {
            let login = {
                email: 'WW@WW.com',
                password: '12412'
            }

            chai.request(app)
            .post('/login')
            .send(login)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Authentication failed. User not found');
                res.body.should.have.property('success').eql(false);
                done();
            });
                
        });

        it('login', (done) => {
            let login = {
                email: 'WW@WW.com',
                password: '1954'
            }
            chai.request(app)
            .post('/login')
            .send(login)
            .end((err, res) => {
                console.log(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Authentication success');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('token');
                done()
            });
        });
    });
});
