
CREATE TABLE t_permission(
  id SERIAL,
  name VARCHAR(32),
  description VARCHAR(120),
  PRIMARY KEY (id)
);
CREATE TABLE t_resource_type_permission(
  resource_type_id int,
  permission_id int,
  FOREIGN KEY (resource_type_id) REFERENCES t_resource_type(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES t_permission(id) ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE t_resource_type_permission;
CREATE TABLE t_role_memberOf(
  child_role_id int,
  parent_role_id int,
  FOREIGN KEY (child_role_id) REFERENCES t_role(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (parent_role_id) REFERENCES t_role(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (child_role_id,parent_role_id)
);
DROP TABLE t_role_memberOf;

CREATE TABLE t_role_permission_resource(
  role_id int,
  permission_id int,
  resource_id int,
  FOREIGN KEY (role_id) REFERENCES t_role(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES t_role(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES t_role(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE t_resource(
  id SERIAL,
  name VARCHAR(32),
  resource_type_id int,
  content_id int UNIQUE,
  is_group SMALLINT DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (resource_type_id) REFERENCES t_resource_type(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE t_resource_type(
  id SERIAL,
  name VARCHAR(32),
  PRIMARY KEY (id)
);
CREATE TABLE t_group_resource(
  group_id int,
  resource_id INT,
  FOREIGN KEY (group_id) REFERENCES t_resource(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES t_resource(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE t_role(
  id SERIAL,
  role_name VARCHAR(32),
  PRIMARY KEY (id)
);
CREATE TABLE t_group(
  id SERIAL,
  name VARCHAR(32),
  PRIMARY KEY (id)
);
INSERT INTO t_resource_type(name) VALUES ('file'),('pdf'),('sys'),('doc');
INSERT INTO t_resource_type_permission(resource_type_id, permission_id) VALUES (1,1),(1,2),(2,1),(2,2),(4,1),(4,2),(3,1),(3,2),(3,3);
INSERT INTO t_resource(name, resource_type_id, content_id, is_group) VALUES
  ('x1',1,1,0),('x2',1,2,0),('x3',2,3,0),('x4',3,4,0),('x5',1,5,1),('y1',1,6,0),('y2',1,7,0),('y3',1,8,0),('y4',1,9,0);
INSERT INTO t_group_resource(group_id, resource_id) VALUES (5,6),(5,7),(5,8),(5,9);
INSERT INTO t_permission (name,description) VALUES
  ('r', 'a'),('w', 'b'),('e', 'c'),
        ('AddResourceType', 's'),('AddResource', 's'),('AddRole', 's'),('AddUser', 's'),
        ('GrantRole', 's'),('ChangePassword', 's'),('Login', 's'),('Logout', 's'),
        ('ListResource', 's'),('GrantPermission', 's'),('ListRole', 's'),('ListUser', 's'),
        ('ListPermission', 's'),('ChangeUserName', 's'),('ChangeRoleName', 's'),
        ('ChangePublicKey', 's'),('ChangePrivateKey', 's'),('DeleteResource', 's'),
        ('DeleteUser', 's'),('DeleteRole', 's'),('ListLogin', 's'),
        ('ListOtherResource', 's'),('ListOtherPermission', 's'),('InheritPermission', 's'),('ReleaseRole', 's'),
        ('MyRole', 's'),('ListResourceType', 's'),('HasPermission', 's'),('ListTypeResource', 's');

INSERT INTO t_role(role_name) VALUES ('itLeader3'),('reachLeader3');
INSERT INTO t_role_memberOf(child_role_id, parent_role_id)
VALUES(1,1),(2,2),(3,3),(4,4),(5,5),(6,6),(7,7),(8,8);

INSERT INTO t_role_memberOf(child_role_id, parent_role_id)
VALUES(2,1),(3,2),(4,1),(4,3),(5,1),(5,4),(6,4);

INSERT INTO t_role_permission_resource(role_id, permission_id, resource_id) VALUES
  (1,1,1),(1,2,1),(1,1,2),(1,2,2),(1,1,3),(1,2,3),(1,2,3),
  (2,1,4),(2,2,4),
  (3,1,3),(3,2,3),(3,1,4),(3,2,4),(3,3,4),
  (4,1,5),(4,2,5),(4,3,5);