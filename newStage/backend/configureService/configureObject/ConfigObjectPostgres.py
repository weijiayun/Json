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
                    category = temp2[3]
                    templName = temp2[4]
                    collectionName = temp2[5]
                    temp1.append([secId, name, createDate, version, category, templName, collectionName])

                def list2str(li):
                    return "("+"{0},'{1}','{2}','{3}','{4}', '{5}', '{6}'"\
                        .format(li[0], li[1], li[2], li[3], li[4], li[5], li[6])+")"
                temp1 = map(list2str, temp1)
                temp1 = ",".join(temp1)
                sql = '''INSERT INTO t_object(id, name, create_date, version, category, template_name, collection_name) VALUES {0};'''.format(temp1)
                cur.execute(sql)
                self.conn.commit()
                return [True, "Create Objects Successfully!!!"]
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

    def getObject(self, objectName, createDate, version, category, templateName, collectionName):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT * FROM t_object WHERE t_object.name='{0}'
                          AND t_object.create_date='{1}'
                          AND t_object.version='{2}'
                          AND t_object.template_name='{3}'
                          AND t_object.category='{4}'
                          AND t_object.collection_name='{5}';'''\
                .format(objectName,
                        createDate,
                        version,
                        templateName,
                        category,
                        collectionName)
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

