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

  exports.up = function (db, callback) {
    return db.createTable('supports', {
      id: { 
        type: 'int', 
        unsigned: true,
        notNull: true,
        primaryKey: true, 
        autoIncrement: true,
      },
      name: {
        type:'string',
      },
      created_time: {
        type:'timestamp',
        timezone: true,
      },
    });
};

exports.down = function(db) {
  return db.dropTable('supports');
};

exports._meta = {
  "version": 1
};
