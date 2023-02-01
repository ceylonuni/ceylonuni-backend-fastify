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
  return db.createTable('accounts', {
    id: { 
      type: 'int', 
      unsigned: true,
      notNull: true,
      primaryKey: true, 
      autoIncrement: true,
    },
    student_id: { 
      type: 'int', 
      notNull: true,
      foreignKey: {
        name: 'accounts_students_id_fk',
        table: 'students',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
      
    },
    email: {
      type:'string',
      notNull: true,
      unique:true,
    },
    username: {
      type:'string',
      notNull: true,
      unique:true,
    },
    password: {
      type:'string',
      notNull: true,
    },
    isVerified: {
      type:'boolean',
      defaultValue:false,
    },
    verified_at:{
      type:'timestamp',
      timezone: true,
    },
    status: {
      type:'boolean',
      defaultValue:true,
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
  return db.dropTable('accounts');
};

exports._meta = {
  "version": 1
};
