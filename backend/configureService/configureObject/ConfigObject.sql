CREATE TABLE t_configure(
  object_list VARCHAR(256) NOT NULL ,
  name VARCHAR(32),
  version VARCHAR(32),
  create_date VARCHAR(32)
);

CREATE TABLE t_object(
  id INTEGER PRIMARY KEY ,
  name VARCHAR(32),
  create_date VARCHAR(64),
  version VARCHAR(32),
  category VARCHAR(32),
  template_name VARCHAR(32),
  collection_name VARCHAR(64)
);

