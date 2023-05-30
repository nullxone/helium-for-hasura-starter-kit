const { hasMany, hasOne, belongsTo, permission } = require("../index");

// prettier-ignore
class Tasks {
  static allColumns = ["id","title","priority","user_id","created_at"];

  static get relationships() {
    return [
      
    ];
  }
}

module.exports = Tasks;
