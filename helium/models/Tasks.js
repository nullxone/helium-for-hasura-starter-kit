// helium/models/Tasks.js

const { belongsTo } = require("helium-for-hasura");

class Tasks {
  static get relationships() {
    return [belongsTo("user", require("./Users"), "user_id")];
  }
}

module.exports = Tasks;
