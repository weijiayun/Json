import psycopg2

class Role(object):
    def __init__(self, roleId, roleName):

        self.id = roleId
        self.name = roleName
        self.parents = {roleId:self}
        self.parentTree = {}
        self.resources = {}
        self.resourcePerms = {}

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

    def addResourcePerms(self,resourcePermCouple):
        if isinstance(resourcePermCouple, list):
            for res, perms in resourcePermCouple:
                if not res.getId() in self.resourcePerms:
                    self.resourcePerms[res.getId()] = (res, perms)
        else:
            if not resourcePermCouple[0].getId() in self.resourcePerms:
                self.resourcePerms[resourcePermCouple[0].getId()] = resourcePermCouple

    def removeResourcePerms(self,resourcePermCouple):
        if isinstance(resourcePermCouple, list) or isinstance(resourcePermCouple, tuple):
            for res, perms in resourcePermCouple:
                if res.getId() in self.resourcePerms:
                    del self.resourcePerms[res.getId()]
        else:
            if resourcePermCouple[0].getId() in self.resourcePerms:
                del self.resourcePerms[resourcePermCouple[0].getId()]

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

    def addResource(self, resources):
        if isinstance(resources, list) or isinstance(resources, tuple):
            for res in resources:
                if not res.getId() in self.resources:
                    self.resources[res.getId()] = res
        else:
            if not resources.getId() in self.resources:
                self.resources[resources.getId()] = resources
    def removeResource(self, resources):
        if isinstance(resources, list) or isinstance(resources, tuple):
            for res in resources:
                if res.getId() in self.resources:
                   del self.resources[res.getId()]
        else:
            if resources.getId() in self.resources:
               del self.resources[resources.getId()]

    def hasPermisiion(self, resourceId, permisiion):
        self.getAllParents(self)
        for pId, pRole in self.parentTree.items():
            if resourceId in pRole.getResources():
                return permisiion in pRole.getResourcePerms()[resourceId][1]
        return False

    def getAllParents(self,role):
        for pid, parent in role.getParents():
            if pid == role.getId():
                self.parentTree[pid]=parent
            else:
                self.getAllParents(parent)

    def getAllResources(self):
        self.getAllParents(self)
        dictmerged = {}
        for pId, parent in self.parentTree.items():
            dictmerged.update(parent.getResources())
        return dictmerged


class Resource(object):
    def __init__(self, resId, name, resourceType, contentId, isGroup):
        self.id = resId
        self.name = name
        self.resourceType = resourceType#id or real type
        self.contentId = contentId
        self.isGroup = isGroup
        self.ofRoles = {}

    def getId(self):
        return self.id

    def getName(self):
        return self.name

    def getResourceType(self):
        return self.resourceType

    def getContendId(self):
        return self.contentId

    def isGroup(self):
        return self.isGroup

    def byRole(self):
        return self.ofRoles

    def addInOfRole(self,roles):
        if isinstance(roles, list) or isinstance(roles, tuple):
            for role in roles:
                if not role.getId() in self.ofRoles:
                    self.ofRoles[role.getId()] = role
        else:
            if not roles.getId() in self.ofRoles:
                self.ofRoles[roles.getId()] = roles

    def removeInOfRoles(self,roles):
        if isinstance(roles, list) or isinstance(roles, tuple):
            for role in roles:
                if role.getId() in self.ofRoles:
                    del self.ofRoles[role.getId()]
        else:
            if roles.getId() in self.ofRoles:
                del self.ofRoles[roles.getId()]

    def findRole(self,roleId):
        if roleId in self.ofRoles:
            return self.ofRoles[roleId]
        else:
            raise KeyError("<role:id:{0}> isn's a master!!!".format(roleId))


class RoleManager(object):
    def __init__(self):
        try:
            self.db = psycopg2.connect(database="ACL", user="weijiayun",
                                     password="weijiayun", host="127.0.0.1",
                                     port="5432").cursor()

            self.allRoles = {}
            roleTable = dict(self.getRoleTable())
            self.resourceContainer = {}
            for rid, rname in roleTable.items():
                childparents = self.getRoleMemberOfTable(rid)
                role = Role(roleId=rid, roleName=rname)
                for cid, pid in childparents:
                    role.addParent(Role(roleId=pid, roleName=roleTable[pid]))#add parent
                self.getResources(rid,self.getResourceTable())
                for resId, res in self.resourceContainer.items():
                    row = res[0]
                    perms = res[1]
                    #resourceType = self.getResourceTypeTable()
                    temp = Resource(resId=row[0],
                                    name=row[1],
                                    resourceType=row[2],
                                    contentId=row[3],
                                    isGroup=row[4])
                    role.addResource(temp)
                    role.addResourcePerms((temp,perms))
                self.allRoles[rname] = role
        except Exception as e:
            print e
        finally:
            self.db.close()

    def getResources(self, roleId, resourceTable, groupPerms=None):
        for resId in resourceTable:
            row = self.getResourceTable()[resId]
            if not row[4]:
                if groupPerms:
                    self.resourceContainer[resId] = [row, groupPerms]
                self.resourceContainer[resId] = [row, self.getRolePermissionResourceTable(roleId, resId)]
            else:
                temp = self.getGroupResourceTable(resId)
                resourceList = [x[0] for x in temp]
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
            raise Exception('Error: visit t_role failed!!! when id = {0}'.format(childRoleId))
        return self.db.fetchall()

    def getGroupResourceTable(self, groupId):
        sql = '''SELECT resource_id FROM t_group_resource WHERE group_id={0}'''.format(groupId)
        self.db.execute(sql)
        if self.db.rowcount == 0:
            raise Exception('Error: visit t_group_resource failed!!!')
        return self.db.fetchall()

    def getResourceTypeTable(self,resTypeId):
        sql = '''SELECT * FROM t_resource_type WHERE id={0}'''.format(resTypeId)
        self.db.execute(sql)
        if self.db.rowcount == 0:
            raise Exception('Error: visit t_resource_type failed!!!')
        return self.db.fetchall()

    def getResourceTypePermissionTable(self, resourceTypeId):
        sql = '''SELECT * FROM t_resource_type_permission WHERE resource_type_id={0}'''.format(resourceTypeId)
        self.db.execute(sql)
        if self.db.rowcount == 0:
            raise Exception('Error: visit t_resource_type_permission failed when id = {0}!!!'.format(resourceTypeId))
        return self.db.fetchall()

    def getRolePermissionResourceTable(self,roleId,resourceId=None):
        if resourceId is None:
            sql = '''SELECT DISTINCT resource_id FROM t_role_permission_resource WHERE role_id={0}'''.format(roleId)
            self.db.execute(sql)
            if self.db.rowcount == 0:
                raise Exception('Error: visit t_role_permission_resource failed when role id = {0}!!!'.format(roleId))
            return self.db.fetchall()
        else:
            sql = '''SELECT permission_id FROM t_role_permission_resource WHERE role_id={0} AND resource_id={1}'''.format(roleId,resourceId)
            self.db.execute(sql)
            if self.db.rowcount == 0:
                raise Exception('Error: visit t_role_permission_resource failed when role id = {0} and resource_id = {1}!!!'.format(roleId,resourceId))
            return self.db.fetchall()






