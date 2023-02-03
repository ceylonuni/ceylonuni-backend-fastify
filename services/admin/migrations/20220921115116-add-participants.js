"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('participants', {
    id: {
      type: "int",
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: "int",
      notNull: true,
      foreignKey: {
        name: "events_students_id_fk",
        table: "students",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: "id",
      },
    },
    event_id: {
      type: "int",
      notNull: true,
      foreignKey: {
        name: "colloborators_events_id_fk",
        table: "events",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: "id",
      },
    },
    status: {
      type: "string",
      notNull: true,
    },

    created_at: {
      type: "timestamp",
      timezone: true,
    },
    updated_at: {
      type: "timestamp",
      timezone: true,
    },
    deleted_at: {
      type: "timestamp",
      timezone: true,
    },
  });
};

exports.down = function (db) {
  return db.dropTable('participants');
};

exports._meta = {
  version: 1,
};
