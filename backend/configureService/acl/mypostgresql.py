#coding: utf-8
import psycopg2
import hashlib
import time
import logging
import os
import threading
'''
创建所需数据表，完成数据插入、查找、删除、修改等功能
'''
# logging.basicConfig(filename = os.path.join(os.getcwd(), time.strftime('%Y-%m-%d-') + 'log.txt'),
#         level = logging.WARN, filemode = 'a', format = '错误时间：%(asctime)s  %(message)s')
# 写入日志
def write_log(log_type, url, message):
    logger = '\n错误链接：%s\n错误信息：%s\n%s\n' % (url, message, '-'*50)
    if log_type == 'error':
        logging.error(logger)
    elif log_type == 'warning':
        logging.warning(logger)

class mysql(object):

    def __init__(self,conn):
        self.conn = conn

    def md5(self,str):
        self.str = str
        m = hashlib.md5()
        m.update(self.str)
        return m.hexdigest()

    def sessionTimeOut(self, userId):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_login where user_id= %s; '''
            cur.execute(sql,(userId,) )
            self.conn.commit()
            return  True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def login(self,userName, password):
        cur = self.conn.cursor()
        try:
            sql3 = ''' SELECT id FROM t_user WHERE name=%s AND password =%s ;'''
            cur.execute(sql3,(userName,password))
            a = cur.fetchone()
            if a is None:
                return 0,0
            userId = a[0]
            sql = ''' delete from t_login where user_id=%s'''
            cur.execute(sql,(userId,))
            sq2 = '''INSERT INTO t_login (user_id) VALUES (%s);'''
            cur.execute(sq2,(userId,))
            sql4 = '''  SELECT currval('t_login_seq_id_seq');'''
            cur.execute(sql4,(userId,))
            r =cur.fetchone()
            seqId = r[0]
            self.conn.commit()
            return seqId, userId
        except Exception as e:
            print e
            self.conn.rollback()
            return -1,0
        finally:
            cur.close()

    def logout(self,userId,seqId):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_login WHERE (user_id=%s AND seq_id=%s); '''
            cur.execute(sql,(userId,seqId))
            self.conn.commit()
            return  True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def checkLogin(self,userId,seqId):
        cur = self.conn.cursor()
        try:
            sql = ''' SELECT * FROM t_login WHERE (user_id=%s AND seq_id=%s);'''
            cur.execute(sql,(userId,seqId))
            r = cur.fetchall()
            if len(r) == 1:
                flag = True
            else:
                flag= False
                raise Exception('not login')
            # cur.close()
            # return login
        except Exception as e:
            print e
            # write_log('warning', url, code )

        finally:
            cur.close()
            return flag

    def checkPermission(self, userId, permissionName):
        cur = self.conn.cursor()
        sql = ''' SELECT * FROM t_role_permission_resource WHERE
            role_id=(SELECT role_id FROM t_user_role WHERE user_id=%s)
            AND permission_id = (SELECT id FROM t_permission WHERE name=%s);
        '''
        cur.execute(sql,(userId, permissionName))
        r = cur.fetchall()
        if len(r) != 0:
            res  = True
        else:
            res  = False
        cur.close()
        return res

    def insertResourceType(self,name,description):
        cur = self.conn.cursor()
        try:
            sql='''INSERT INTO t_resource_type( name, description) VALUES (%s,%s);'''
            sql2='''  SELECT currval('t_resource_type_id_seq');'''
            cur.execute(sql,(name, description))
            cur.execute(sql2)
            r=cur.fetchone()
            self.conn.commit()
            return r
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def insertResource(self, userId,restypeid, name, contentId):
        cur = self.conn.cursor()
        try:
            sql='''INSERT INTO t_resource (resource_type_id, name, contentId) VALUES (%s, %s, %s);'''
            cur.execute(sql,(restypeid, name, contentId))
            sql2='''SELECT currval('t_resource_id_seq');'''
            cur.execute(sql2)
            r = cur.fetchone()
            sql3='''select id from t_resource_type_permission where resource_type_id = %s;'''
            cur.execute(sql3,(restypeid,))
            r2 = cur.fetchall()
            for i in r2:
                sql4=''' INSERT INTO t_role_permission_resource ( role_id,permission_id,resource_id) VALUES
                ((select role_id from t_user_role where user_id= %s ),%s,%s); '''
                cur.execute(sql4,(userId,i,r[0]))

            #增加删除这个新增资源的权限
            sql5 = '''INSERT INTO t_role_permission_resource ( role_id,permission_id,resource_id) VALUES
                ((select role_id from t_user_role where user_id= %s ),24,%s);'''
            cur.execute(sql5,(userId,r[0]))
            self.conn.commit()
            return r
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def insertRole(self, rolename):
        cur = self.conn.cursor()
        try:
            sql = '''INSERT INTO t_role(role_name) VALUES ({0});'''.format(rolename)
            cur.execute(sql)
            sql2 = '''  SELECT currval('t_role_id_seq');'''
            cur.execute(sql2 )
            r = cur.fetchone()
            self.conn.commit()
            return r
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def insertUser(self,name, phoneNumber, password, privateKey, publicKey):
        cur = self.conn.cursor()
        try:
            sql = '''INSERT INTO t_user (name, phone_number,password, private_key, public_key)
                     VALUES ({0},{1},{2},{3},{4});'''.format(name, phoneNumber, password, privateKey, publicKey)
            cur.execute(sql)
            sql2 = '''  SELECT currval('t_user_id_seq');'''
            cur.execute(sql2)
            r = cur.fetchone()
            self.conn.commit()
            return r
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def insertPermission(self, name, description, resourceTypeId):
        cur = self.conn.cursor()
        try:
            sql = '''INSERT INTO t_permission (name, description, resource_type_id)
                    VALUES ({0},{1},{2});'''.format(name, description, resourceTypeId)
            cur.execute(sql)
            self.conn.commit()
        except Exception as e:
            print e
            self.conn.rollback()
        finally:
            cur.close()

    def insertRPR(self, roleId, permissionId, resourceId):
        cur = self.conn.cursor()
        try:
            sql = '''INSERT INTO t_role_permission_resource (role_id, permission_id, resource_id)
                   VALUES ({0}, {1}, {2});'''.format(roleId, permissionId, resourceId)
            cur.execute(sql)
            self.conn.commit()
        except Exception as e:
            print e
            self.conn.rollback()
        finally:
            cur.close()

    def setRoleToUser(self, userId, roleId):
        cur = self.conn.cursor()
        try:
            sql = '''INSERT INTO t_user_role (user_id, role_id) VALUES ({0}, {1});'''.format(userId, roleId)
            cur.execute(sql)
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def clearRoleOfUser(self, userId, roleId):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_user_role
                     WHERE t_user_role.user_id={0} AND t_user_role.role_id={1};'''.format(userId, roleId)
            cur.execute(sql)
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def changePassword(self, userId, password):
        cur = self.conn.cursor()
        try:
            sql = '''UPDATE t_user SET password=%s WHERE id=%s;'''
            cur.execute(sql, (password, userId))
            if cur.rowcount == 0:
                raise Exception('object does not exist')
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def listRole(self):
        cur = self.conn.cursor()
        try:
            self.conn.commit()
            sql = '''SELECT * FROM t_role; '''
            cur.execute(sql,)
            r = cur.fetchall()
            return r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def listResource(self, userId):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT DISTINCT id, name FROM t_resource WHERE id in (SELECT resource_id FROM t_role_permission_resource
                    WHERE role_id = (SELECT parent_role_id FROM t_role_memberof
                    WHERE child_role_id = (SELECT role_id FROM t_user_role WHERE user_id = %s))); '''
            cur.execute(sql,(userId,))
            r =cur.fetchall()
            return r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def listSBResource(self, roleId):
        try:
            cur = self.conn.cursor()
            sql3 = '''SELECT id, name FROM t_resource WHERE id in (SELECT resource_id FROM t_role_permission_resource
                    WHERE role_id = %s ); '''
            cur.execute(sql3,(roleId,))
            r =cur.fetchall()
            return r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def listUser(self):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT id, name FROM t_user; '''
            cur.execute(sql)
            r = cur.fetchall()
            return r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def grantPermission(self, roleId, permissionId, resourceId):
        cur = self.conn.cursor()
        try:
            sql='''INSERT INTO t_role_permission_resource (role_id, permission_id, resource_id) VALUES (%s, %s, %s);'''
            cur.execute(sql, (roleId, permissionId, resourceId))
            self.conn.commit()
            return  True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def listPermission(self, userId):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT id, name FROM t_permission WHERE id in (SELECT permission_id FROM t_role_permission_resource
                    WHERE role_id = (SELECT role_id FROM t_user_role WHERE user_id = %s));'''
            cur.execute(sql, (userId,))
            r = cur.fetchall()
            return r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def listSBPermission(self,roleId):
        cur = self.conn.cursor()
        try:
            sql='''SELECT id, name FROM t_permission WHERE id in (SELECT permission_id FROM t_role_permission_resource
                    WHERE role_id = %s);'''
            cur.execute(sql,(roleId,))
            r=cur.fetchall()
            return r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def changeUserName(self,sessUserId, userName):
        cur = self.conn.cursor()
        try:
            sql2='''UPDATE t_user SET name=%s WHERE id=%s;'''
            cur.execute(sql2,(userName,sessUserId))
            if cur.rowcount ==0:
                raise Exception('object does not exist')
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def changeRoleName(self, roleId, roleName):
        cur = self.conn.cursor()
        try:
            sql='''UPDATE t_role SET role_name=%s WHERE id=%s;'''
            cur.execute(sql, (roleName, roleId))
            if cur.rowcount == 0:
                raise Exception('object does not exist')
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def changePublicKey(self,userId,publicKey):
        cur = self.conn.cursor()
        try:
            sql='''UPDATE t_user SET public_key=%s WHERE id=%s;'''
            cur.execute(sql,(publicKey,userId))
            if cur.rowcount ==0:
                raise Exception('object does not exist')
            self.conn.commit()
            return  True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def changePrivateKey(self,userId,privateKey):
        cur = self.conn.cursor()
        try:
            sql='''UPDATE t_user SET private_key=%s WHERE id=%s;'''
            cur.execute(sql,(privateKey,userId))
            if cur.rowcount ==0:
                raise Exception('object does not exist')
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def getPublicKey(self, userId):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT public_key FROM t_user WHERE (id={0});'''.format(userId)
            cur.execute(sql)
            publickey = cur.fetchone()
            if publickey is None:
                raise Exception("ERROR: User: {0} has no public key!!!".format(userId))
            return [True, publickey[0]]
        except Exception as e:
            print e
            self.conn.rollback()
            return [False, str(e)]
        finally:
            cur.close()

    def deleteResource(self, resourceId):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_resource WHERE (id=%s); '''
            cur.execute(sql, (resourceId,))
            if cur.rowcount == 0:
                raise Exception('object does not exist')
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def deleteUser(self, userId):
        cur = self.conn.cursor()
        try:
            # 删除用户，同时让他下线
            sql = '''DELETE FROM t_user WHERE (id=%s);DELETE FROM t_login WHERE (id=%s); '''
            cur.execute(sql,(userId,))
            if cur.rowcount ==0:
                raise Exception('object does not exist')
            self.conn.commit()
            return  True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def deleteRole(self, roleId):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_role WHERE (id={0}); '''.format(roleId)
            cur.execute(sql)
            if cur.rowcount ==0:
                raise Exception('object does not exist')
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def listLogin(self,):
        cur = self.conn.cursor()
        try:
            sql = ''' SELECT * FROM t_login ;'''
            cur.execute(sql)
            self.conn.commit()
            r = cur.fetchall()
            return r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def grantRoleToRole(self,childRole_id, parentRoleIdTuple):
        cur = self.conn.cursor()
        try:
            vals = ""
            for i, ID in enumerate(parentRoleIdTuple):
                if i == 0:
                    vals += "({0},{1})".format(childRole_id, ID)
                else:
                    vals += ",({0},{1})".format(childRole_id, ID)

            sql = '''INSERT INTO t_role_memberof(child_role_id, parent_role_id) VALUES {0};'''.format(vals)
            cur.execute(sql)
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def revokeRoleFromRole(self, childRole_id, parentRoleIdTuple):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_role_memberof
                     WHERE t_role_memberof.child_role_id={0}
                     AND t_role_memberof.parent_role_id IN {1};'''.format(childRole_id, str(parentRoleIdTuple))
            cur.execute(sql)
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def myRole(self, userId):
        cur = self.conn.cursor()
        try:
            sql = ''' select role_id, role_name from t_role as r inner join t_user_role as ur on  r.id = ur.role_id
                    where  user_id = %s; '''
            cur.execute(sql,(userId,))
            r = cur.fetchone()
            return r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def listResourceType(self):
        cur = self.conn.cursor()
        try:
            sql = ''' select id, name from t_resource_type;'''
            cur.execute(sql)
            r = cur.fetchall()
            return r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def hasPermission(self, roleId, permissionId, resourceId ):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT * FROM t_role_permission_resource WHERE role_id= %s and permission_id=%s and resource_id =%s;'''
            cur.execute(sql,(roleId, permissionId, resourceId))
            r1 = cur.fetchall()
            if len(r1)== 0:
                return False
            else:
                return True
        except Exception as e:
            print e
            return False
        finally:
            cur.close()


    def listTypeResource(self, userId,typeId):
        cur = self.conn.cursor()
        try:
            sql = '''select id,name from t_resource where resource_type_id = %s and id in
            (select resource_id from t_role_permission_resource where role_id=(select user_id from t_user_role where user_id=%s)); '''
            cur.execute(sql,(typeId,userId))
            r =cur.fetchall()
            return r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def myInformation(self, userId, rName):
        cur = self.conn.cursor()
        try:
            rValue = {}
            for i in rName:
                sql = ''' select {0} from t_user where id = {1}; '''.format(i,userId)
                cur.execute(sql)
                v = cur.fetchone()
                rValue[i]=v[0]
            return rValue
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def changeMyInformation(self,userId, reqDic):
        cur = self.conn.cursor()
        try:
            for k,v in reqDic.items():
                sql = '''UPDATE t_user SET {1}='{2}' WHERE id={0};  '''.format(userId,k,v)
                cur.execute(sql)
                if cur.rowcount ==0:
                    raise Exception('object does not exist')
            self.conn.commit()
            return True
        except Exception as e :
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def changeMyPassword(self, userId, oldPassword, newPassword):
        try:
            cur = self.conn.cursor()
            sql = '''select count(*) from t_user where id={0} and password='{1}'; '''.format(userId, oldPassword)
            cur.execute(sql)
            v = cur.fetchone()
            if v[0] == 1:
                sql='''UPDATE t_user SET password='{1}' WHERE id={0};'''.format(userId, newPassword)
                cur.execute(sql)
                if cur.rowcount ==0:
                    raise Exception('object does not exist')
                self.conn.commit()
                return 0
            else:
                return 1
        except Exception as e:
            print e
            self.conn.rollback()
            return  2
        finally:
            cur.close()


    def allUserInformation(self, rName):
        cur = self.conn.cursor()
        try:
            select=','.join(rName)
            sql = ''' select {0} from t_user; '''.format(select)
            cur.execute(sql)
            rValue = cur.fetchall()
            return rValue
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def allResourceInformation(self):
        cur = self.conn.cursor()
        try:
            sql = ''' select id, name, resource_type_id from t_resource; '''
            cur.execute(sql)
            rValue = cur.fetchall()
            return rValue
        except Exception as e:
            print e
            return False
        finally:
            cur.close()








    def aaa(self,rname):
        cur = self.conn.cursor()
        c=",".join(rname)

        sql='''select ({0}) from t_user'''.format(c)
        # sql = ''' DELETE FROM t_user WHERE (id=%s);'''
        cur.execute(sql)
        aaa=cur.fetchall()

        self.conn.commit()
        #a = cur.fetchall()
        cur.close()
        c= cur.rowcount
        return c
        #self.conn.commit()
        # sql2='''rollback;'''
        # cur.execute(sql2)
        #self.conn.rollback()




if __name__=='__main__':

    conn = psycopg2.connect(database="acl2", user="postgres", password="powerup", host="127.0.0.1", port="5432")
    aa = mysql(conn)
    aa=mysql(conn)
    c= aa.aaa(['id', 'name'])
    print c
    #conn.rollback()
    #aa.createResourceTable()
    #c=aa.md5('13866sj')
    # print aa.md5('1231')
    # print aa.md5('1232')
    # print aa.md5('1233')
    # print aa.md5('1234')
    # print aa.md5('1235')


    # logins=aa.listLogin(50, 6)
    # for i in logins:
    #     print i[0],i[1]


    #print c
    # a=aa.listPermission(14,1)
    # for i in a:
    #    # print 'roleId = %s ,roleName = %s' % i
    #     print i
    #aa.InsertResourceType('1','3')

    #aa.createResourceTypeTable()
    # q = aa.CreateLoginTable()
    # aa.createResourceTypeTable()
    # aa.createResourceTable()
    # aa.createRoleTable()
    # aa.createuserTable()
    # aa.createPermissionTable()
    # aa.createUerRoleTable()
    # aa.createRolePermissionTable()
    # try:
    #     print 125
    #     aa.createResourceTypeTable()
    # except:
    #     print 123


    #c = aa.AddResourceType('qweq','qwe','qw3')
    #c = aa.AddResourceType(121,1,22,2)
    #print c
    # for i in c:
    #     print i
    #     print 1231231
    # print c==1

    #a = aa.AddResource(restypeid, name, description)

    # a = aa.AddResource(2, 'test1', 'this is a test')
    # print a
    # print a[0]
    # for i in a:
    #     print "resourceId is : %s" % i






# cur = conn.cursor()
# cur.execute("CREATE TABLE test(id serial PRIMARY KEY, num integer,data varchar);")
# # insert one item
# cur.execute("INSERT INTO test(num, data)VALUES(%s, %s)", (1, 'aaa'))
# cur.execute("INSERT INTO test(num, data)VALUES(%s, %s)", (2, 'bbb'))
# cur.execute("INSERT INTO test(num, data)VALUES(%s, %s)", (3, 'ccc'))
#
# cur.execute("SELECT * FROM test;")
# rows = cur.fetchall()        # all rows in table
# print(rows)
# for i in rows:
#     print(i)
# conn.commit()
# cur.close()



#cur1 = conn.cursor()
# cur1.execute('''
#        CREATE TABLE company
#        (ID INT PRIMARY KEY     NOT NULL,
#        NAME           TEXT    NOT NULL,
#        AGE            INT     NOT NULL,
#        TEL            INT     NOT NULL,
#        ADDRESS        CHAR(50),
#        SALARY         REAL);
#         ''')
# cur1.execute('''INSERT INTO COMPANY (ID,NAME,AGE,TEL,ADDRESS,SALARY)
#                VALUES (2, 'Poo', 12, 567812349,'Ca', 80000.00 );''')
#
# cur1.execute("SELECT id, name,  salary  from COMPANY")
# rows = cur1.fetchall()
# for row in rows:
#    print "ID = ", row[0]
#    print "NAME = ", row[1]
#    print "SALARY = ", row[2], "\n"
#
# print "Operation done successfully";


#cur1.execute("UPDATE COMPANY set SALARY = 25000.00 where ID=1")



