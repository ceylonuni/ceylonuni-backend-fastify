'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('universities', {
    id: { 
      type: 'int', 
      unsigned: true,
      notNull: true,
      primaryKey: true, 
      autoIncrement: true,
    },
    name: {
      type:'string',
      notNull: true,
      unique:true,
    },
    created_at: {
      type:'timestamp',
      timezone: true,
    },
    updated_at: {
      type:'timestamp',
      timezone: true,
    },
    deleted_at: {
      type:'timestamp',
      timezone: true,
    },
  });
};

exports.down = function(db) {
  return db.dropTable('universities');
};

exports._meta = {
  "version": 1
};
