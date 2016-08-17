include "aclSystem.thrift"
include "DProto.thrift"
namespace cpp TTProto

//errors
const i32 TT_ERROR_FIRST = DProto.DMESSAGE_ERROR_1_FIRST;
const i32 TT_ERROR_NOT_REGISTERED = 1024;
const i32 TT_ERROR_ALREADY_REGISTERED = 1025;
const i32 TT_ERROR_NOT_JOINED = 1026;
const i32 TT_ERROR_GROUP_NOTEXISTS = 1027;

//grpups
const i32 TT_GROUP_FIRST = DProto.DMESSAGE_GROUP_1_FIRST;
const i32 TT_GROUP_APP_STATUS = 1073741824;
const i32 TT_GROUP_HEARTBEAT = 1073741825;

//messages
const i32 TT_MESSAGE_FIRST = DProto.DMESSAGE_TYPE_1_FIRST

//----------------Registe-----------------------
const i32 TT_MESSAGE_REGISTE = 0;//TT_MESSAGE_FIRST + 0
//request
struct Registe
{
    1:aclSystem.Session LoginSession;
    2:string Name;
    3:string Description;
    4:list<i32> Groups;
}

struct TTGraphEdge
{
    1:i32 Source;
    2:i32 Target;
}

//response
struct RegisteResponse
{
    1:DProto.DResponse Status;
    2:i32 LocalTTId;
}


//-----------------Join group ----------
const i32 TT_MESSAGE_JOIN_GROUP = 2;//TT_MESSAGE_FIRST + 2
//request
struct JoinGroup
{
    1:i32 ConnId;
    2:list<i32> Groups;            
}

//response
typedef DProto.DResponse JoinGroupResponseItem
struct JoinGroupResponse
{
    1:DProto.DResponse Status;
    2:list<JoinGroupResponseItem> Results;
}

//-------------------Leave group -------------
const i32 TT_MESSAGE_LEAVE_GROUP = 3; //TT_MESSAGE_FIRST + 3
struct LeaveGroup
{
    1:i32 ConnId;
    2:list<i32> Groups;
}

//response
typedef DProto.DResponse LeaveGroupResponseItem
struct LeaveGroupResponse
{
    1:DProto.DResponse Status;
    2:list<LeaveGroupResponseItem> Results;
}

//------------------App Status ---------------------------
const i32 TT_MESSAGE_APP_STATUS_CHANGE = 4; ////TT_MESSAGE_FIRST + 4
enum AppStatus
{
    Started,
    Stoped,
    NoResponse
}

struct AppStatusChange
{
    1:i32 ConnId;
    2:AppStatus Status;
    3:i32 AppId;
    4:i32 AppGroupId;
}

//------------------get missing msg-------------------------
//const i32 TT_MESSAGE_GET_MISSING_MSG = 5; ////TT_MESSAGE_FIRST + 5
//request
//struct GetMissingMsg
//{
    //1:i32 AppId;
    //2:i32 GroupId;
//}

//response
//struct GetMissingMsgResponse
//{
    //1:DProto.DResponse Status;
    //2:bool ExistMissingMsg;
//}

//--------------------------Heart beat-------------------------------------
const i32 TT_MESSAGE_HEARTBEAT = 5;     //TT_MESSAGE_PUBLIC_FIRST + 5
//request nobody

//response
struct HeartBeat
{
    1:i32 ConnId;
    2:i64 HeartBeatTime;
}

//--------------------------TT register-------------------------------------
const i32 TT_MESSAGE_REGISTER_TT = 6;     //TT_MESSAGE_PUBLIC_FIRST + 6

enum ApplicationStatus
{
    Online,
    Offline
}
struct NotifyAppInfo
{
    1:i32 AppId;
    2:i32 TTId;
    3:i32 GroupId;
    4:ApplicationStatus appStatus;
    5:i64 LastUpdateSnapshot;
}

//request nobody
struct RegisterTT
{
    1:i32 AppId;
    2:string IP;
    3:i32 Port;
    4:list<TTGraphEdge> TTEdge;
    5:list<NotifyAppInfo> AppInfoList;
}

const i32 TT_MESSAGE_REGISTER_TT_RESPONSE = 7;     //TT_MESSAGE_PUBLIC_FIRST + 7
//response
struct RegisterTTResponse
{
    1:i32 TTId;
    2:list<TTGraphEdge> TTEdge;
    3:list<NotifyAppInfo> AppInfoList;
}



//--------------------------App Status Change-------------------------------------
const i32 TT_MESSAGE_NOTIFY_APP_STATUS_CHANGE = 8;     //TT_MESSAGE_PUBLIC_FIRST + 8
//request nobody
struct NotifyAppStatusChange
{
    1:i32 AppId;
    2:i32 TTId;
    3:i32 GroupId;
    4:ApplicationStatus appStatus;
    5:i64 LastUpdateSnapshot;
}
//response
struct NotifyAppStatusChangeResponse
{
    1:i32 AppId;
    2:i32 TTId;
}

//--------------------------query online apps-------------------------------------
const i32 TT_MESSAGE_QUERY_SINGLE_ONLINE_APP_STATUS = 9;     //TT_MESSAGE_PUBLIC_FIRST + 9

enum QueryAppsType
{
    SingalTT,
    ALL
}

struct OnlineApplication
{
    1:i32 ConnId;                //can be used as the value of DPrivateMessage.From and DPrivateMessage::To
    2:i32 AppId;             //App id
    3:string Name;           //App name
    4:string Description;    //App description
    5:i32 AppGroupId;
    6:i32 TTId;
}

struct QuerySingleOnlineAppStatus
{
    1:i32 AppId;
    2:i32 TTId;
    3:i32 ConnId;
}

//response
struct QuerySingleOnlineAppStatusResponse
{
    1:i32 ConnId;
    2:OnlineApplication AppInfo;
}

const i32 TT_MESSAGE_QUERY_ALL_ONLINE_APP_STATUS = 10;     //TT_MESSAGE_PUBLIC_FIRST + 10


//response
struct QueryAllOnlineAppStatusResponse
{
    1:i32 ConnId;
    2:list<OnlineApplication> Groups;
}


const i32 TT_MESSAGE_SUBSCRIBE_MESSAGE = 11;     //TT_MESSAGE_PUBLIC_FIRST + 11

struct SubscribeMessage
{
    1:i32 AppId;
    2:list<i32> Groups;
}

//response
struct SubscribeMessageResponse
{
    1:DProto.DResponse Status;
    2:list<i32> FailedSubscribe;
}

const i32 TT_MESSAGE_UNSUBSCRIBE_MESSAGE = 12;     //TT_MESSAGE_PUBLIC_FIRST + 12
struct UnSubscribeMessage
{
    1:i32 AppId;
    2:i32 TTId;
    3:list<i32> Groups;
}

//response
struct UnSubscribeMessageResponse
{
    1:DProto.DResponse Status;
    2:list<i32> FailedSubscribe;
}

const i32 TT_MESSAGE_SUBSCRIBE_TT_MESSAGE = 13;     //TT_MESSAGE_PUBLIC_FIRST + 13
struct SubscribeTTMessage
{
    1:i32 TTId;
    2:i32 TargetTTId;
    3:i32 MessageId;
    4:list<i32> ShortestPath;
    5:list<i32> MsgIds;
}

//response
struct SubscribeTTMessageResponse
{
    1:DProto.DResponse Status;
    2:list<i32> FailedSubscribe;
}



const i32 TT_MESSAGE_QUERY_TT_GRAPH_MESSAGE = 14;     //TT_MESSAGE_PUBLIC_FIRST + 14
struct QueryTTGraphMessage
{
    1:i32 TTId;
}

//response
struct QueryTTGraphMessageResponse
{
    1:list<TTGraphEdge> TTGraphEdgeList;
}

const i32 TT_MESSAGE_FORCE_APP_OFFLINE_MESSAGE = 15;     //TT_MESSAGE_PUBLIC_FIRST + 15
//request
// nobody

//response
struct ForceAppOfflineMessageResponse
{
    1:DProto.DResponse Status;
}

const i32 TT_MESSAGE_NOTIFY_TT_GRAPH_CHANGE_MESSAGE = 16;     //TT_MESSAGE_PUBLIC_FIRST + 16
//request
//
struct NotifyTTGraphChangeMessage
{
    1:list<TTGraphEdge> TTEdge;
}

//response
struct NotifyTTGraphChangeMessageResponse
{
    1:DProto.DResponse Status;
}

const i32 TT_MESSAGE_SYNC_CACHE_MESSAGE = 17;     //TT_MESSAGE_PUBLIC_FIRST + 17

struct SyncCacheMessage
{
    1:i32 AppId;
    2:i32 CacheMessageCount;
}

