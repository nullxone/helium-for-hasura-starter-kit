const { hasOne } = require("../../../../model");

class Users {
  static get relationships() {
    return [hasOne("project", require("./Projects"), "user_id")];
  }
}

module.exports = Users;
