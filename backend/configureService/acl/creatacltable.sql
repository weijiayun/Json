CREATE TABLE t_login ( seq_id serial , user_id integer PRIMARY KEY);
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
		(id serial , name varchar , phone_number char(11), password varchar,
private_key varchar, public_key varchar, PRIMARY KEY(id));
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













