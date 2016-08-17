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

class mysql2(object):

    def __init__(self,conn):
        self.conn = conn




    def putContent(self,userId, content, key ):
        cur = self.conn.cursor()
        try:
            sql = '''INSERT INTO t_content(content) VALUES (%s);'''
            cur.execute(sql,(content,))
            sql2= '''  SELECT currval('t_content_id_seq');'''
            cur.execute(sql2)
            r1 = cur.fetchone()
            sql3 = '''INSERT INTO t_key(enkey, content_id, user_id) VALUES (%s,%s,%s);'''
            cur.execute(sql3,(key, r1[0],userId))
            sql4 =  '''  SELECT currval('t_key_id_seq');'''
            cur.execute(sql4 )
            r2 = cur.fetchone()
            self.conn.commit()
            return r1[0], r2[0]
        except Exception as e:
            print e
            self.conn.rollback()
            return False,False
        finally:
            cur.close()

    def putSeriesContent(self,userId, seriesContent):
        cur = self.conn.cursor()
        result= []
        try:
            for i in seriesContent:
                sql = '''INSERT INTO t_content(content) VALUES (%s);'''
                cur.execute(sql,(i.content,))
                sql2 = '''  SELECT currval('t_content_id_seq');'''
                cur.execute(sql2 )
                r1 = cur.fetchone()
                sql3 = '''INSERT INTO t_key(enkey, content_id, user_id) VALUES (%s,%s,%s);'''
                cur.execute(sql3,(i.key, r1[0],userId))
                sql4 =  '''  SELECT currval('t_key_id_seq');'''
                cur.execute(sql4 )
                r2 = cur.fetchone()
                result.append([i.name, r1[0], r2[0]])
            self.conn.commit()
            return result
        except Exception as e:
            print e
            self.conn.rollback()
            return False,False
        finally:
            cur.close()



    def putKey(self, key, contentId, userId):
        cur = self.conn.cursor()
        try:
            sql = '''INSERT INTO t_key(enkey, content_id, user_id) VALUES (%s,%s,%s);'''
            cur.execute(sql,( key, contentId,userId))
            sql2 = '''  SELECT currval('t_key_id_seq');'''
            cur.execute(sql2 )
            r = cur.fetchone()
            self.conn.commit()
            return r[0]
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()


    def getContent(self, contentId, userId):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT content FROM t_content where id =%s ; '''
            cur.execute(sql,(contentId,))
            r1 =cur.fetchone()
            sql2 =  '''SELECT enkey FROM t_key where content_id =%s and user_id =%s ; '''
            cur.execute(sql2,(contentId,userId))
            r2 =cur.fetchone()
            return r1[0], r2[0]
        except Exception as e:
            print e
            return False,False
        finally:
            cur.close()

    def getKey(self, contentId, userId ):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT enkey FROM t_key where content_id =%s and user_id = %s; '''
            cur.execute(sql,(contentId, userId))
            r =cur.fetchone()
            return r[0]
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def deleteContent(self, contentId):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_content WHERE (id=%s); '''
            cur.execute(sql,(contentId,))
            if cur.rowcount ==0:
                raise Exception('contentId does not exist')
            self.conn.commit()
            return  True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()


    def listContent(self, userId):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT content_id,id  FROM t_key WHERE user_id= %s; '''
            cur.execute(sql,(userId,))
            r =cur.fetchall()
            return  r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

if __name__=='__main__':

    #from mypostgresql import sql
        #sql.addresource(body.resourceTypeId, body.name, body.description )
    conn = psycopg2.connect(database="sec1", user="postgres", password="powerup", host="127.0.0.1", port="5432")
    # aa = mysql(conn)
    aa=mysql2(conn)
    c= aa.putContent(1,'dfgd','ddfg')
    print c





