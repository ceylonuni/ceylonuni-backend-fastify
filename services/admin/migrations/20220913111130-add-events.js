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
  return db.createTable("events", {
    id: {
      type: "int",
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: "string",
      notNull: true,
    },
    key: {
      type: "string",
      notNull: true,
      unique: true,
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

    image_url: {
      type: "text",
    },
    start_at: {
      type: "timestamp",
      timezone: true,
      notNull: true,
    },
    end_at: {
      type: "timestamp",
      timezone: true,
      notNull: true,
    },
    venue: {
      type: "string",
      notNull: true,
    },
    status: {
      type: "string",
      notNull: true,
      defaultValue:'pending'
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
  return db.dropTable("events");
};

exports._meta = {
  version: 1,
};
