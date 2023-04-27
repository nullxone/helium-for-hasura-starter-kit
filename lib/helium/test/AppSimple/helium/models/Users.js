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
    const columns = ["id", "email", "supervisor_id", "created_at"];
    return {
      select: permission(predicate, columns),
      insert: permission(predicate, columns),
      update: permission(predicate, columns),
      postUpdate: permission(predicate),
      delete: permission(predicate),
    };
  }
}

module.exports = Users;
