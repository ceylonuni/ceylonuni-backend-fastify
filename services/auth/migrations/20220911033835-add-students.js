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
  return db.createTable('students', {
    id: { 
      type: 'int', 
      unsigned: true,
      notNull: true,
      primaryKey: true, 
      autoIncrement: true,
    },
    first_name: {
      type:'string',
      notNull: true,
    },
    last_name: {
      type:'string',
      notNull: true,
    },
    mobile: {
      type:'text',
      notNull: true,
    },
    email:{
      type:'text',
      notNull: true,
      unique:true,
    },
    address: {
      type:'text',
      notNull: true,
    },
    university_course_id: {
      type:'int',
      notNull: true,
      foreignKey: {
        name: 'students_university_courses_id_fk',
        table: 'university_courses',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }

    },
    friends: {
      type:'text',
    },
    friend_requests: {
      type:'text',
    },
    send_requests: {
      type:'text',
    },
    collaborator_request: {
      type:'text',
    },
    
    image_url: {
      type:'text',
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
  return db.dropTable('students');
};

exports._meta = {
  "version": 1
};
