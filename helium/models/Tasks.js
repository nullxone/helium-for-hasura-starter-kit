// models/Tasks.js

const { belongsTo, permission } = require("helium-for-hasura");

class Tasks {
  static get relationships() {
    return [
      belongsTo("user", require("./Users"), "user_id"),
      hasMany("shared_tasks", require("./SharedTasks"), "task_id"),
    ];
  }

  static get permissions() {
    const pManage = eq("user_id", "X-Hasura-User-Id"),
      pSelect = or(
        pManage,
        eq("shared_tasks.with_user_id", "X-Hasura-User-Id")
      ),
      cols = ["id", "title", "body", "user_id"];
    return {
      select: permission(pSelect, cols),
      insert: permission(pManage, cols),
      update: permission(pManage, cols),
      delete: permission(pManage),
    };
  }
}

module.exports = Tasks;
