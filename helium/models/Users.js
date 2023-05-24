// models/Users.js

const { hasMany } = require("helium-for-hasura");

class Users {
  static get relationships() {
    return [
      hasMany("tasks", require("./Tasks"), "user_id"),
      hasMany("shared_tasks", require("./SharedTasks"), "with_user_id"),
    ];
  }

  static get permissions() {
    const pred = eq("id", "X-Hasura-User-Id");
    return {
      select: permission(pred, ["id", "name"]),
      insert: permission(pred, ["id", "name"]),
      update: permission(pred, ["name"]),
    };
  }
}

module.exports = Users;
