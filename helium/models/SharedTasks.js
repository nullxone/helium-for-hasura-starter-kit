const { belongsTo } = require("helium-for-hasura");

class SharedTasks {
  static get relationships() {
    return [
      belongsTo("with_user", require("./Users"), "with_user_id"),
      belongsTo("task", require("./Tasks"), "task_id"),
    ];
  }

  static get permissions() {
    const pManage = eq("task.user_id", "X-Hasura-User-Id"),
      pSelect = or(pManage, eq("with_user_id", "X-Hasura-User-Id")),
      cols = ["id", "with_user_id", "task_id"];
    return {
      select: permission(pSelect, cols),
      insert: permission(pManage, cols),
      update: permission(pManage, cols),
      delete: permission(pManage),
    };
  }
}

module.exports = SharedTasks;
