const _ = require("lodash");
const fs = require("fs-extra");
const yaml = require("js-yaml");
const path = require("path");

class Model {
  static compile(klass, metadataDir) {
    const schemaName = "public";

    const metadata = {
      table: {
        name: this.tableName(klass),
        schema: schemaName,
      },
    };

    const [orels, arels] = this.buildRelationships(klass);

    if (orels.length > 0) metadata.object_relationships = orels;
    if (arels.length > 0) metadata.array_relationships = arels;

    fs.outputFileSync(
      path.join(
        this.outputDir(metadataDir),
        `${schemaName}_${this.tableName(klass)}.yaml`
      ),
      yaml.dump(metadata)
    );
  }

  static buildRelationships(klass) {
    const orels = [];
    const arels = [];

    if (!klass.relationships) return [orels, arels];

    klass.relationships.forEach((rel) => {
      if (rel.associationType === "belongsTo") {
        orels.push(
          makeRelationship(rel.name, this.tableName(rel.targetClass), {
            [rel.foreignKey]: "id",
          })
        );
      } else if (rel.associationType === "hasOne") {
        orels.push(
          makeRelationship(rel.name, this.tableName(rel.targetClass), {
            [this.primaryKey(klass)]: rel.foreignKey,
          })
        );
      } else if (rel.associationType === "hasMany") {
        arels.push(
          makeRelationship(rel.name, this.tableName(rel.targetClass), {
            id: rel.foreignKey,
          })
        );
      }
    });

    return [orels, arels];
  }

  static writeAllTables(metadataDir) {
    fs.outputFileSync(
      this.outputAllTablesFile(metadataDir),
      yaml.dump(
        fs
          .readdirSync(path.join(metadataDir, "databases/default/tables"))
          .filter((file) => file !== "tables.yaml")
          .map((file) => `!include ${file}`)
      )
    );
  }

  static primaryKey(klass) {
    return "id";
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

function belongsTo(name, targetClass, foreignKey) {
  return {
    name,
    targetClass,
    foreignKey,
    associationType: "belongsTo",
  };
}

function hasOne(name, targetClass, foreignKey) {
  return {
    name,
    targetClass,
    foreignKey,
    associationType: "hasOne",
  };
}

function hasMany(name, targetClass, foreignKey) {
  return {
    name,
    targetClass,
    foreignKey,
    associationType: "hasMany",
  };
}

function makeRelationship(name, remoteTableName, columnMapping) {
  return {
    name,
    using: {
      manual_configuration: {
        column_mapping: columnMapping,
        insertion_order: null,
        remote_table: {
          name: remoteTableName,
          schema: "public",
        },
      },
    },
  };
}

function and(...args) {
  return {
    _and: args,
  };
}

function or(...args) {
  return {
    _or: args,
  };
}

function not(arg) {
  return {
    _not: arg,
  };
}

function fieldOperator(op, field, value) {
  return field
    .split(".")
    .reverse()
    .reduce((a, c, i) => {
      if (i === 0) return { [c]: { [op]: value } };
      return { [c]: a };
    }, null);
}

function exists(table, where) {
  return {
    _exists: { _table: { name: table, schema: "public" }, _where: where },
  };
}

module.exports = {
  Model,
  belongsTo,
  hasOne,
  hasMany,
  exists,
  and,
  or,
  not,
  ...["eq", "ne", "gt", "lt", "gte", "lte", "in", "nin"].reduce((a, c) => {
    a[c] = (field, value) => fieldOperator("_" + c, field, value);
    return a;
  }, {}),
};
