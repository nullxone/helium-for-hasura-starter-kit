const { hasOne, belongsTo } = require("../../../../model");

class Users {
  static get relationships() {
    return [
      hasOne("project", require("./Projects"), "user_id"),
      belongsTo("supervisor", require("./Users"), "supervisor_id"),
    ];
  }
}

module.exports = Users;
