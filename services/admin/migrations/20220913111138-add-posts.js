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
  return db.createTable('posts', {
    id: { 
      type: 'int', 
      unsigned: true,
      notNull: true,
      primaryKey: true, 
      autoIncrement: true,
    },
    key: {
      type:'string',
      notNull: true,
      unique:true,
    },
    student_id: {
      type:'int',
      notNull: true,
      foreignKey: {
        name: 'posts_students_id_fk',
        table: 'students',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }

    },
    text: {
      type:'text',
    },
    video_url: {
      type:'text',
    },
    image_url: {
      type:'text',
    },
    event_id: {
      type: "int",
      notNull: false,
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
  return db.dropTable('posts');
};

exports._meta = {
  "version": 1
};
