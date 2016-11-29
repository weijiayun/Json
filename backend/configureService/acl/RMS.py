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
        return r'<Role:(id:{0}, name: {1})>'.format(self.id,self.name)
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
        if isinstance(parentRoles, Role):
            if not parentRoles.getId() in self.parents:
                self.parents[parentRoles.getId()] = parentRoles

    def removeParent(self, parentRoles):
        if isinstance(parentRoles, Role):
            if parentRoles.getId() in self.parents:
                del self.parents[parentRoles.getId()]

    def addResource(self, resourcePermCouple):
        if isinstance(resourcePermCouple[0], Resource):
            if not resourcePermCouple[0].getId() in self.resources:
                self.resources[resourcePermCouple[0].getId()] = resourcePermCouple
            else:
                raise TypeError("please input the instance of type Role")

    def removeResource(self, resource):
        if isinstance(resource, Resource):
            if resource.getId() in self.resources:
                del self.resources[resource.getId()]

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
        return "Resource <id:{0},name: {1}, isGroup:{2}>".format(self.id, self.name, self.isGroup)
    __repr__ = __str__

    def getId(self):
        return self.id

    def getName(self):
        return self.name

    def getResourceType(self):
        return self.resourceType

    def getContentId(self):
        return self.contentId

    def getIsGroup(self):
        return self.isGroup

class Group(Resource):
    def __init__(self, resourceId, resourceName, resourceType, isGroup=1, contentId=None):
        super(Group, self).__init__(resourceId, resourceName, resourceType, contentId, isGroup)
        self.groupMember = {}

    def addMember(self, resource):
        if isinstance(resource, Resource):
            if resource.getId() not in self.groupMember:
                self.groupMember[resource.getId()] = resource
    
    def removeMember(self, resource):
        if isinstance(resource, Resource):
            if resource.getId() in self.groupMember:
                del self.groupMember[resource.getId()]

    def getMembers(self):
        return self.groupMember

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
    def __init__(self, db):
        self.db = db
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
            if row[4] == 0:
                tempResource = Resource(
                    resId=row[0],
                    name=row[1],
                    resourceType=self.allResourceTypes[row[2]],
                    contentId=row[3],
                    isGroup=row[4]
                )
            else:
                tempResource = Group(
                    resourceId=row[0],
                    resourceName=row[1],
                    resourceType=self.allResourceTypes[row[2]],
                    contentId=row[3],
                    isGroup=row[4]
                )
            self.allResources[resId] = tempResource
        for rid, rname in roleTable.items():
            role = Role(roleId=rid, roleName=rname)
            self.allRoles[rid] = role
        for rid, rname in roleTable.items():
            childparents = self.getRoleMemberOfTable(rid)
            role = self.allRoles[rid]
            for cid, pid in childparents:
                role.addParent(self.allRoles[pid])
            self.resourceContainer.clear()
            rolePermsReses = self.getRolePermissionResourceTable(rid)
            if len(rolePermsReses):
                self.getResources(rid, self.getRolePermissionResourceTable(rid))
                for resId, resPerm in self.resourceContainer.items():
                    perms = map(lambda x: self.permIdToName(x), resPerm[1])
                    role.addResource((self.allResources[resId], perms))

    def permIdToName(self, ins):
        try:
            if isinstance(ins, int):
                if ins in self.permissionTable:
                    return self.permissionTable[ins]["name"]
            return True
        except Exception as e:
            print e
            return False

    def registRole(self, role):
        try:
            if isinstance(role, Role):
                if not role.getId() in self.allRoles:
                    self.allRoles[role.getId()] = role
            return True
        except Exception as e:
            print e
            return False

    def removeRole(self, role):
        try:
            if isinstance(role, Role):
                if role.getId() in self.allRoles:
                    del self.allRoles[role.getId()]
            return True
        except Exception as e:
            print e
            return False

    def registResource(self, resources):
        try:
            if isinstance(resources, tuple) or isinstance(resources, list):
                for res in resources:
                    if isinstance(res, Resource):
                        if not res.getId() in self.allResources:
                            self.allResources[res.getId()] = res

            else:
                if isinstance(resources, Resource):
                    self.allResources[resources.getId()] = resources
            return True
        except Exception as e:
            print e
            return False

    def removeResource(self, resources):
        try:
            if isinstance(resources, tuple) or isinstance(resources, list):
                for res in resources:
                    if isinstance(res, Resource):
                        if res.getId() in self.allResources:
                            del self.allResources[res.getId()]
            else:
                if isinstance(resources, Resource):
                    if resources.getId() in self.allResources:
                        self.allResources[resources.getId()] = resources
            return True
        except Exception as e:
            print e
            return False

    def addResourceType(self, resourceTypeId, name, description, permissions):
        try:
            if resourceTypeId not in self.allResourceTypes:
                self.allResourceTypes[resourceTypeId] = ResourceType(resourceTypeId=resourceTypeId,
                                                                     resourceTypeName=name,
                                                                     description=description,
                                                                     permissionIdList=permissions
                                                                     )
            return True
        except Exception as e:
            print e
            return False

    def removeResourceType(self, resourceTypeId):
        try:
            for rid, role in self.allRoles.items():
                for resId, resPerm in role.getResources().items():
                    if resPerm[0].getResourceType().getId() == resourceTypeId:
                        del role.resources[resId]
            for resId, res in self.allResources.items():
                if res.getResourceType().getId() == resourceTypeId:
                    del self.allResources[resId]
            if resourceTypeId in self.allResourceTypes:
                del self.allResourceTypes[resourceTypeId]
            return True
        except Exception as e:
            print e
            return False

    def getResourceTypeTable(self, rtId=None):
        try:
            cur = self.db.cursor()
            if rtId is None:
                sql = '''SELECT * FROM t_resource_type;'''
                cur.execute(sql)
                if cur.rowcount == 0:
                    raise Exception('Error: visit t_resource_type failed!!!')
                return cur.fetchall()
            else:
                sql = '''SELECT * FROM t_resource_type WHERE id={0};'''.format(rtId)
                cur.execute(sql)
                if cur.rowcount == 0:
                    raise Exception('Error: visit t_resource_type failed when id = {0}!!!'.format(rtId))
                return cur.fetchone()
        except Exception as e:
            print e
            self.db.rollback()
            return False
        finally:
            cur.close()

    def getResourceTypePermissionTable(self, resourceTypeId=None):
        try:
            cur = self.db.cursor()
            if resourceTypeId is not None:
                sql = '''SELECT * FROM t_resource_type_permission WHERE resource_type_id={0};'''.format(resourceTypeId)
                cur.execute(sql)
                if cur.rowcount == 0:
                    raise Exception('Error: visit t_resource_type_permission failed when resourcetype id:{0}!!!'.format(resourceTypeId))
                return [x[1] for x in cur.fetchall()]
            else:
                sql = '''SELECT * FROM t_resource_type_permission'''
                cur.execute(sql)
                if cur.rowcount == 0:
                    raise Exception('Error: visit t_resource_type_permission failed!!!')
                temp = {}
                for rtid, permId in cur.fetchall():
                    if rtid not in temp:
                        temp[rtid] = []
                    temp[rtid].append(permId)
                return temp
        except Exception as e:
            print e
            self.db.rollback()
            return False
        finally:
            cur.close()

    def getResources(self, roleId, resourceOfRole):
        for resId in resourceOfRole:
            row = self.resourceTable[resId]
            if not row[4]:
                self.resourceContainer[resId] = [row, self.getRolePermissionResourceTable(roleId, resId)]
            else:
                self.resourceContainer[resId] = [row, self.getRolePermissionResourceTable(roleId, resId)]
                resourceList = self.getGroupResourceTable(resId)
                for resId2 in resourceList:
                    self.resourceContainer[resId2] = [row, self.getRolePermissionResourceTable(roleId, resId)]
                    self.allResources[resId].addMember(self.allResources[resId2])

    def getPermissionTable(self):
        try:
            cur = self.db.cursor()
            permissionTable = {}
            sql = '''SELECT * FROM t_permission'''
            cur.execute(sql)
            if cur.rowcount == 0:
                raise Exception('Error: visit t_permission failed!!!')
            for i, name, description in cur.fetchall():
                permissionTable[i] = {"name": name, "description": description}
            return permissionTable

        except Exception as e:
            print e
            self.db.rollback()
            return False
        finally:
            cur.close()

    def getResourceTable(self):
        try:
            cur = self.db.cursor()
            resourceTable = {}
            sql = '''SELECT * FROM t_resource'''
            cur.execute(sql)
            if cur.rowcount == 0:
                raise Exception('Error: visit t_resource failed!!!')
            for row in cur.fetchall():
                resourceTable[row[0]] = row
            return resourceTable
        except Exception as e:
            print e
            self.db.rollback()
            return False
        finally:
            cur.close()

    def getRoleTable(self):
        try:
            cur = self.db.cursor()
            sql = '''SELECT * FROM t_role'''
            cur.execute(sql)
            if cur.rowcount == 0:
                raise Exception('Error: visit t_role failed!!!')
            return cur.fetchall()
        except Exception as e:
            print e
            self.db.rollback()
            return False
        finally:
            cur.close()

    def getRoleMemberOfTable(self, childRoleId):
        try:
            cur = self.db.cursor()
            sql = '''SELECT * FROM t_role_memberof WHERE child_role_id={0}'''.format(childRoleId)
            cur.execute(sql)
            if cur.rowcount == 0:
                raise Exception('Error: visit t_role_memberOf failed!!! when id = {0}'.format(childRoleId))
            return cur.fetchall()
        except Exception as e:
            print e
            self.db.rollback()
            return False
        finally:
            cur.close()

    def getGroupResourceTable(self, groupId):
        try:
            cur = self.db.cursor()
            sql = '''SELECT resource_id FROM t_group_resource WHERE group_id={0}'''.format(groupId)
            cur.execute(sql)
            if cur.rowcount == 0:
                raise Exception('Error: visit t_group_resource failed!!!')
            return map(lambda x: x[0], cur.fetchall())
        except Exception as e:
            print e
            self.db.rollback()
            return False
        finally:
            cur.close()

    def getRolePermissionResourceTable(self,roleId,resourceId=None):
        try:
            cur = self.db.cursor()
            if resourceId is None:
                sql = '''SELECT DISTINCT resource_id FROM t_role_permission_resource
                         WHERE role_id={0}'''.format(roleId)
                cur.execute(sql)
                return map(lambda x: x[0] ,cur.fetchall())
            else:
                sql = '''SELECT DISTINCT permission_id FROM t_role_permission_resource
                        WHERE role_id={0} AND resource_id={1}'''.format(roleId,resourceId)
                cur.execute(sql)
                if cur.rowcount == 0:
                    raise Exception('''Error: visit t_role_permission_resource failed
                                        when role id = {0} and resource_id = {1}!!!'''.format(roleId, resourceId))
                return map(lambda x: x[0], cur.fetchall())
        except Exception as e:
            print e
            self.db.rollback()
            return False
        finally:
            cur.close()

if __name__ == '__main__':
    conn = psycopg2.connect(database="acl2", user="postgres", password="powerup", host="127.0.0.1", port="5432")
    RM = RoleManager(conn)
    a = RM.allRoles[5]
    a.removeParent(RM.allRoles[1])
    a.addParent(RM.allRoles[1])
    print a.getParents()
    print a.getAllResources()[22][0].getMembers()

    # print a.hasPermission(21, 'w')
    # print a.hasPermission(21, 'r')
    # a.removeParent(RM.allRoles[2])
    # print a.hasPermission(21, 'w')
    # print a.hasPermission(21, 'r')
    # a = RM.allRoles[4]
    # print a.hasPermission(21, 'w')
    # print a.hasPermission(21, 'r')
    # a = RM.allRoles[3]
    # print a.hasPermission(21, 'w')
    # print a.hasPermission(21, 'r')

