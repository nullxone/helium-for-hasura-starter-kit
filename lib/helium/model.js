const _ = require("lodash");
const fs = require("fs-extra");
const yaml = require("js-yaml");
const path = require("path");

class Model {
  static compile(klass, metadataDir) {
    const schemaName = "public";
    fs.outputFileSync(
      path.join(
        this.outputDir(metadataDir),
        `${schemaName}_${this.tableName(klass)}.yaml`
      ),
      yaml.dump({
        table: {
          name: this.tableName(klass),
          schema: schemaName,
        },
      })
    );
  }

  static tableName(klass) {
    return _.snakeCase(klass.name);
  }

  static outputDir(metadataDir) {
    return path.join(metadataDir, "databases/default/tables");
  }
}

module.exports = Model;
