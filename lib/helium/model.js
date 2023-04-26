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

  static writeAllTables(metadataDir) {
    fs.outputFileSync(
      this.outputAllTablesFile(metadataDir),
      yaml.dump(
        fs
          .readdirSync(path.join(metadataDir, "databases/default/tables"))
          .map((file) => `!include ${file}`)
      )
    );
  }

  static tableName(klass) {
    return _.snakeCase(klass.name);
  }

  static outputDir(metadataDir) {
    return path.join(metadataDir, "databases/default/tables");
  }

  static outputAllTablesFile(metadataDir) {
    return path.join(metadataDir, "databases/default/tables/tables.yaml");
  }
}

module.exports = Model;
