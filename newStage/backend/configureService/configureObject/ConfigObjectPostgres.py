#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
import psycopg2
import json
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

    def getCollection(self, collectionList):
        cur = self.conn.cursor()
        try:
            temp = ''
            for i in collectionList:
                if collectionList.index(i) == 0:
                    temp += "t_collection.collection_name='{0}'".format(i)
                else:
                    temp += "OR t_collection.collection_name='{0}'".format(i)

            sql = '''SELECT * FROM t_collection
                     WHERE {0};'''.format(temp)
            cur.execute(sql)
            collection = cur.fetchall()
            if collection is None:
                raise Exception("Collection <Name: {0}> is not exist".format(collectionList))
            return collection
        except Exception as e:
            print e
            return [False, str(e)]
        finally:
            cur.close()

    def deleteCollection(self, collectionName, category):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_collection WHERE t_collection.collection_name='{0}'
                     AND t_collection.category='{1}';'''.format(collectionName, category)
            cur.execute(sql)
            if cur.rowcount == 0:
                raise Exception('''The Collection<Name:{0}, Category: {1}> doesn't exist'''.format(collectionName, category))
            self.conn.commit()
            return [True, "Delete collection<Name: {0}, Category: {1}> is successful".format(collectionName, category)]
        except Exception as e:
            print e
            self.conn.rollback()
            return [False, str(e)]
        finally:
            cur.close()

    def deleteObjectInCollection(self, objectIdList, collectionName, category):
        cur = self.conn.cursor()
        try:
            for e in objectIdList:
                sql = '''DELETE FROM t_collection WHERE t_collection.id={0}
                                AND t_collection.collection_name='{1}'
                                AND t_collection.category='{2}';'''.format(e, collectionName, category)
                cur.execute(sql)
            self.conn.commit()
            return [True, "delete object in collection <Name: {0}, Category: {1}> is successfully.".format(collectionName,
                                                                                                           category)]
        except Exception as e:
            self.conn.rollback()
            return [False, str(e)]
        finally:
            cur.close()

    def addObjectListToCollection(self, objectIdList, collectionName, category, templ_list):
        cur = self.conn.cursor()
        try:
            temp = ""
            for e in objectIdList:
                if objectIdList.index(e) == 0:
                    temp += '''({0}, '{1}', '{2}','{3}')'''.format(e, collectionName, category)
                else:
                    temp += ''', ({0}, '{1}', '{2}','{3}')'''.format(e, collectionName, category)
            sql = '''INSERT INTO t_collection(id, collection_name) VALUES {0};'''.format(temp)
            cur.execute(sql)
            self.conn.commit()
            return [True, "Add object in collection<Name: {0}, Category: {1}, Templ_list'{2}'> is successfully".format(collectionName,
                                                                                                      category, templ_list)]
        except Exception as e:
            self.conn.rollback()
            return [False, str(e)]
        finally:
            cur.close()

    def createObject(self, nameIdDict):
        cur = self.conn.cursor()
        try:
            if nameIdDict is not None:
                temp1 = []
                for key, secId in nameIdDict.items():
                    temp2 = key.split("-")
                    name = temp2[0]
                    createDate = temp2[1]
                    version = temp2[2]
                    temp1.append([secId, name, createDate, version])

                def list2str(li):
                    return "("+"{0},'{1}','{2}','{3}'".format(li[0], li[1], li[2], li[3])+")"

                temp1 = map(list2str, temp1)
                temp1 = ",".join(temp1)
                sql = '''INSERT INTO t_object(id, name, create_date, version) VALUES {0};'''.format(temp1)
                cur.execute(sql)
                self.conn.commit()
                return [True, "Create Object Successfully!!!"]
            else:
                raise Exception("input is none when creating objects in t_object")
        except Exception as e:
            print e
            self.conn.rollback()
            return [False, str(e)]
        finally:
            cur.close()

    def deleteObject(self, objectIdList):
        cur = self.conn.cursor()
        try:
            for objectId in objectIdList:
                sql = '''DELETE FROM t_object WHERE t_object.id={0};'''.format(objectId)
                cur.execute(sql)
                if cur.rowcount == 0:
                    raise Exception('''The object Name :{0} doesn't exist'''.format(objectId))
            self.conn.commit()
            return [True, "Delete Object<Id: {0}> successfully".format(str(objectIdList))]
        except Exception as e:
            print e
            self.conn.rollback()
            return [False, str(e)]
        finally:
            cur.close()

    def getObject(self, objectName, createDate, version):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT * FROM t_object WHERE t_object.name='{0}'
                          AND t_object.create_date='{1}'
                          AND t_object.version='{2}';'''.format(objectName, createDate, version)
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

    def listCollections(self):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT DISTINCT t_collection.collection_name FROM t_collection;'''
            cur.execute(sql)
            collections = cur.fetchall()
            if collections is None:
                raise Exception('''Error: there is no collection!!!''')

            return [True, collections]
        except Exception as e:
            print e
            return [False, str(e)]
        finally:
            cur.close()








