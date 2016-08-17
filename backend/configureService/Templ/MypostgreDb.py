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
# 写入日志
def write_log(log_type, url, message,operation):
    logger = '\n错误链接：%s\n错误信息：%s\n%s\n执行操作：%s\n' % (url, message, operation, '-'*50)
    if log_type == 'error':
        logging.error(logger)
    elif log_type == 'warning':
        logging.warning(logger)


class mydb(object):

    def __init__(self,conn):
        self.conn = conn

    def md5(self,str):
        self.str = str
        m = hashlib.md5()
        m.update(self.str)
        return m.hexdigest()

    def sessionTimeOut(self):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_login ; '''
            cur.execute(sql)
            self.conn.commit()
            return  True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()


    def TemplToAttr(self,name,version,content):#由模板转化为属性字段存储
        cur = self.conn.cursor()


    def RelationTree(self,name,version,content):#建立json关系树
        cur = self.conn.cursor()


    def CheckVersion(self,name,version): #check模板的版本
        cur = self.conn.cursor()
        try:
            sql1='''SELECT * FROM t_json_type WHERE (type_name=%s AND templversion=%s);'''
            cur.execute(sql1,(name, version))
            r=cur.fetchone()
            return r
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def CheckRelVersion(self,name,version):#检查json的版本
        cur = self.conn.cursor()
        try:
            sql1='''SELECT * FROM t_baserelation WHERE (type_name=%s AND templversion=%s);'''
            cur.execute(sql1,(name, version))
            r=cur.fetchone()
            return r
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def download(self,name,version):#下载
        cur = self.conn.cursor()
        try:
            sql1='''SELECT security_cid FROM t_json_type WHERE (type_name=%s AND templversion=%s);'''
            cur.execute(sql1,(name, version))
            r=cur.fetchone()
            return r
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    #更新json内容
    def UpDateJsonAttr(self,type_name,version,basename,security_cid,
                       security_jid,iscomposite,resource_id,templ_type):
        cur = self.conn.cursor()
        try:
            sql='''UPDATE t_json_type SET basename= %s,security_cid= %s,security_jid= %s,
            iscomposite= %s,resource_id= %s,templ_type= %s WHERE (type_name=%s AND templversion=%s);'''
            cur.execute(sql,(basename,security_cid,security_jid,iscomposite,resource_id,templ_type,type_name, version))
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    #创建新版本
    def CreateJsonAttr(self,type_name,version,basename,security_cid,
                       security_jid,iscomposite,resource_id,templ_type):
        cur = self.conn.cursor()
        try:
            sql='''INSERT INTO t_json_type (type_name, templversion, basename,security_cid,security_jid,iscomposite,resource_id,templ_type) VALUES (%s,%s,%s,%s,%s,%s,%s,%s);'''
            cur.execute(sql,(type_name, version, basename, security_cid, security_jid,iscomposite,resource_id,templ_type))
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    #上传文件后更新关系表
    def UpdateRelation(self,type_name,version,basename):
        cur = self.conn.cursor()
        try:
            sql1='''SELECT * FROM t_baserelation WHERE (type_name=%s AND templversion=%s);'''
            cur.execute(sql1,(type_name, version))
            r=cur.fetchone()
            if r != None and r != []:
                if basename != None:
                    try:
                        sql='''UPDATE t_baserelation SET base=%s, baseversion=%s WHERE (type_name=%s AND templversion=%s);'''
                        cur.execute(sql,(basename, version,type_name, version))
                        self.conn.commit()
                        return True
                    except Exception as e:
                        print e
                        self.conn.rollback()
                        return False
                else:
                    pass
            elif r == None or r == []:
                if basename != None:
                    try:
                        sql='''INSERT INTO t_baserelation (type_name,templversion,base,baseversion) VALUES (%s,%s,%s,%s);'''
                        cur.execute(sql,(type_name, version, basename, version))
                        self.conn.commit()
                        return True
                    except Exception as e:
                        print e
                        self.conn.rollback()
                        return False
                else:
                    try:
                        sql='''INSERT INTO t_baserelation (type_name,templversion) VALUES (%s,%s);'''
                        cur.execute(sql,(type_name, version))
                        self.conn.commit()
                        return True
                    except Exception as e:
                        print e
                        self.conn.rollback()
                        return False
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    #循环查找该节点所有child
    def JsonRelation(self,name,version):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT base,baseversion FROM t_baserelation WHERE (type_name=%s AND templversion=%s);'''
            cur.execute(sql, (name, version))
            r = cur.fetchone()
            a = []
            a.append(r)
            check = True
            while check == True:
                if a[-1] != None:
                    try:
                        sql = '''SELECT base,baseversion FROM t_baserelation WHERE (type_name=%s AND templversion=%s);'''
                        cur.execute(sql, (a[-1][0],a[-1][1]))
                        a.append(cur.fetchone())
                    except Exception as e:
                        print e
                        self.conn.rollback()
                        return False
                else:
                    a.pop()
                    check = False
            return a
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    #基类查看
    def BaseCheck(self,name,version):
        cur = self.conn.cursor()
        try:
            sql='''SELECT base,baseversion FROM t_baserelation WHERE (type_name=%s AND templversion=%s);'''
            cur.execute(sql,(name, version))
            r=cur.fetchone()
            return r
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    #获取json属性数据
    def GetAttr(self,name,version):
        cur = self.conn.cursor()
        try:
            sql='''SELECT security_jid FROM t_json_type WHERE (type_name=%s AND templversion=%s);'''
            cur.execute(sql,(name, version))
            r=cur.fetchone()
            return r
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()