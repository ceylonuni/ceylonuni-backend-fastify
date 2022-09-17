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
  return db.addIndex('likes','Index_students_posts__student_id_post_id',[
  	'student_id',
  	'post_id',
  ],true);
};

exports.down = function(db) {
  return db.removeIndex('likes','Index_students_posts__student_id_post_id');
};

exports._meta = {
  "version": 1
};
