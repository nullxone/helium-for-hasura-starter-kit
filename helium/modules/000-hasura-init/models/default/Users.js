const { hasMany, hasOne, belongsTo, permission } = require("../index");

// prettier-ignore
class Users {
  static allColumns = ["id","name","created_at"];

  static get relationships() {
    return [
      
    ];
  }
}

module.exports = Users;
