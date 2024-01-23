const bcrypt                = require('bcryptjs');
const jwt                   = require('jsonwebtoken');
const { validationResult }  = require('express-validator');
const User                  = require('../models/user');
const Auth               = require('./authController')
const { SECRET_KEY }        = require('../config/config');

class UserController {

    static async registerUser(req, res) {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {            
            res.status(400).json({error: errors.array()});
            return;
        }
        
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        });        

        try {
            
            const existingUser = await User.getUserByEmail(user.email); 
            if (existingUser.length) {
                res.status(400).json({error: 'User already exist'});
                return;
            }            
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
            const userId = await User.createUser(user);

            res.status(201).json({messsage: 'User registered successfully', userId});
        } catch (error) {            
            res.status(500).json({error: 'Server error'});
        };
    };

    static async login(req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()});
        }

        try {
            const user = await User.getUserByEmail(req.body.email);
            
            if (!user.length) {
                res.status(400).json({error: 'User is not registered'});
                return;
            }              
            const isPasswordValid = await bcrypt.compare(req.body.password, user[0].password)
            if (!isPasswordValid) {
                return res.status(401).json({error: 'Invalid credentials'});
            }
            const accessToken = Auth.generateAccessToken(user[0].userId);

            res.status(200).json({accessToken});

        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'Server error'});
        }
    };

    static async auth(req, res){
        try {       
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
        
            if (token == null) return res.sendStatus(401);
        
            const isValid = Auth.authenticateToken(token);
            if (!isValid.valid) {
                return res.status(401).json({error: 'Invalid token'});
            }

            return res.status(200).json({status: 'Ok'});

        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'Server error'});
        }
    };
}

module.exports = UserController;