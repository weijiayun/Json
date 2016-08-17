#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
import psycopg2
import json
class ConfigureObjectSql(object):

    def __init__(self,conn):
        self.conn = conn



    def createGridInMapping(self,gridName):
        cur = self.conn.cursor()
        try:
            sql = '''INSERT INTO t_configure_grid_mapping(name) VALUES ('{0}')'''.format(gridName)
            cur.execute(sql)
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return
        finally:
            cur.close()

    def deleteGridInMapping(self,gridName):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_configure_grid_mapping WHERE t_configure_grid_mapping.name='{0}';'''.format(gridName)
            cur.execute(sql)
            if cur.rowcount == 0:
                raise Exception('''The "{0}" doesn't exist'''.format(gridName))
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def deleteConfigureInGridMapping(self,createTime,version,gridName):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT t_configure_grid_mapping.configure_list
                     FROM t_configure_grid_mapping WHERE t_configure_grid_mapping.name ='{0}';'''.format(gridName)
            cur.execute(sql)
            if cur.rowcount == 0:
                raise Exception("grid: {0} has no configure list".format(gridName))
            configlist = json.loads(cur.fetchone()[0])
            newConfigurelist = json.dumps([elem for elem in configlist if elem[0] != createTime and elem[1] != version])
            sql = '''UPDATE t_configure_grid_mapping SET t_configure_grid_mapping.configure_list='{0}'
                     WHERE t_configure_grid_mapping.name = '{1}';'''.format(newConfigurelist,gridName)
            cur.execute(sql)
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return True
        finally:
            cur.close()

    def addConfigureToGridMapping(self, createTime, version, gridName):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT t_configure_grid_mapping.configure_list
                         FROM t_configure_grid_mapping WHERE t_configure_grid_mapping.name ='{0}';'''.format(gridName)
            cur.execute(sql)
            if cur.rowcount == 0:
                raise Exception("grid: {0} has no configure list".format(gridName))
            configlist = json.loads(cur.fetchone()[0])
            if configlist is None:
                configlist = []
            if [createTime, version] not in configlist:
                configlist.append([createTime, version])
            sql = '''UPDATE t_configure_grid_mapping SET t_configure_grid_mapping.configure_list='{0}'
                         WHERE t_configure_grid_mapping.name = '{1}';'''.format(json.dumps(configlist), gridName)
            cur.execute(sql)
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return True
        finally:
            cur.close()
#####################################################
    def getGridFromMapping(self,gridName):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT * FROM t_configure_grid_mapping
                     WHERE t_configure_grid_mapping.name='{0}';'''.format(gridName)
            cur.execute(sql)
            grid = cur.fetchone()
            if grid is None:
                raise Exception('''The "{0} doesn't exist'''.format(gridName))
            return grid
        except Exception as e:
            print e
            return False
        finally:
            cur.close()


    def addConfigureToMapping(self,objectList,version,createTime):
        cur = self.conn.cursor()
        try:
            sql = '''INSERT INTO t_configure_instance_mapping( object_list, version, create_time,) VALUES ('{0}','{1}','{2}')'''\
                     .format(
                             objectList,
                             version,
                             createTime,
                             )
            cur.execute(sql)
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def deleteConfigureInMapping(self,createDate,version):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_configure_instance_mapping
                     WHERE t_configure_instance_mapping.create_time='{0}'
                     AND t_configure_instance.mapping.version='{1}';'''\
                .format(createDate,version)
            cur.execute(sql)
            if cur.rowcount == 0:
                raise Exception("<Create Date: {0}, Version: {1}> is not exist"
                                .format(createDate, version))
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def getConfigureFromMapping(self, createDate, version):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT * FROM t_configure_instance_mapping
                     WHERE t_configure_instance_mapping.create_time='{0}'
                     AND t_configure_instance_mapping.version='{1}';'''.format(createDate, version)
            cur.execute(sql)
            configure = cur.fetchone()
            if configure is None:
                raise Exception("<Create Date: {0}, Version: {1}> is not exist"
                                .format(createDate, version))
            return configure
        except Exception as e:
            print e
            return False
        finally:
            cur.close()


    def createObjectToMapping(self,secId,objectName,collection,templName,templVersion):
        cur = self.conn.cursor()
        try:
            sql = '''INSERT INTO t_configure_object_mapping(id, name, collection, templ_name, templ_version)
            VALUES ({0},'{1}','{2}','{3}','{4}');'''.format(secId,objectName,collection,templName,templVersion)
            cur.execute(sql)
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()


    def deleteObjectInMapping(self,objectId):
        cur = self.conn.cursor()
        try:
            sql = '''DELETE FROM t_configure_object_mapping WHERE t_configure_object_mapping.id={0};'''.format(objectId)
            cur.execute(sql)
            if cur.rowcount == 0:
                raise Exception('''The object Name :{0} doesn't exist'''.format(objectId))
            self.conn.commit()
            return True
        except Exception as e:
            print e
            self.conn.rollback()
            return False
        finally:
            cur.close()

    def getObjectFromMapping(self,objectName):
        cur = self.conn.cursor()
        try:
            sql = '''SELECT * FROM t_configure_object_mapping WHERE name='{0}';'''.format(objectName)
            cur.execute(sql)
            Objectdata = cur.fetchone()
            if Objectdata is None:
                raise Exception('''The object: {0} the is None'''.format(objectName))
            return Objectdata
        except Exception as e:
            print e
            return False
        finally:
            cur.close()




if __name__ == "__main__":

    conn = psycopg2.connect(database= "config3",user='postgres',password='powerup',host='127.0.0.1',port='5432')
    a= ConfigureObjectSql(conn)
    #c=a.DeleteConfigureInGrid("g1","20160101","v1","b1")

    print c






