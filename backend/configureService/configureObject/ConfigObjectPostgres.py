#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
import psycopg2
import json,redis
class ConfigureObjectSql(object):

    def __init__(self,conn):
        self.conn = conn

    def createConfigure(self, objectList, name, version, createDate):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT * FROM t_configure
                     WHERE t_configure.create_date='{0}'
                           AND t_configure.version='{1}'
                           AND t_configure.name='{2}';'''.format(createDate, version, name)
            cur.execute(sql)
            selectval = cur.fetchone()
            if selectval is None:
                sql = '''INSERT INTO t_configure(object_list, name, version, create_date)
                         VALUES ('{0}','{1}','{2}','{3}');'''\
                         .format(objectList,
                                 name,
                                 version,
                                 createDate)
            else:
                raise Exception("The configure<Name: {0},Version: {1}, createDate: {2}> has already existed".format(name, version, createDate))
            cur.execute(sql)
            self.conn.commit()
            return [True, "Create configure<Name: {0},Version: {1}, createDate: {2}> successfully".format(name, version, createDate)]
        except Exception as e:
            print e
            self.conn.rollback()
            return [False, str(e)]
        finally:
            cur.close()

    def deleteConfigure(self, name, createDate, version):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT * FROM t_configure
                     WHERE t_configure.create_date='{0}'
                           AND t_configure.version='{1}'
                           AND t_configure.name='{2}';'''.format(createDate, version,name)
            cur.execute(sql)
            if cur.fetchone() is not None:
                sql = '''DELETE FROM t_configure
                         WHERE t_configure.version='{0}'
                               AND t_configure.create_date='{1}'
                               AND t_configure.name='{2}';'''.format(version,createDate,name)
                cur.execute(sql)
                self.conn.commit()
                return [True, "delete configure<Name: {0}, Date: {1}, Version: {2}> in mapping successfully".format(name, createDate, version)]
            else:
                raise Exception("Error: The Configure <Name: {0}, Date: {0}, Version: {1}> is not exist!!!".format(name, createDate, version))
        except Exception as e:
            print e
            self.conn.rollback()
            return [False, str(e)]
        finally:
            cur.close()

    def getConfigure(self, name, createDate, version):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT * FROM t_configure
                     WHERE t_configure.create_date='{0}'
                     AND t_configure.version='{1}'
                     AND t_configure.name='{2}';'''.format(createDate, version, name)
            cur.execute(sql)
            configure = cur.fetchone()
            if configure is None:
                raise Exception("Create <Name: {0}, Date: {1}, Version: {2}> is not exist"
                                .format(name, createDate, version))
            return configure
        except Exception as e:
            return [False, str(e)]
        finally:
            cur.close()

    def createCollection(self, collectionNameIdDict):
        cur = self.conn.cursor()
        try:
            if collectionNameIdDict is not None:
                for key, secId in collectionNameIdDict.items():
                    temp2 = key.split("-")
                    name = temp2[0]
                    createDate = temp2[1]
                    version = temp2[2]
                    category = temp2[3]
                    templName = temp2[4]

                sql = '''INSERT INTO t_collection(content_id, name, create_date, version, category, template_name)
                         VALUES ({0},'{1}','{2}','{3}','{4}','{5}')'''.format(secId, name, createDate, version, category, templName)
                cur.execute(sql)
                sql = '''  SELECT currval('t_content_id_seq');'''
                cur.execute(sql)
                self.conn.commit()
                return [cur.fetchone()[0], name]
            else:
                raise Exception("input is none when creating objects in t_object")
        except Exception as e:
            print e
            self.conn.rollback()
            return [False, str(e)]
        finally:
            cur.close()

    def deleteCollection(self, collectionIdList):
        cur = self.conn.cursor()
        try:
            for objectId in collectionIdList:
                sql = '''DELETE FROM t_collection WHERE t_collection.content_id={0};'''.format(objectId)
                cur.execute(sql)
                if cur.rowcount == 0:
                    raise Exception('''The Collection Name :{0} doesn't exist'''.format(objectId))
            self.conn.commit()
            return [True, "Delete Collection<Id: {0}> successfully".format(str(collectionIdList))]
        except Exception as e:
            print e
            self.conn.rollback()
            return [False, str(e)]
        finally:
            cur.close()

    def getCollection(self, collectionName, createDate, version, category, templateName):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT * FROM t_collection WHERE t_collection.name='{0}'
                          AND t_collection.create_date='{1}'
                          AND t_collection.version='{2}'
                          AND t_collection.category='{3}'
                          AND t_collection.template_name='{4}'

                          '''.format(collectionName, createDate, version, category, templateName)
            cur.execute(sql)
            Objectdata = cur.fetchone()
            if Objectdata is None:
                raise Exception('''Error: the object<Name: {0}> the is not exist!!!'''.format(objectName))
            return Objectdata
        except Exception as e:
            print e
            return False
        finally:
            cur.close()

    def getObjectById(self, objectId):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT * FROM t_object WHERE t_object.id={0};'''.format(objectId)
            cur.execute(sql)
            Objectdata = cur.fetchone()
            if Objectdata is None:
                raise Exception('''Error: the object <Id: {0}> the is not exist!!!'''.format(objectId))
            return [True, Objectdata]
        except Exception as e:
            print e
            return [False, str(e)]
        finally:
            cur.close()

    def getAll(self, contentIdList):
        cur = self.conn.cursor()
        try:
            contentIdList = list(set(contentIdList))
            temp = ",".join(map(lambda x: str(x), contentIdList))
            sql = '''SELECT * FROM t_collection WHERE t_collection.content_id IN ({0});'''.format(temp)
            cur.execute(sql)
            temp = cur.fetchall()
            cateDict = {}
            if cur.rowcount == 0:
                raise Exception('''The Collections:{0} doesn't exist'''.format(contentIdList))
            for e in temp:
                if not cateDict.has_key(e[5]):
                    cateDict[e[5]] = []
                cateDict[e[5]].append([e[2], e[3], e[4], e[5], e[6]])
            return [True, cateDict]
        except Exception as e:
            print e
            return [False, str(e)]
        finally:
            cur.close()

