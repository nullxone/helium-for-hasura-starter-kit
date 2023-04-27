const { belongsTo, hasMany } = require("../../../../model");

class Projects {
  static get relationships() {
    return [
      belongsTo("user", require("./Users"), "user_id"),
      hasMany("tasks", require("./Tasks"), "project_id"),
    ];
  }
}

module.exports = Projects;
