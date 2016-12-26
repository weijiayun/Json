

// -------------------Add resource type------------------------

const i32 ACLPROTO_MESSAGE_ADD_RESOURCE_TYPE = 100000

struct LoginSession
{
    1: i32 userId;
    2: i32 seqId;
}

struct AddResourceType                                                                       
{    
	1: required LoginSession session;
    2: string name;
	3: string description;
    4: list<i32> permissions;
	
}

struct AddResourceTypeResponse
{
    1: i32 status;
    2: string message;
    3: i32 resourceTypeId;
}

//----------------Add resource--------------------------

const i32 ACLPROTO_MESSAGE_ADD_RESOURCE = 100002

struct AddResource
{
	1: required LoginSession session;
	2: required string name;
    3: required i32 resourceTypeId;
    4: optional string contentId;
    5: required i32 isGroup;
}

struct AddResourceResponse
{
    1: i32 status;
    2: string message;
    3: i32 resourceId;
}

//-------------------Add role-------------------------------------


const i32 ACLPROTO_MESSAGE_ADD_ROLE = 100004

struct AddRole
{
	1: required LoginSession session;
    2: required string roleName;
}

struct AddRoleResponse
{
	1:i32 status;
	2:string message;
    3:i32 roleId;
}

//--------------------Add user------------------------------------

const i32 ACLPROTO_MESSAGE_ADD_USER = 100006


struct AddUser
{
	1: required LoginSession session;
    2: required string userName;
    3: required string email;
    4: required string password;
	5: required i32 roleId;
}

struct AddUserResponse
{
	1:i32 status;
	2:string message;
    3:i32 userId;
}

//-------------------Set Role To User----------------------------------

const i32 ACLPROTO_MESSAGE_SET_ROLE_TO_USER = 100008

struct SetRoleToUser
{
	1: required LoginSession session;
    2: required i32 userId;
    3: required i32 roleId;
}

struct SetRoleToUserResponse
{
	1:i32 status;
    2:string message;
}


//-----------------------Change password---------------------------


const i32 ACLPROTO_MESSAGE_CHANGE_PASSWORD = 100010

struct ChangePassword
{
	1: required LoginSession session;
    2: required binary password;
}

struct ChangePasswordResponse
{
	1: i32 status;
	2: string message;
}


//----------------------Login ------------------------------------

const i32 ACLPROTO_MESSAGE_LOGIN = 100012


struct Login
{
    1: required string userName;
    2: required binary password;
}

struct LoginResponse
{
    1: i32 status;
    2: string message;
    3: LoginSession session;
}


//-------------------Logout-------------------------------------
const i32 ACLPROTO_MESSAGE_LOGOUT = 100014


struct Logout
{
	1: required LoginSession session;
}

struct LogoutResponse
{
	1: i32 status;
	2: string message;
}
//-----------------------Has Permission------------------------

const i32 ACLPROTO_MESSAGE_HAS_PERMISSION = 100016


struct HasPermission
{
	1: required LoginSession session;
    2: required  i32 resourceId;
    3: required string permission;
}
struct HasPermissionResponse
{
	1: i32 status;
    2: string message;
    3: i32 hasPerm;
}

//-----------------------Grant Resource To Role------------------------

const i32 ACLPROTO_MESSAGE_GRANT_RESOURCE_TO_ROLE = 100018

struct GrantResourceToRole
{
	1: required LoginSession session;
	2: required i32 roleId;
    3: required  i32 resourceId;
    4: required list<i32> permissionIds;
}

struct GrantResourceToRoleResponse
{
	1: i32 status;
    2: string message;
}
//-----------------------Revoke Resource From Role------------------------

const i32 ACLPROTO_MESSAGE_REVOKE_RESOURCE_FROM_ROLE = 100020

struct RevokeResourceFromRole
{
	1: required LoginSession session;
	2: required i32 roleId;
    3: required  i32 resourceId;
}

struct RevokeResourceFromRoleResponse
{
	1: i32 status;
    2: string message;
}

//------------------------List user---------------------------


const i32 ACLPROTO_MESSAGE_LIST_USER = 100022


struct ListUser
{
	1: required LoginSession session;
	2: optional i32 userId;
}

struct User
{
	1: i32 userId;
    2: string userName;
    3: string phoneNumber;
    4: string password;
    5: string privateKey;
    6: string publicKey;
    7: string email;
    8: string description;
    9: string avatar;
    10: string roleName;
}

struct ListUserResponse
{
    1: i32 status;
	2: string message;
	3: list<User> users;
}



//----------------Get Resources------------------------------
const i32 ACLPROTO_MESSAGE_GET_RESOURCES = 100024
struct GetResources
{
	1: required LoginSession session;
}
struct Res
{
    1: required i32 id;
    2: required string name;
    3: required string resourceType;
    4: required i32 contentId;
    5: required i32 isGroup;
}
struct GetResourcesResponse
{
    1: i32 status;
	2: string message;
	3: list<Res> resources;
}


//----------------Change userName------------------------------

const i32 ACLPROTO_MESSAGE_CHANGE_USER_NAME = 100026


struct ChangeUserName
{
	1: required LoginSession session;
	2: required string userName;
}

struct ChangeUserNameResponse
{
    1: i32 status;
	2: string message;
}


//----------------Change RoleName------------------------------


const i32 ACLPROTO_MESSAGE_CHANGE_ROLE_NAME = 100028


struct ChangeRoleName
{   
	1: required LoginSession session;
	2: optional i32 roleId;
	3: required string roleName;
}

struct ChangeRoleNameResponse
{
    1: i32 status;
	2: string message;
}

//----------------Change publickey------------------------------


const i32 ACLPROTO_MESSAGE_CHANGE_PUBLIC_KEY = 100030


struct ChangePublicKey
{  
	1: required LoginSession session;
	2: required binary publicKey; 
//	3: optional i32 userId;
}

struct ChangePublicKeyResponse
{
    1: i32 status;
	2: string message;
}

//----------------Change privatekey------------------------------

const i32 ACLPROTO_MESSAGE_CHANGE_PRIVATE_KEY = 100032


struct ChangePrivateKey
{   
	1: required LoginSession session;
	2: required binary privateKey;
}

struct ChangePrivateKeyResponse
{
    1: i32 status;
	2: string message;
}

//------------------Delete resouce----------------------------


const i32 ACLPROTO_MESSAGE_DELETE_RESOURCE = 100034


struct DeleteResource
{   
	1: required LoginSession session;
	2: required i32 resourceId;

}

struct DeleteResourceResponse
{
    1: i32 status;
	2: string message;
}

//------------------Delete user----------------------------


const i32 ACLPROTO_MESSAGE_DELETE_USER = 100036


struct DeleteUser
{   
	1: required LoginSession session;
	2: required i32 userId;

}

struct DeleteUserResponse
{
    1: i32 status;
	2: string message;
}

//------------------Delete role----------------------------


const i32 ACLPROTO_MESSAGE_DELETE_ROLE = 100038


struct DeleteRole
{
	1: required LoginSession session;   
	2: required i32 roleId;

}

struct DeleteRoleResponse
{
	1: i32 status;
	2: string message; 
}

//-------------------List login------------------------------

const i32 ACLPROTO_MESSAGE_LIST_LOGIN = 100040

struct ListLogin
{
	1: required LoginSession session;
}

struct Logged
{
	1: i32 userId;
	2: i32 seqId;
}

struct ListLoginResponse
{
	1: i32 status;
	2: string message;
	3: list<Logged> logins;
}

//-------------------Add Resource To Group------------------------------

const i32 ACLPROTO_MESSAGE_ADD_RESOURCE_TO_GROUP = 100042

struct AddResourceToGroup
{
	1: required LoginSession session;
	2: required i32 groupId;
	3: required list<i32> resourceIds;
}

struct AddResourceToGroupResponse
{
	1: i32 status;
	2: string message;
}

//-------------------Remove Resource From Group------------------------------

const i32 ACLPROTO_MESSAGE_REMOVE_RESOURCE_FROM_GROUP = 100044

struct RemoveResourceFromGroup
{
	1: required LoginSession session;
	2: required i32 groupId;
	3: required list<i32> resourceIds;
}

struct RemoveResourceFromGroupResponse
{
	1: i32 status;
	2: string message;
}

//-------------------Get Group------------------------------

const i32 ACLPROTO_MESSAGE_GET_GROUP = 100046

struct GetGroup
{
	1: required LoginSession session;
	2: required i32 groupId;
}

struct GetGroupResponse
{
	1: i32 status;
	2: string message;
	3: list<Res> resources;
}

//-----------------------My role----------------------------


const i32 ACLPROTO_MESSAGE_MY_ROLE = 100048


struct MyRole
{
	1: required LoginSession session;
}


struct MyRoleResponse
{
	1: i32 status;
	2: string message;
	3: i32 roleId;
	4: string roleName;
}

// -------------------Delete resource type------------------------

const i32 ACLPROTO_MESSAGE_DELETE_RESOURCE_TYPE = 100050

struct DeleteResourceType
{
	1: required LoginSession session;
    2: required string resourceTypeId;
    3: optional bool force=0;
}

struct DeleteResourceTypeResponse
{
    1: i32 status;
    2: string message;
}

// -------------------list resource type------------------------

const i32 ACLPROTO_MESSAGE_LIST_RESOURCE_TYPE = 100052

struct ListResourceType
{
	1: required LoginSession session;
}
struct ResType {
    1: required i32 id;
    2: required string name;
    3: required string description;
    4: required list<string> permissions;
}
struct ListResourceTypeResponse
{
    1: i32 status;
    2: string message;
    3: list<ResType> resourceTypes;
}



//-----------------------My information----------------------------


const i32 ACLPROTO_MESSAGE_MY_INFORMATION = 100054


enum RequestName
{
    name =1,
    phone_number=2,
    email=3,
    intro=4,
    password=5,
    private_key=6,
    public_key=7,
    avatar=8,
    id=9,
}

struct MyInformation
{
	1: required LoginSession session;
	2: required list<RequestName> reqName;
}

struct MyInformationResponse
{
	1: i32 status;
	2: string message;
	3: map<string, string> information;
}


//-----------------------Change my information----------------------------


const i32 ACLPROTO_MESSAGE_CHANGE_MY_INFORMATION = 100056


struct ChangeMyInformation
{
	1: required LoginSession session;
	2: required map<RequestName, string> reqDic;
}

struct ChangeMyInformationResponse
{
	1: i32 status;
	2: string message;
}

//-----------------------Change my password---------------------------


const i32 ACLPROTO_MESSAGE_CHANGE_MY_PASSWORD = 100058

struct ChangeMyPassword
{
	1: required LoginSession session;
    2: required binary oldPassword;
    3: required binary newPassword;
}

struct ChangeMyPasswordResponse
{
	1: i32 status;
	2: string message;
}


//-----------------------Other information----------------------------


const i32 ACLPROTO_MESSAGE_OTHER_INFORMATION = 100060

struct OtherInformation
{
	1: required LoginSession session;
	2: required list<RequestName> reqName;
	3: required i32 otherUserId;
}




struct OtherInformationResponse
{
	1: i32 status;
	2: string message;
	3: map<string, string> information;
}


//-----------------------All user information----------------------------


const i32 ACLPROTO_MESSAGE_ALL_USER_INFORMATION = 100062


struct AllUserInformation
{
	1: required LoginSession session;
	2: required list<RequestName> reqName;
}

typedef list<string>  Lists

struct AllUserInformationResponse
{
	1: i32 status;
	2: string message;
	3: list<Lists> information;
}
//-----------------------List Roles----------------------------


const i32 ACLPROTO_MESSAGE_LIST_ROLES = 100064


struct ListRoles
{
	1: required LoginSession session;
}
struct Role{
    1: required i32 id;
    2: required string name;
    3: required list<string> parents;
    4: required list<Res> resources;
}
struct ListRolesResponse
{
	1: i32 status;
	2: string message;
	3: list<Role> roles;
}



//-----------------------Get Public Key----------------------------


const i32 ACLPROTO_MESSAGE_GET_PUBLIC_KEY = 100066

struct GetPublicKey
{
	1: required LoginSession session;
	2: required i32 userId;
}


struct GetPublicKeyResponse
{
	1: i32 status;
	2: string message;
	3: string publicKey;
}

//-------------------Clear Role Of User----------------------------------


const i32 ACLPROTO_MESSAGE_CLEAR_ROLE_OF_USER = 100068

struct ClearRoleOfUser
{
	1: required LoginSession session;
    2: required i32 userId;
    3: required i32 roleId;
}

struct ClearRoleOfUserResponse
{
	1:i32 status;
    2:string message;
}

//-------------------Grant To Role----------------------------------


const i32 ACLPROTO_MESSAGE_GRANT_TO_ROLE = 100070

struct GrantToRole
{
	1: required LoginSession session;
    2: required i32 roleId;
    3: required list<i32> parentsRoleId;
}

struct GrantToRoleResponse
{
	1:i32 status;
    2:string message;
}

//-------------------Revoke From Role----------------------------------


const i32 ACLPROTO_MESSAGE_REVOKE_FROM_ROLE = 100072

struct RevokeFromRole
{
	1: required LoginSession session;
    2: required i32 roleId;
    3: required list<i32> parentsRoleId;
}

struct RevokeFromRoleResponse
{
	1:i32 status;
    2:string message;
}

//-------------------Change Role of User----------------------------------


const i32 ACLPROTO_MESSAGE_CHANGE_ROLE_OF_USER = 100074

struct ChangeRoleOfUser
{
	1: required LoginSession session;
    2: required i32 roleId;
    3: required i32 userId;
}

struct ChangeRoleOfUserResponse
{
	1:i32 status;
    2:string message;
}







































