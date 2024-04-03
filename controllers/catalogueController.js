const bcrypt                = require('bcryptjs');
const { validationResult }  = require('express-validator');
const User                  = require('../models/catalogue');
const Auth                  = require('./authController')

class CatalogueController {

    static async getCatalogue(req, res) {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {            
            return res.status(400).json({error: 'Validations error', code: 'e003', msg: errors.array()[0].msg});
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
                return res.status(400).json({error: 'User', code: 'u001', msg: 'El usuario con ese correo ya existe'});
            };

            existingUser = await User.getUser('id', user.id); 
            if (existingUser.length) {
                return res.status(400).json({error: 'User', code: 'u002', msg: 'El usuario con esa identificación ya existe'});
            };

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
            const userId = await User.createUser(user);

            return res.status(200).json({msg: 'El usuario se registro correctamente', code: 'u003'});

        } catch (error) {
            console.error(error)
            return res.status(500).json({error: 'Server', code: 'e001', msg: 'Error de servidor'});
        };
    };
}

module.exports = CatalogueController;