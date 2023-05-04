const { hasMany } = require("helium-for-hasura");

class Users {
  static get relationships() {
    return [hasMany("tasks", require("./Tasks"), "user_id")];
  }
}

module.exports = Users;
