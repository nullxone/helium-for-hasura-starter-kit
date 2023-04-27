const { hasOne, belongsTo, permission, eq } = require("../../../../model");

class Users {
  static get relationships() {
    return [
      hasOne("project", require("./Projects"), "user_id"),
      belongsTo("supervisor", require("./Users"), "supervisor_id"),
    ];
  }

  static get permissions() {
    const predicate = eq("id", "X-Hasura-User-Id");
    return {
      select: permission(predicate),
      insert: permission(predicate),
      update: permission(predicate),
      postUpdate: permission(predicate),
      delete: permission(predicate),
    };
  }
}

module.exports = Users;
