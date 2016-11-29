import psycopg2

class Role(object):
    def __init__(self, roleId, roleName):
        self.id = roleId
        self.name = roleName
        self.parents = {}
        self.parentTree = {}
        self.resources = {}
        self.resourcePerms = {}

    def __str__(self):
        return r'<Role:(id:{0}, name: {1})>'.format(self.id, self.name)
    __repr__ = __str__

    def getId(self):
        return self.id

    def getName(self):
        return self.name

    def getResources(self):
        return self.resources

    def getResourcePerms(self):
        return self.resourcePerms

    def getParents(self):
        return self.parents

    def getParentTree(self):
        self.parentTree.clear()
        self.__getAllParents(self)
        return self.parentTree

    def __getAllParents(self, role):
        for pid, parent in role.getParents().items():
            if pid == role.getId():
                self.parentTree[pid] = parent
            else:
                self.__getAllParents(parent)

    def getAllResources(self):
        self.parentTree.clear()
        self.__getAllParents(self)
        dictmerged = {}
        for pId, parent in self.parentTree.items():
            dictmerged.update(parent.getResources())
        return dictmerged

    def addParent(self, parentRoles):
        if isinstance(parentRoles, list) or isinstance(parentRoles, tuple):
            for pRole in parentRoles:
                if not pRole.getId() in self.parents:
                    self.parents[pRole.getId()] = pRole
        else:
            if not parentRoles.getId() in self.parents:
                self.parents[parentRoles.getId()] = parentRoles

    def removeParent(self, parentRoles):
        if isinstance(parentRoles, list) or isinstance(parentRoles, tuple):
            for pRole in parentRoles:
                if pRole.getId() in self.parents:
                    del self.parents[pRole.getId()]
        else:
            if parentRoles.getId() in self.parents:
                del self.parents[parentRoles.getId()]

    def addResource(self, resourcePermCouple):
        if isinstance(resourcePermCouple, list):
            for res, perms in resourcePermCouple:
                if isinstance(res, Resource):
                    if not res.getId() in self.resources:
                        self.resources[res.getId()] = (res, perms)
                else:
                    raise TypeError("please input the instance of type Role")
        else:
            if isinstance(resourcePermCouple[0], Resource):
                if not resourcePermCouple[0].getId() in self.resources:
                    self.resources[resourcePermCouple[0].getId()] = resourcePermCouple
            else:
                raise TypeError("please input the instance of type Role")

    def removeResource(self, resources):
        if isinstance(resources, list) or isinstance(resources, tuple):
            for res in resources:
                if res.getId() in self.resources:
                    del self.resources[res.getId()]
                    res.removeRole(self)
        else:
            if resources.getId() in self.resources:
                del self.resources[resources.getId()]
                resources.removeRole(self)

    def hasPermission(self, resourceId, permisiion):
        self.parentTree.clear()
        self.__getAllParents(self)
        result = False
        for pId, pRole in self.parentTree.items():
            if resourceId in pRole.getResources():
                result = result or permisiion in pRole.getResources()[resourceId][1]
        return result

class Resource(object):
    def __init__(self, resId, name, resourceType, contentId, isGroup):
        self.id = resId
        self.name = name
        self.resourceType = resourceType
        self.contentId = contentId
        self.isGroup = isGroup

    def __str__(self):
        return "Resource <id:{0},name: {1}>".format(self.id, self.name)
    __repr__ = __str__

    def getId(self):
        return self.id

    def getName(self):
        return self.name

    def getResourceType(self):
        return self.resourceType

    def getContentId(self):
        return self.contentId

    def isGroup(self):
        return self.isGroup


class ResourceType(object):

    def __init__(self, resourceTypeId, resourceTypeName, description=None, permissionIdList=list()):
        self.id = resourceTypeId
        self.name = resourceTypeName
        self.description = description
        self.permissions = permissionIdList

    def __repr__(self):
        return r'ResourceType<Id:{0}, name:{1}, permissions: {2}>'.format(self.id, self.name, self.permissions)
    __str__ = __repr__

    def addPermission(self, permId):
        permId = int(permId)
        if permId not in self.permissions:
            self.permissions.append(permId)

    def removePermission(self, permId):
        permId = int(permId)
        if permId in self.permissions:
            self.permissions = [x for x in self.permissions if x != permId]

    def getPermissions(self):
        return self.permissions

    def getName(self):
        return self.name

    def getId(self):
        return self.id

    def getDesc(self):
        return self.description


class RoleManager(object):
    def __init__(self):
        try:
            self.db = psycopg2.connect(database="acl2", user="postgres",
                                       password="powerup", host="127.0.0.1",
                                       port="5432").cursor()

            self.allRoles = {}
            self.allResources = {}
            self.allResourceTypes = {}
            self.resourceContainer = {}
            self.permissionTable = self.getPermissionTable()
            roleTable = dict(self.getRoleTable())
            self.resourceTable = self.getResourceTable()
            resourceTypeTable = self.getResourceTypeTable()

            for rtid, rtName, desc in resourceTypeTable:
                self.allResourceTypes[rtid] = ResourceType(resourceTypeId=rtid,
                                                           resourceTypeName=rtName,
                                                           description=desc,
                                                           permissionIdList=self.getResourceTypePermissionTable(rtid))
            for resId, row in self.resourceTable.items():
                tempResource = Resource(
                    resId=row[0],
                    name=row[1],
                    resourceType=self.allResourceTypes[row[2]],
                    contentId=row[3],
                    isGroup=row[4]
                )
                self.allResources[resId] = tempResource
            for rid, rname in roleTable.items():
                role = Role(roleId=rid, roleName=rname)
                self.allRoles[rname] = role
            for rid, rname in roleTable.items():
                childparents = self.getRoleMemberOfTable(rid)
                role = self.allRoles[rname]
                for cid, pid in childparents:
                    role.addParent(self.allRoles[roleTable[pid]])#add parent
                self.resourceContainer.clear()
                rolePermsReses = self.getRolePermissionResourceTable(rid)
                if len(rolePermsReses):
                    self.getResources(rid, self.getRolePermissionResourceTable(rid))
                    for resId, resPerm in self.resourceContainer.items():
                        perms = map(lambda x: self.permIdToName(x), resPerm[1])
                        role.addResource((self.allResources[resId], perms))
        except Exception as e:
            print e
        finally:
            self.db.close()

    def permIdToName(self, ins):
        if isinstance(ins, int):
            if ins in self.permissionTable:
                return self.permissionTable[ins]["name"]

    def registRole(self, role):
        if isinstance(role, Role):
            if not role.getName() in self.allRoles:
                self.allRoles[role.getName()] = role
            else:
                raise Exception("Error: Role: {0} has already been registed, and cannot add a new role".format(role.getName()))
        else:
            raise TypeError("please input the instance of type Role")

    def removeRole(self,role):
        if isinstance(role, Role):
            if role.getName() in self.allRoles:
                del self.allRoles[role.getName()]
            else:
                raise KeyError("Error: Role: {0} has not been registed when trying to remove it".format(role.getName()))
        else:
            raise TypeError("please input the instance of type Role")

    def registResource(self,resources):
        if isinstance(resources, tuple) or isinstance(resources, list):
            for res in resources:
                if isinstance(res,Resource):
                    if not res.getId() in self.allResources:
                        self.allResources[res.getId()] = res
                    else:
                        raise KeyError("resource: <id:{0}, name:{1}> has been registed".format(res.getId(), res.getName()))
                else:
                    raise TypeError("Need to input Resource type when regist resources")
        else:
            if isinstance(resources, Resource):
                self.allResources[resources.getId()] = resources
            else:
                raise TypeError("Need to input Resource type when regist resources")

    def removeResource(self, resources):
        if isinstance(resources, tuple) or isinstance(resources, list):
            for res in resources:
                if isinstance(res,Resource):
                    if res.getId() in self.allResources:
                        del self.allResources[res.getId()]
                    else:
                        raise KeyError("resource: <id:{0}, name:{1}> has not been regiested!!!".format(res.getId(), res.getName()))
                else:
                    raise TypeError("Need to input Resource type when regist resources")
        else:
            if isinstance(resources, Resource):
                if resources.getId() in self.allResources:
                    self.allResources[resources.getId()] = resources
                else:
                    raise KeyError("resource: <id:{0}, name:{1}> has not been regiested!!!".format(resources.getId(), resources.getName()))
            else:
                raise TypeError("Need to input Resource type when regist resources")

    def getResourceTypeTable(self, rtId=None):
        if rtId is None:
            sql = '''SELECT * FROM t_resource_type;'''
            self.db.execute(sql)
            if self.db.rowcount == 0:
                raise Exception('Error: visit t_resource_type failed!!!')
            return self.db.fetchall()
        else:
            sql = '''SELECT * FROM t_resource_type WHERE id={0};'''.format(rtId)
            self.db.execute(sql)
            if self.db.rowcount == 0:
                raise Exception('Error: visit t_resource_type failed when id = {0}!!!'.format(rtId))
            return self.db.fetchone()

    def getResourceTypePermissionTable(self, resourceTypeId=None):
        if resourceTypeId is not None:
            sql = '''SELECT * FROM t_resource_type_permission WHERE resource_type_id={0};'''.format(resourceTypeId)
            self.db.execute(sql)
            if self.db.rowcount == 0:
                raise Exception('Error: visit t_resource_type_permission failed when resourcetype id:{0}!!!'.format(resourceTypeId))
            return [x[1] for x in self.db.fetchall()]
        else:
            sql = '''SELECT * FROM t_resource_type_permission'''
            self.db.execute(sql)
            if self.db.rowcount == 0:
                raise Exception('Error: visit t_resource_type_permission failed!!!')
            temp = {}
            for rtid, permId in self.db.fetchall():
                if rtid not in temp:
                    temp[rtid] = []
                temp[rtid].append(permId)
            return temp

    def getResources(self, roleId, resourceOfRole, groupPerms=None):
        for resId in resourceOfRole:
            row = self.resourceTable[resId]
            if not row[4]:
                if groupPerms:
                    self.resourceContainer[resId] = [row, groupPerms]
                else:
                    self.resourceContainer[resId] = [row, self.getRolePermissionResourceTable(roleId, resId)]
            else:
                resourceList = self.getGroupResourceTable(resId)
                self.getResources(resId,resourceList,self.getRolePermissionResourceTable(roleId,resId))

    def getPermissionTable(self):
        permissionTable = {}
        sql = '''SELECT * FROM t_permission'''
        self.db.execute(sql)
        if self.db.rowcount == 0:
            raise Exception('Error: visit t_permission failed!!!')
        for i, name, description in self.db.fetchall():
            permissionTable[i] = {"name": name, "description": description}
        return permissionTable

    def getResourceTable(self):
        resourceTable = {}
        sql = '''SELECT * FROM t_resource'''
        self.db.execute(sql)
        if self.db.rowcount == 0:
            raise Exception('Error: visit t_resource failed!!!')
        for row in self.db.fetchall():
            resourceTable[row[0]] = row
        return resourceTable

    def getRoleTable(self):
        sql = '''SELECT * FROM t_role'''
        self.db.execute(sql)
        if self.db.rowcount == 0:
            raise Exception('Error: visit t_role failed!!!')
        return self.db.fetchall()

    def getRoleMemberOfTable(self, childRoleId):
        sql = '''SELECT * FROM t_role_memberof WHERE child_role_id={0}'''.format(childRoleId)
        self.db.execute(sql)
        if self.db.rowcount == 0:
            raise Exception('Error: visit t_role_memberOf failed!!! when id = {0}'.format(childRoleId))
        return self.db.fetchall()

    def getGroupResourceTable(self, groupId):
        sql = '''SELECT resource_id FROM t_group_resource WHERE group_id={0}'''.format(groupId)
        self.db.execute(sql)
        if self.db.rowcount == 0:
            raise Exception('Error: visit t_group_resource failed!!!')
        return map(lambda x: x[0], self.db.fetchall())

    def getRolePermissionResourceTable(self,roleId,resourceId=None):
        if resourceId is None:
            sql = '''SELECT DISTINCT resource_id FROM t_role_permission_resource WHERE role_id={0}'''.format(roleId)
            self.db.execute(sql)
            return map(lambda x: x[0] ,self.db.fetchall())
        else:
            sql = '''SELECT DISTINCT permission_id FROM t_role_permission_resource WHERE role_id={0} AND resource_id={1}'''.format(roleId,resourceId)
            self.db.execute(sql)
            if self.db.rowcount == 0:
                raise Exception('Error: visit t_role_permission_resource failed when role id = {0} and resource_id = {1}!!!'.format(roleId,resourceId))
            return map(lambda x: x[0], self.db.fetchall())

if __name__ == '__main__':
    RM = RoleManager()
    a = RM.allRoles["CEO"]
    a.removeParent(RM.allRoles["RM"])
    a.addParent(RM.allRoles["RM"])
    print a.getParents()

    print a.hasPermission(21, 'w')
    print a.hasPermission(21, 'r')
    a.removeParent(RM.allRoles["IM"])
    print a.hasPermission(21, 'w')
    print a.hasPermission(21, 'r')
    a = RM.allRoles["IMemplyoee"]
    print a.hasPermission(21, 'w')
    print a.hasPermission(21, 'r')
    a = RM.allRoles["RMemployee"]
    print a.hasPermission(21, 'w')
    print a.hasPermission(21, 'r')

