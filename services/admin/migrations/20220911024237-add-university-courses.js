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
  return db.createTable('university_courses', {
    id: { 
      type: 'int', 
      unsigned: true,
      notNull: true,
      primaryKey: true, 
      autoIncrement: true,
    },
    university_id: {
      type:'int',
      notNull: true,
      foreignKey: {
        name: 'university_courses_universities_id_fk',
        table: 'universities',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    course_id: {
      type:'int',
      notNull: true,
      foreignKey: {
        name: 'university_courses_courses_id_fk',
        table: 'courses',
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
  return db.dropTable('university_courses');
};

exports._meta = {
  "version": 1
};
