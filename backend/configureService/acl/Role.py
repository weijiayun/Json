import psycopg2

class Role(object):
    def __init__(self, roleId):
        self.__db = psycopg2.connect(database="ACL", user="weijiayun",
                                        password="weijiayun", host="127.0.0.1",
                                        port="5432").cursor()
        self.__roleId = roleId
        self.__parentsRoleId = set()
        self.__permissionTable = {}
        self.__resourceTable = {}
        self.__rolePermission = set()
        self.__resources = {}
        self.update()

    def __getResources(self, idList, groupPerms=None):
        for resId in idList:
            sql = '''SELECT * FROM t_resource
                     WHERE t_resource.id={0}'''.format(resId)
            self.__db.execute(sql)
            resList = self.__db.fetchall()
            for row in resList:
                if not row[4]:
                    if groupPerms:
                        self.__resourceTable[resId] = groupPerms
                    self.__resources[row[0]] = [row, self.__resourceTable[resId]]#,self.__share[resId]]
                else:
                    sql = '''SELECT resource_id FROM t_group_resource WHERE group_id={0}'''.format(resId)
                    self.__db.execute(sql)
                    temp = self.__db.fetchall()
                    groupList = [x[0] for x in temp]
                    self.__getResources(groupList,self.__resourceTable[resId])

    def __findParents(self, roleId):
        sql = '''SELECT parent_role_id FROM t_role_memberof WHERE t_role_memberof.child_role_id={0}'''.format(roleId)
        self.__db.execute(sql)
        if self.__db.rowcount == 0:
            raise Exception('Error:has no role!!!')
        parents = [x[0] for x in self.__db.fetchall()]
        for pt in parents:
            if pt != roleId:
                self.__findParents(pt)
            else:
                self.__parentsRoleId.add(pt)

    def update(self):
        try:
            self.__findParents(self.__roleId)
            sql = '''SELECT * FROM t_permission'''
            self.__db.execute(sql)
            if self.__db.rowcount == 0:
                raise Exception('Error:has no role!!!')
            for i, name, description in self.__db.fetchall():
                self.__permissionTable[i] = {"name": name, "description": description, "id": i}
            strTupleParentsRoleId = "("
            for i, key in enumerate(self.__parentsRoleId):
                if i == len(self.__parentsRoleId) - 1:
                    strTupleParentsRoleId += "{0})".format(key)
                else:
                    strTupleParentsRoleId += "{0},".format(key)
            sql = '''SELECT * FROM t_role_permission_resource
                     WHERE t_role_permission_resource.role_id in {0}'''.format(strTupleParentsRoleId)
            self.__db.execute(sql)
            self.__share = {}
            for roleId, permId, resId in self.__db.fetchall():
                if not resId in self.__resourceTable:
                    self.__resourceTable[resId] = set()
                if not roleId in self.__share:
                    self.__share[roleId] = {}
                if not resId in self.__share[roleId]:
                    self.__share[roleId][resId] = set()
                self.__share[roleId][resId].add(self.__permissionTable[permId]["name"])
                self.__rolePermission.add(self.__permissionTable[permId]["name"])
                self.__resourceTable[resId].add(self.__permissionTable[permId]["name"])
            from copy import deepcopy
            print self.__share
            backupOfResourceTable = deepcopy(self.__resourceTable)
            self.__getResources(backupOfResourceTable)
        except Exception as e:
            print e
        finally:
            self.__db.close()

    def __getRoleResourcePerms(self):
        return self.__share
    def hasPermission(self, permission, resource_id):
            if resource_id in self.__resources:
                return permission in self.__resources[resource_id][1]
            else:
                return False
    def addParentRoles(self, parentRoles):
        if isinstance(parentRoles, list) or isinstance(parentRoles, tuple):
            for pRole in parentRoles:
                if not pRole.getRoleId() in self.__parentsRoleId:
                    for pid in pRole.getParents():
                        pass
                        #if pRole.__getRoleResourcePerms()[pid]
                    self.__parentsRoleId.update(pRole.getParents())
                    self.__resources = dict(self.__resources, **pRole.getResources())# the last will cover the one before the last
        else:
            if not parentRoles.getRoleId() in self.__parentsRoleId:
                self.__parentsRoleId.update(parentRoles.getParents())
                self.__resources = dict(self.__resources, **parentRoles.getResources())
    
    def removeParentRoles(self, parentRoles):
        if isinstance(parentRoles, list) or isinstance(parentRoles, tuple):
            for pRole in parentRoles:
                if pRole.getRoleId() in self.__parentsRoleId:
                    self.__parentsRoleId.difference_update(pRole.getParents())
                    self.__resources = {x: self.__resources[x] for x in self.__resources if x not in pRole.getResources()}
        else:
            if parentRoles.getRoleId() in self.__parentsRoleId:
                self.__parentsRoleId.difference_update(parentRoles.getParents())
                self.__resources = {x: self.__resources[x] for x in self.__resources if x not in parentRoles.getResources()}


    def getResources(self):
        return self.__resources
    
    def getParents(self):
        return tuple(self.__parentsRoleId)
    
    def getRoleId(self):
        return self.__roleId

class RPR(object):
    def __init__(self):
        self.resId = set()
        self.perms = set()
        self.roleId = set()

    def add(self, resId, perms, roleId):
        self.resId.add(resId)
        self.perms.add(perms)
        self.roleId.add(roleId)

class RoleManager(object):
    def __init__(self):
        try:
            self.__db = psycopg2.connect(database="ACL", user="weijiayun",
                                        password="weijiayun", host="127.0.0.1",
                                        port="5432").cursor()
            self.__roleTable = {}
            self.__allRoles = {}
            self.__allResources = {}
            sql = '''SELECT * FROM t_role'''
            self.__db.execute(sql)
            for rid, rname in self.__db.fetchall():
                self.__roleTable[id] = rname
                self.__allRoles[rname] = Role(roleId=rid)
        except Exception as e:
            print e
        finally:
            self.__db.close()

    def getAllRoles(self):
        return self.__allRoles

    def getAllResources(self):
        return self.__allResources

    def addRole(self, roleId, newRoleName):
        if not newRoleName in self.__allRoles:
            self.__allRoles[newRoleName] = Role(roleId)

    def removeRole(self, roleName):
        if roleName in self.__allRoles:
            del self.__allRoles[roleName]

RM = RoleManager()
roles = RM.getAllRoles()
print roles["IM"].hasPermission("e",9)
roles["IM"].addParentRoles(roles["reachLeader2"])
print roles["IM"].getParents()
print roles["IM"].getResources()


