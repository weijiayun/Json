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
    #conn = psycopg2.connect(database="acl", user="postgres", password="powerup", host="127.0.0.1", port="5432")

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


    # print threading.activeCount()
    # t = threading.Timer(20.0, sessionTimeOut,[key])
    # t.start()
    # print threading.activeCount()
    # time.sleep(3)
    # t = threading.Timer(20.0, sessionTimeOut,[key])
    # t.cancel()
    # print threading.activeCount()









    def login(self,userName, password):
        cur = self.conn.cursor()
        try:
            # sql3 = ''' SELECT id FROM t_user WHERE name=%s AND password =%s ;'''
            # cur.execute(sql3,(userName,password))
            # a = cur.fetchone()
            # if a is None:
            #     return 0,0
            # userId = a[0]
            # sql = '''INSERT INTO t_login (user_id) VALUES (%s);'''
            # cur.execute(sql,(userId,))
            # sql2 = '''SELECT seq_id FROM t_login WHERE (user_id=%s) ;'''
            # cur.execute(sql2,(userId,))
            # r =cur.fetchone()
            # self.conn.commit()
            # return r, userId



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




    def insertResource(self, userId,restypeid, name, description):
        cur = self.conn.cursor()
        try:
            sql='''INSERT INTO t_resource (resource_type_id, name, description) VALUES (%s, %s, %s);'''
            cur.execute(sql,(restypeid, name, description))
            sql2='''  SELECT currval('t_resource_id_seq');'''
            cur.execute(sql2)
            r = cur.fetchone()
            sql3='''select id from t_permission where resource_type_id = %s;'''
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
        try:
            cur = self.conn.cursor()
            sql = '''INSERT INTO t_role(role_name) VALUES (%s );'''
            cur.execute(sql,(rolename,))
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
            sql = '''INSERT INTO t_user (name, phone_number,password, private_key, public_key) VALUES (%s,%s,%s,%s,%s);'''
            cur.execute(sql,(name, phoneNumber, password, privateKey, publicKey))
            sql2 = '''  SELECT currval('t_user_id_seq');'''
            cur.execute(sql2 )
            r =cur.fetchone()
            self.conn.commit()
            return r
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()



    def insertPermission(self,name, description, resourceTypeId ):
        cur = self.conn.cursor()
        try:
            sql = '''INSERT INTO t_permission (name, description, resource_type_id) VALUES (%s,%s,%s);'''
            cur.execute(sql,( name, description, resourceTypeId))
            self.conn.commit()
        except Exception as e:
            print e
            self.conn.rollback()
        finally:
            cur.close()

    def insertRPR(self,roleId, permissionId, resourceId):
        cur = self.conn.cursor()
        try:
            sql='''INSERT INTO t_role_permission_resource (role_id, permission_id, resource_id) VALUES (%s, %s, %s);'''
            cur.execute(sql,(roleId, permissionId, resourceId))
            self.conn.commit()
        except Exception as e:
            print e
            self.conn.rollback()
        finally:
            cur.close()

    def grantUserRole(self,userId,roleId):
        try:
            cur = self.conn.cursor()
            sql='''INSERT INTO t_user_role (user_id, role_id) VALUES (%s, %s);'''
            cur.execute(sql,(userId,roleId))
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()



    def changePassword(self,userId,password):
        try:
            cur = self.conn.cursor()
            sql='''UPDATE t_user SET password=%s WHERE id=%s;'''
            cur.execute(sql,(password,userId))
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



    def listRole(self):
        cur = self.conn.cursor()
        try:
            self.conn.commit()
            sql = '''SELECT * FROM t_role; '''
            cur.execute(sql,)
            r =cur.fetchall()
            return r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()


    def listResource(self, userId):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT id, name FROM t_resource WHERE id in (SELECT resource_id FROM t_role_permission_resource
                    WHERE role_id = (SELECT role_id FROM t_user_role WHERE user_id = %s) ); '''
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
            r =cur.fetchall()
            return r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()


    def grantPermission(self,roleId,permissionId,resourceId):
        try:
            cur = self.conn.cursor()
            sql='''INSERT INTO t_role_permission_resource (role_id, permission_id, resource_id) VALUES (%s, %s, %s);'''
            cur.execute(sql,(roleId, permissionId, resourceId))
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
            sql='''SELECT id, name FROM t_permission WHERE id in (SELECT permission_id FROM t_role_permission_resource
                    WHERE role_id = (SELECT role_id FROM t_user_role WHERE user_id = %s));'''
            cur.execute(sql,(userId,))
            r=cur.fetchall()
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



    def changeRoleName(self,roleId,roleName):
        cur = self.conn.cursor()
        try:
            sql='''UPDATE t_role SET role_name=%s WHERE id=%s;'''
            cur.execute(sql,(roleName,roleId))
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
            return  True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()


    def deleteResource(self, resourceId):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_resource WHERE (id=%s); '''
            cur.execute(sql,(resourceId,))
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
            sql = '''DELETE FROM t_role WHERE (id=%s); '''
            cur.execute(sql,(roleId,))
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


    def inheritPermission(self,prole,crole):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT * FROM t_role_permission_resource WHERE role_id= %s;'''
            cur.execute(sql,(prole,))
            r1 = cur.fetchall()
            for i in r1:
                sql2 = ''' INSERT INTO t_role_permission_resource (role_id, permission_id, resource_id) VALUES (%s, %s, %s);'''
                cur.execute(sql2,(crole,i[1],i[2]))
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()


    def releaseRole(self, roleId):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_user_role WHERE (role_id=%s);
                     DELETE FROM t_role_permission_resource WHERE (role_id=%s)  ; '''
            cur.execute(sql,(roleId,roleId))
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


    def myRole (self,userId):
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



    def aaa(self,key, userId):
        cur = self.conn.cursor()
        sql='''UPDATE t_user SET private_key=%s WHERE id=%s;'''
        # sql = ''' DELETE FROM t_user WHERE (id=%s);'''
        cur.execute(sql,(key,userId))
        self.conn.commit()
        #a = cur.fetchall()
        cur.close()
        c= cur.rowcount
        return c
        #self.conn.commit()
        # sql2='''rollback;'''
        # cur.execute(sql2)
        #self.conn.rollback()

# class Timer(threading.Thread):
#     def __init__(self, seconds):
#         self.runTime = seconds
#         threading.Thread.__init__(self)
#     def run(self):
#         time.sleep(self.runTime)
#         print "Buzzzz!! Time's up!"
#
# class sessionTimeOut(Timer):
#     #a timer that execute an action at the end of the timer run.
#     def __init__(self, seconds, action, args=[]):
#         self.args = args
#         self.action = action
#         Timer.__init__(self, seconds)
#     def run(self):
#         Timer.run(self)
#         self.action(self.args)
# def myAction(args=[]):
#     print "Performing my action with args:"
#     print args
#
# # if __name__ == "__main__":
# #     print 123321
# #     t = sessionTimeOut(10, myAction, ["hello", "world",'123'])
# #     t.start()
# #
# #     time.sleep(2)
# #     print 123
# #     t = sessionTimeOut(3, myAction, ["hello", "world"])
# #     t.start()
#
#
#
# if __name__=='__main__':
#
#     #from mypostgresql import sql
#         #sql.addresource(body.resourceTypeId, body.name, body.description )
#     conn = psycopg2.connect(database="acl2", user="postgres", password="powerup", host="127.0.0.1", port="5432")
#     # aa = mysql(conn)
#     aa=mysql(conn)
#     c= aa.aaa(8,5)
#     print c
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



