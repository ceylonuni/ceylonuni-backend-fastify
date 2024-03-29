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
  return db.createTable("admins", {
    id: {
      type: "int",
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: "string",
      notNull: true,
      unique: true,
    },

    password: {
      type: "string",
      notNull: true,
    },
    mobile: {
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
  return db.dropTable("admins");
};

exports._meta = {
  version: 1,
};
