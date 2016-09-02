--前面建表，后面初始化参数

CREATE TABLE t_login ( seq_id serial , user_id integer, PRIMARY KEY(seq_id));
CREATE INDEX i_login_name ON t_login(user_id,seq_id);

CREATE TABLE t_resource_type
		( id serial ,  name varchar , description varchar, PRIMARY KEY(id));
CREATE INDEX i_name ON t_resource_type(id, name);

CREATE TABLE t_role
       	(id serial ,  role_name varchar ,PRIMARY KEY(id));
CREATE INDEX i_rolename ON t_role ( id, role_name);

CREATE TABLE t_permission
		(id serial , name varchar, resource_type_id integer ,description varchar, PRIMARY KEY(id));
CREATE INDEX i_permissionname ON t_permission (id, name, resource_type_id);

CREATE TABLE t_user
		(id serial , name varchar default '0', phone_number char(11) default '0', password varchar default '0',
private_key varchar default '0', public_key varchar default '0', email varchar default '0', intro varchar default '0', avatar varchar default '0', PRIMARY KEY(id));
CREATE INDEX i_username ON t_user ( id, name);

CREATE TABLE t_resource
		(id serial, name varchar, resource_type_id integer, description varchar, PRIMARY KEY(id),
		FOREIGN KEY(resource_type_id) REFERENCES t_resource_type(id) ON delete cascade on update cascade);
CREATE INDEX i_name_resourcetypeid ON t_resource (id, name, resource_type_id);


CREATE TABLE t_user_role
   		(user_id integer, role_id integer ,PRIMARY KEY(user_id, role_id),
   		 FOREIGN KEY(user_id) REFERENCES t_user(id) ON delete cascade on update cascade,
   		 FOREIGN KEY(role_id) REFERENCES t_role(id) ON delete cascade on update cascade);



CREATE TABLE t_role_permission_resource
		( role_id integer, permission_id integer, resource_id integer,PRIMARY KEY(role_id, permission_id, resource_id),
		 FOREIGN KEY(role_id) REFERENCES t_role(id) ON delete cascade on update cascade,
         FOREIGN KEY(permission_id) REFERENCES t_permission(id) ON delete cascade on update cascade,
         FOREIGN KEY(resource_id) REFERENCES t_resource(id) ON delete cascade on update cascade
		);







INSERT INTO t_login (user_id) VALUES (1),(5),(10);

INSERT INTO t_resource_type( name, description) VALUES
		('file','q'),('exe','w'),('but','r'),('aclsys','s');

INSERT INTO t_role(role_name) VALUES ('admin'),('user');

INSERT INTO t_permission (name,resource_type_id,description) VALUES
		('r',1,'a'),('w',1,'b'),('e',1,'c'),('r',2,'d'),('e',2,'e'),('e',3,'f'),
        ('AddResourceType',4,'s'),('AddResource',4,'s'),('AddRole',4,'s'),('AddUser',4,'s'),
        ('GrantRole',4,'s'),('ChangePassword',4,'s'),('Login',4,'s'),('Logout',4,'s'),
        ('ListResource',4,'s'),('GrantPermission',4,'s'),('ListRole',4,'s'),('ListUser',4,'s'),
        ('ListPermission',4,'s'),('ChangeUserName',4,'s'),('ChangeRoleName',4,'s'),
        ('ChangePublicKey',4,'s'),('ChangePrivateKey',4,'s'),('DeleteResource',4,'s'),
        ('DeleteUser',4,'s'),('DeleteRole',4,'s'),('ListLogin',4,'s'),
        ('ListOtherResource',4,'s'),('ListOtherPermission',4,'s'),('InheritPermission',4,'s'),('ReleaseRole',4,'s'),
        ('MyRole',4,'s'),('ListResourceType',4,'s'),('HasPermission',4,'s'),('ListTypeResource',4,'s');

INSERT INTO t_user (name, phone_number,password, private_key, public_key) VALUES
		('aa',1,'6c14da109e294d1e8155be8aa4b1ce8e',11,21),('bb',2,'e53a0a2978c28872a4505bdb51db06dc',12,22),('cc',3,'e034fb6b66aacc1d48f445ddfb08da98',13,23),
		('dd',4,'81dc9bdb52d04dc20036dbd8313ed055',14,24),('ee',5,'9996535e07258a7bbfd8b132435c5962',15,25);


INSERT INTO t_resource (resource_type_id, name, description) VALUES
		(1, 'test1','q'),(1,'test2','w'),(2,'exe1','e'),(3,'but1','r'),(4,'aclsystem','s');

INSERT INTO t_user_role (user_id, role_id) VALUES (1,1),(2,1),(3,2),(4,2),(5,2);


INSERT INTO t_role_permission_resource (role_id, permission_id, resource_id) VALUES
		(1,1,1),(1,2,1),(1,3,1),(1,4,2),(1,5,2),(1,6,3),(2,1,1),(2,4,2),

		(1,7,5),(1,8,5),(1,9,5),(1,10,5),(1,11,5),(1,12,5),(1,13,5),(1,14,5),(1,15,5),(1,16,5),
		(1,17,5),(1,18,5),(1,19,5),(1,20,5),(1,21,5),(1,22,5),(1,23,5),(1,24,5),(1,25,5),(1,26,5),
		(1,27,5),(1,28,5),(1,29,5),(1,30,5),(1,31,5),(1,32,5),(1,33,5),(1,34,5),(1,35,5),
		(2,12,5),(2,13,5),(2,14,5),(2,15,5),
		(2,19,5),(2,20,5),(2,22,5),(2,23,5),(2,32,5),(2,33,5),(2,34,5),(2,35,5)
	    ;






























