const sql = require("../config/db.js");

// constructor
const Catalogue = function(catalogue) {
    this.id     = catalogue.id;
    this.name   = catalogue.name;
    this.father = catalogue.father;
    this.active = catalogue.active;
};

Catalogue.getCatalogue = async (name, value) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM Catalogue WHERE ${name} = '${value}' AND active = 1`, (err, res) => {
            if (err) {
                reject(err);
            }else{                
                resolve(JSON.parse(JSON.stringify(res)));
            }
        });
    });
    
};

Catalogue.getChildren = async (father) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM Catalogue WHERE father = '${father}' AND active = 1`, (err, res) => {
            if (err) {
                reject(err);
            }else{
                resolve(JSON.parse(JSON.stringify(res)));
                //resolve(res);
            }
        });
    });
    
};

module.exports = Catalogue;