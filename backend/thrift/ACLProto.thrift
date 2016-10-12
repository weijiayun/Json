

// -------------------Add resource type------------------------

const i32 ACLPROTO_MESSAGE_ADD_RESOURCE_TYPE = 100000

struct LoginSession
{
    1: i32 userId;
    2: i32 seqId;
}

struct Permission
{
    1: required string name;
    2: optional string description;
}

struct AddResourceType                                                                       
{    
	1: required LoginSession session;
    2: string name;
	3: string description;
    4: list<Permission> permissions;
	
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
    2: required i32 resourceTypeId;
    3: required string name;
    4: optional string description;
}


struct AddResourceResponse
{
    1: i32 status;
    2: string message;
    3: i32 resourceId;
}

//-------------------Add role-------------------------------------


const i32 ACLPROTO_MESSAGE_ADD_ROLE = 100004



struct PId
{
    1: required i32 permissionId;
}

struct ResourcePermission
{
    1: required i32 resourceId;
    2: optional list<PId> permissionIds;
}


struct AddRole
{
	1: required LoginSession session;
    2: required string roleName;
    3: optional list<ResourcePermission> resourcePermissions;
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
    3: optional binary phoneNumber;
    4: required binary privateKey;
    5: required binary publicKey;
	6: required binary password;
}

struct AddUserResponse
{
	1:i32 status;
	2:string message;
    3:i32 userId;
}

//-------------------Grant role----------------------------------


const i32 ACLPROTO_MESSAGE_GRANT_ROLE = 100008

struct GrantRole
{
	1: required LoginSession session;
    2: required i32 userId;
    3: required i32 roleId;
}

struct GrantRoleResponse
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

/*
struct LoginSession
{
    1: i32 userId;
    2: i32 seqId;
}
*/

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

//-----------------------List resource------------------------------


const i32 ACLPROTO_MESSAGE_LIST_RESOURCE = 100016


struct ListResource
{
	1: required LoginSession session;
	//2: optional i32 roleId;
}

struct Resource
{
	1: i32 resourceId;
	2: string resourceName;
}
struct ListResourceResponse
{
	1: i32 status;
	2: string message;
    3: list<Resource> resources;
}


//-----------------------List other resource------------------------


const i32 ACLPROTO_MESSAGE_LIST_OTHER_RESOURCE = 100017


struct ListOtherResource
{
	1: required LoginSession session;
	2: optional i32 roleId;
}


struct ListOtherResourceResponse
{
	1: i32 status;
	2: string message;
    3: list<Resource> resources;
}



//-----------------------Grant permission------------------------

const i32 ACLPROTO_MESSAGE_GRANT_PERMISSION = 100018


struct GrantPermission
{
	1: required LoginSession session;
	2: required i32 roleId;
    3: required  i32 resourceId;
    4: required i32 permissionId;
}

struct GrantPermissionResponse
{
	1: i32 status;
    2: string message;
}

//-----------------------List role-------------------------------


const i32 ACLPROTO_MESSAGE_LIST_ROLE = 100020


struct ListRole
{
    1: required LoginSession session;
}

struct Role
{
	1: i32 roleId;
	2: string roleName;
	
}

struct ListRoleResponse
{
    1: i32 status;
    2: string message;
	3: list<Role> roles;
}

//------------------------List user---------------------------


const i32 ACLPROTO_MESSAGE_LIST_USER = 100022


struct ListUser
{
	1: required LoginSession session;
//	2: required i32 roleId;  
}

struct User
{
	1: i32 userId;
    2: string userName;
}

struct ListUserResponse
{
    1: i32 status;
	2: string message;
	3: list<User> users;
}

//---------------List permission--------------------------------


const i32 ACLPROTO_MESSAGE_LIST_PERMISSION = 100024


struct ListPermission
{
	1: required LoginSession session;
//	2: optional i32 roleId;
}

struct P
{
	1: i32 permissionId;
	2: string name;
}


struct LISTPermissionResponse
{
	1: i32 status;
	2: string message;
  	3: list<P> permissions;
}

//---------------List other permission-----------------------------


const i32 ACLPROTO_MESSAGE_LIST_OTHER_PERMISSION = 100025


struct ListOtherPermission
{
	1: required LoginSession session;
	2: optional i32 roleId;
}

struct ListOtherPermissionResponse
{
	1: i32 status;
	2: string message;
  	3: list<P> permissions;
}





//----------------Change userName------------------------------


const i32 ACLPROTO_MESSAGE_CHANGE_USER_NAME = 100026


struct ChangeUserName
{
	1: required LoginSession session;
//    2: optional i32 userId;
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
//	3: optional i32 userId;
    

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

//-----------------Inherit permission-------------------------

const i32 ACLPROTO_MESSAGE_INHERIT_PERMISSION = 100042


struct InheritPermission
{
	1: required LoginSession session;
	2: i32 pRoleId;
	3: i32 cRoleId;
}


struct InheritPermissionResponse
{
	1: i32 status;
	2: string message;
}

//-----------------Release role-------------------------

const i32 ACLPROTO_MESSAGE_RELEASE_ROLE = 100044


struct ReleaseRole
{
	1: required LoginSession session;
	2: i32 roleId;
}


struct ReleaseRoleResponse
{
	1: i32 status;
	2: string message;
}

//-----------------------My role----------------------------


const i32 ACLPROTO_MESSAGE_MY_ROLE = 100046


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

//-----------------------List resourcetype-------------------------
 

const i32 ACLPROTO_MESSAGE_LIST_RESOURCE_TYPE = 100048


struct ListResourceType
{
	1: required LoginSession session;
}


struct ResourceType
{
	1: i32 id;
	2: string name;
}

struct ListResourceTypeResponse
{
	1: i32 status;
	2: string message;
	3: list<ResourceType> resourceTypes;
}


//-----------------------Has permission------------------------


const i32 ACLPROTO_MESSAGE_HAS_PERMISSION = 100050


struct HasPermission
{
	1: required LoginSession session;
	2: required i32 roleId;
    3: required  i32 resourceId;
    4: required i32 permissionId;
}

struct HasPermissionResponse
{
	1: i32 status;
    2: string message;
	3: bool result;
}


//-----------------------List type resource-------------------------


const i32 ACLPROTO_MESSAGE_LIST_TYPE_RESOURCE = 100052


struct ListTypeResource
{
	1: required LoginSession session;
	2: required i32 resourceTypeId;
}

/*
struct Resource
{
	1: i32 resourceId;
	2: string resourceName;
}
*/
struct ListTypeResourceResponse
{
	1: i32 status;
	2: string message;
    3: list<Resource> resources;
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

/*
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

*/

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

/*
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

*/


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


//-----------------------All resource information----------------------------


const i32 ACLPROTO_MESSAGE_ALL_RESOURCE_INFORMATION = 100064

struct AllResourceInformation
{
	1: required LoginSession session;
}

//typedef list<string>  Lists

struct AllResourceInformationResponse
{
	1: i32 status;
	2: string message;
	3: list<Lists> information;
}











































