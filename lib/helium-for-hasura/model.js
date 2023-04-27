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

    const permissionsMetadata = this.buildPermissions(klass);

    if (orels.length > 0) metadata.object_relationships = orels;
    if (arels.length > 0) metadata.array_relationships = arels;

    fs.outputFileSync(
      path.join(
        this.outputDir(metadataDir),
        `${schemaName}_${this.tableName(klass)}.yaml`
      ),
      yaml.dump({ ...metadata, ...permissionsMetadata })
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

  static buildPermissions(klass) {
    const metadata = {};

    if (!klass.permissions) return metadata;

    const selectp = klass.permissions.select;
    if (selectp) {
      metadata.select_permissions = [
        {
          role: "user",
          permission: { filter: selectp.predicate, columns: selectp.columns },
        },
      ];
    }

    const insertp = klass.permissions.insert;
    if (insertp) {
      metadata.insert_permissions = [
        {
          role: "user",
          permission: { check: insertp.predicate, columns: insertp.columns },
        },
      ];
    }

    const updatep = klass.permissions.update;
    const postUpdatep = klass.permissions.postUpdate;
    if (updatep || postUpdatep) {
      metadata.update_permissions = [
        {
          role: "user",
          permission: {},
        },
      ];

      if (updatep) {
        metadata.update_permissions[0].permission.filter = updatep.predicate;
        metadata.update_permissions[0].permission.columns = updatep.columns;
      }

      if (klass.permissions.postUpdate)
        metadata.update_permissions[0].permission.check = postUpdatep.predicate;
    }

    const deletep = klass.permissions.delete;
    if (deletep) {
      metadata.delete_permissions = [
        {
          role: "user",
          permission: { filter: deletep.predicate },
        },
      ];
    }

    return metadata;
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

function permission(predicate, columns) {
  return { predicate, columns };
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
  permission,
  exists,
  and,
  or,
  not,
  ...["eq", "ne", "gt", "lt", "gte", "lte", "in", "nin"].reduce((a, c) => {
    a[c] = (field, value) => fieldOperator("_" + c, field, value);
    return a;
  }, {}),
};
