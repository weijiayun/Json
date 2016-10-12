CREATE TABLE t_content
		( id serial , content varchar ,  PRIMARY KEY(id));



CREATE TABLE t_key
		(id serial, enkey varchar, content_id integer, possessor_id integer, initiator_id integer, PRIMARY KEY(id),
		FOREIGN KEY(content_id) REFERENCES t_content(id) ON delete cascade on update cascade
	--	FOREIGN KEY(user_id) REFERENCES t_user(id) ON delete cascade on update cascade
	    );





