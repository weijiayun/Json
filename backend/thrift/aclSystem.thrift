include "DProto.thrift"

struct Session
{
    1:i32 sessionID;
    2:i32 userID;
    3:i32 appID;
    4:i32 AppGroupId;
}

struct AppInfo
{
    1:i32 appID;
    2:i32 groupID;
    3:string appName;
    4:string Description;
}

struct UserInfo
{
    1:i32 UserId;
    2:string Name;
}

service UserService{
    Session login(1: string name,2: string password,3: i32 appID,4:i32 groupId),
    bool isLogin(1: Session session),
    void logout(1: Session session),
    i32 getPermission(1:Session session,2: i32 appID,3: i32 operationID),
    map<i32,list<i32>> getPermissionList(1:Session session,2: i32 groupID),
    list<AppInfo> getAppInfo(1:Session session,2: i32 groupID),
    list<UserInfo> getAllUsers(1:Session session);
}

//messages
const i32 ACLSystem_MESSAGE_FIRST = DProto.DMESSAGE_TYPE_6_FIRST;

const i32 ACLSystem_MESSAGE_APPS = 327681;//ACLSystem_MESSAGE_FIRST + 1

struct App
{
    1:i32 appId;
    2:string appName;
}

struct AppsResponse
{
    1:list<App> values;
}
