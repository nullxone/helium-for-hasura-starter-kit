const { hasMany } = require("helium-for-hasura");

class Users {
  static get relationships() {
    return [hasMany("tasks", require("./Tasks"), "user_id")];
  }

  static get permissions() {
    const pred = eq("id", "X-Hasura-User-Id");
    return {
      update: permission(pred, ["name"]),
    };
  }
}

module.exports = Users;
