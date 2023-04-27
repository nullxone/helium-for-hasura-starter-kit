const { belongsTo, permission } = require("helium-for-hasura");

class Tasks {
  static get relationships() {
    return [belongsTo("user", require("./Users"), "user_id")];
  }

  static get permissions() {
    const pred = eq("user_id", "X-Hasura-User-Id"),
      cols = ["id", "title", "body", "user_id"];
    return {
      select: permission(pred, cols),
      insert: permission(pred, cols),
      update: permission(pred, cols),
      delete: permission(pred),
    };
  }
}

module.exports = Tasks;
