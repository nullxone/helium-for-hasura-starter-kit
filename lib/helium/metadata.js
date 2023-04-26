const Database = require("./database");
const Model = require("./model");
const path = require("path");
const fs = require("fs-extra");

class Metadata {
  static compile(heliumDir, metadataDir) {
    const modelsDir = path.join(heliumDir, "models");
    fs.readdirSync(modelsDir).forEach((file) => {
      Model.compile(require(path.join(modelsDir, file)), metadataDir);
    });

    Model.writeAllTables(metadataDir);

    const databaseFile = path.join(heliumDir, "Database");
    //if (fs.existsSync(databaseFile))
    Database.compile(require(databaseFile), metadataDir);
  }
}

module.exports = Metadata;
