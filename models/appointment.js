const sql = require("../config/db.js");

// constructor
const Appointmnet = function(user) {
    this.id     = user.id;
    this.date   = user.date;
    this.state  = user.state;
    this.type   = user.type;
    this.time   = user.time;
};


module.exports = Appointmnet;