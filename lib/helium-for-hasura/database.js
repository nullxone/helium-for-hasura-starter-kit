const fs = require("fs-extra");
const ejs = require("ejs");
const path = require("path");

class Database {
  static compile(klass, metadataDir) {
    const databaseMetadata = ejs.compile(
      fs.readFileSync(path.join(__dirname, "templates/database.ejs"), "utf8")
    )({ databaseUrl: klass.databaseUrl });

    fs.outputFileSync(this.outputFile(metadataDir), databaseMetadata);
  }

  static outputFile(metadataDir) {
    return path.join(metadataDir, "databases/databases.yaml");
  }
}

module.exports = Database;
