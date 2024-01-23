const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config');

class AuthController {

    static generateAccessToken(userId) {
        return jwt.sign({userId: userId}, SECRET_KEY, { expiresIn: '30s' });
    }

    static authenticateToken(token) {
        return jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return {valid: false, inf: err.message} ;
            return {valid: true, inf: user};
        })
      }

}

module.exports = AuthController;