#coding: utf-8
import psycopg2
import hashlib
import time
import logging
import os
from PIL import Image
from array import *
'''
创建所需数据表，完成数据插入、查找、删除、修改等功能
'''

class mysql2(object):

    def __init__(self,conn):
        self.conn = conn

    def putImg(self,img ):
        cur = self.conn.cursor()
        try:
            sql = '''INSERT INTO t_img(img) VALUES (%s);'''
            cur.execute(sql,(img,))
            sql2= '''  SELECT currval('t_img_id_seq');'''
            cur.execute(sql2)
            r1 = cur.fetchone()
            self.conn.commit()
            return r1[0]
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()


    def getImg(self, imgId):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT img  FROM t_img where id =%s ; '''
            cur.execute(sql,(imgId,))
            r1 =cur.fetchone()
            return r1[0]
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

if __name__=='__main__':

    conn = psycopg2.connect(database="img", user="postgres", password="powerup", host="127.0.0.1", port="5432")
    # aa = mysql(conn)
    aa=mysql2(conn)

    # im = Image.open("aa.jpg").convert('L')
    fp = open('aa.jpg','rb')
    im = fp.read()
    fp.close()
    # b=i.read()
    # print b
    # c= aa.putImg(psycopg2.Binary(im))
    c= aa.putImg(im)
    print c


    d = aa.getImg(1)

    print 123
    print d





































