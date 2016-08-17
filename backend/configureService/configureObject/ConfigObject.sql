CREATE TABLE t_configure_grid(
  name VARCHAR(32) UNIQUE
);

CREATE TABLE t_configure_instance(
  version VARCHAR(32),
  objectId INTEGER,
  create_time VARCHAR(32),
  basketName VARCHAR(32) REFERENCES t_configure_grid(name) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE t_configure_object(
  id INTEGER PRIMARY KEY,
  collection VARCHAR(64),
  TemplName VARCHAR(64),
  version VARCHAR(32)
);