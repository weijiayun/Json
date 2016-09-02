CREATE TABLE t_configure_grid_mapping(
  name VARCHAR(32) PRIMARY KEY ,
  configure_list VARCHAR(256)DEFAULT NULL
);

CREATE TABLE t_configure_instance_mapping(
  object_list VARCHAR(256) NOT NULL ,
  version VARCHAR(32),
  create_time VARCHAR(32)UNIQUE
);

CREATE TABLE t_configure_collection_mapping(
  name VARCHAR(32) PRIMARY KEY,
  object_list VARCHAR(128) DEFAULT NULL
);

CREATE TABLE t_configure_object_mapping(
  id INTEGER PRIMARY KEY,
  name VARCHAR(32)UNIQUE,
  templ_name VARCHAR(64),
  templ_version VARCHAR(32)
);
