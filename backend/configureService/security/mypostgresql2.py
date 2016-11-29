#coding: utf-8
import psycopg2

class mysql2(object):

    def __init__(self, conn, conn2):
        self.conn = conn
        self.conn2 = conn2

    def putContent(self, userId, content, key):
        cur = self.conn.cursor()
        try:
            sql = '''INSERT INTO t_content(content) VALUES (%s);'''
            cur.execute(sql,(content,))
            sql2= '''  SELECT currval('t_content_id_seq');'''
            cur.execute(sql2)
            r1 = cur.fetchone()
            sql3 = '''INSERT INTO t_key(enkey, content_id, possessor_id) VALUES (%s,%s,%s);'''
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
                sql3 = '''INSERT INTO t_key(enkey, content_id, possessor_id, initiator_id)
                        VALUES ('{0}',{1},{2},{2});'''.format(i.key, r1[0], userId)
                cur.execute(sql3)
                sql4 =  '''  SELECT currval('t_key_id_seq');'''
                cur.execute(sql4 )
                r2 = cur.fetchone()
                result.append([i.name, r1[0]])
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

    def putKeys(self, userId, KeyContentIds):
        cur = self.conn.cursor()
        try:
            keyId=[]
            for i in KeyContentIds:
                sql = '''INSERT INTO t_key(enkey, content_id, possessor_id, initiator_id)
                VALUES ('{0}',{1},{2},{3});'''.format(i.key, i.contentId, i.userId, userId)
                cur.execute(sql)
                sql2 = '''  SELECT currval('t_key_id_seq');'''
                cur.execute(sql2)
                r = cur.fetchone()
                keyId.append(r[0])
            self.conn.commit()
            return keyId
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def getSeriesContent(self,userId, contentIds):
        cur = self.conn.cursor()
        result= []
        try:
            for i in contentIds:
                sql = '''SELECT content FROM t_content where id ={0} ; '''.format(i.contentId)
                cur.execute(sql)
                r1 =cur.fetchone()
                sql2 =  '''SELECT enkey FROM t_key where
                content_id ={0} and possessor_id ={1};'''.format(i.contentId, userId)
                cur.execute(sql2)
                r2 =cur.fetchone()
                result.append([i.name, r1[0], r2[0]])
            return result
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def getContent(self, contentId, userId):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT content FROM t_content where id =%s ; '''
            cur.execute(sql,(contentId,))
            r1 = cur.fetchone()
            sql2 = '''SELECT enkey FROM t_key where content_id =%s and possessor_id =%s ; '''
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

    def getKeys(self,userId, contentIds ):
        cur = self.conn.cursor()
        try:
            keyDict = {}
            for k,v in contentIds.items():
                sql = '''SELECT enkey FROM t_key where
                content_id ={0} and possessor_id = {1}; '''.format(v,userId)
                cur.execute(sql)
                r =cur.fetchone()
                keyDict[k]=r[0]
            return keyDict
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def deleteContent(self, contentId):
        cur = self.conn.cursor()
        try:
            for i in contentId:
                sql = '''DELETE FROM t_content WHERE (id={0}); '''.format(i)
                cur.execute(sql)
                if cur.rowcount ==0:
                    raise Exception('contentId does not exist')
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def listContent(self, userId):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT content_id,id  FROM t_key WHERE possessor_id= %s; '''
            cur.execute(sql,(userId,))
            r =cur.fetchall()
            return  r
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def revokeGrant(self,userId, contentIds, otherUserId):
        cur = self.conn.cursor()
        try:
            for k,v in contentIds.items():
                sql = '''DELETE FROM t_key WHERE (content_id={0} and possessor_id={1} and initiator_id={2});'''.format(v, otherUserId, userId)
                cur.execute(sql)
                if cur.rowcount ==0:
                    raise Exception('grant does not exist')
            self.conn.commit()
            return  True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def checkSharer(self, contentId):
        cur1 = self.conn.cursor()
        cur2 = self.conn2.cursor()
        try:
            userDict={}
            sql='''select possessor_id from t_key where content_id={0}'''.format(contentId)
            cur1.execute(sql)
            ids=cur1.fetchall()
            for id in ids:
                sql2='''select name from t_user where id ={}'''.format(id[0])
                cur2.execute(sql2)
                n=cur2.fetchone()
                userDict[n[0]]=id[0]
            return userDict
        except Exception as e:
            print e
            return False
        finally:
            cur1.close()
            cur2.close()







