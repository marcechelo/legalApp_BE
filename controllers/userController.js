const bcrypt                = require('bcryptjs');
const { validationResult }  = require('express-validator');
const User                  = require('../models/user');
const Auth                  = require('./authController')

class UserController {

    static async registerUser(req, res) {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {            
            res.status(400).json({error: 'Validations error', code: 'e003', message: errors.array()[0].msg});
            return;
        }
        
        const user = new User({
            firstName:  req.body.firstName,
            lastName:   req.body.lastName,
            email:      req.body.email,
            id:         req.body.id,
            phone:      req.body.phone
        });        

        try {
            
            let existingUser = await User.getUser('email', user.email); 
            if (existingUser.length) {
                res.status(400).json({error: 'User', code: 'u001', msg: 'El usuario con ese correo ya existe'});
                return;
            };

            existingUser = await User.getUser('id', user.id); 
            if (existingUser.length) {
                res.status(400).json({error: 'User', code: 'u002', msg: 'El usuario con esa identificación ya existe'});
                return;
            };

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
            const userId = await User.createUser(user);

            res.status(200).json({msg: 'El usuario se registro correctamente', code: 'u003'});

        } catch (error) {
            console.error(error)
            res.status(500).json({error: 'Server', code: 'e001', msg: 'Error de servidor'});
        };
    };

    static async login(req, res){

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({error: 'Validations error', code: 'e003', message: errors.array()[0].msg});
        }

        try {
            const user = await User.getUser('email', req.body.email);
            if (!user.length) {
                res.status(400).json({error: 'User', code: 'u004', msg: 'El usuario no se encuentra registrado'});
                return;
            }          

            const isPasswordValid = await bcrypt.compare(req.body.password, user[0].password)
            if (!isPasswordValid) {
                res.status(400).json({error: 'User', code: 'u005', msg: 'Credenciales incorrectas'});
                return;
            }
            const accessToken = Auth.generateAccessToken(user[0].userId);

            res.status(200).json({toke:accessToken, code:'u006', msg: 'Ingreso exitoso'});

        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'Server', code: 'e001', msg: 'Error de servidor'});
        }
    };

    static async authToken(req, res){
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