const sql = require("../config/db.js");

// constructor
const User = function(user) {
  this.firstName = user.firstName;
  this.lastName = user.lastName;
  this.email = user.email;
  this.password = user.password;
};

User.findById = (id, result) => {
    sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found tutorial: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
    });
};

User.getUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM users WHERE email = '${email}'`, (err, res) => {
            if (err) {
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
};

User.createUser = async (newUser) => {
    return new Promise((resolve, reject) =>{        
        sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
            if (err) {
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
    
};

module.exports = User;