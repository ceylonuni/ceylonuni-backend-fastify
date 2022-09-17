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
  return db.createTable('likes', {
    id: { 
      type: 'int', 
      unsigned: true,
      notNull: true,
      primaryKey: true, 
      autoIncrement: true,
    },
    post_id: {
      type:'int',
      notNull: true,
      foreignKey: {
        name: 'comments_posts_id_fk',
        table: 'posts',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }

    },
    student_id: {
      type:'int',
      notNull: true,
      foreignKey: {
        name: 'comments_students_id_fk',
        table: 'students',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }

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
  return db.dropTable('likes');
};

exports._meta = {
  "version": 1
};
