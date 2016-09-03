include "ACLProto.thrift"

struct configure{
    1: required string Name;
    2: required string Date;
    3: required string Version;
}
struct object{
    1: required string Name;
    2: required string Date;
    3: required string Version;
    4: required string TemplateName;
    5: required string CollectionName;
    6: required string Category;
}
struct objectContent{
    1: required string Name;
    2: required string Date;
    3: required string Version;
    4: required string Content;
    5: required string TemplateName;
    6: required string CollectionName;
    7: required string Category;
}

// -------------------------Create Configure-----------------------------
const i32 CONFIGUREOBJECTPROTO_MESSAGE_CREATE_CONFIGURE = 310008

struct CreateConfigure
{
    1: required ACLProto.LoginSession session;
    2: required configure Configure;
    3: required list<object> ObjectList;
}

struct CreateConfigureResponse
{
    1: i32 status;
    2: string message;
}

// -------------------------Delete Configure-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_DELETE_CONFIGURE = 310010

struct DeleteConfigure
{
    1: required ACLProto.LoginSession session;
    2: required configure Configure;
}

struct DeleteConfigureResponse
{
    1: i32 status;
    2: string message;
}

// -------------------------Create Object-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_CREATE_OBJECT = 310020

struct CreateObject
{
    1: required ACLProto.LoginSession session;
    2: required list<objectContent> ObjectList;
}

struct CreateObjectResponse
{
    1: i32 status;
    2: string message;
}

// -------------------------Delete Object-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_DELETE_OBJECT = 310022

struct DeleteObject
{
    1: required ACLProto.LoginSession session;
    2: required list<object> ObjectList;

}

struct DeleteObjectResponse
{
    1: i32 status;
    2: string message;
}

// -------------------------Get Objects-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_GET_OBJECTS = 310024

struct GetObjects
{
    1: required ACLProto.LoginSession session;
    2: required list<object> ObjectList;
}

struct GetObjectsResponse
{
    1: i32 status;
    2: string message;
    3: map<string, binary> Content;
}

// -------------------------Get Configure-----------------------------
const i32 CONFIGUREOBJECTPROTO_MESSAGE_GET_CONFIGURE = 310028

struct GetConfigure
{
    1: required ACLProto.LoginSession session;
    2: required configure Configure;

}

struct GetConfigureResponse
{
    1: i32 status;
    2: string message;
    3: map<string, binary> Content;

}


// -------------------------Grant Objects To Others-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_GRANT_OBJECTS_TO_OTHERS = 310032

struct GrantObjectsToOthers
{
	1: required ACLProto.LoginSession session;
	2: required i32 OthersId;
	3: required list<object> ObjectList;
}

struct GrantObjectsToOthersResponse
{
	1: i32 status;
    2: string message;
}

// -------------------------UnGrant Objects of Others-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_UN_GRANT_OBJECTS_OF_OTHERS = 310034

struct UnGrantObjectsOfOthers
{
    1: required ACLProto.LoginSession session;
	2: required i32 OthersId;
	3: required list<object> ObjectList;
}
struct UnGrantObjectsOfOthersResponse
{
	1: i32 status;
    2: string message;
}


// -------------------------Grant Configure Authority To Others-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_GRANT_CONFIGURE_TO_OTHERS = 310036

struct GrantConfigureToOthers
{
    1: required ACLProto.LoginSession session;
    2: required i32 OthersId;
    3: required list<configure> ConfigureList;

}
struct GrantConfigureToOthersResponse
{
	1: i32 status;
    2: string message;
}


// -------------------------UnGrant Configure To Others-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_UN_GRANT_CONFIGURE_OF_OTHERS = 310038

struct UnGrantConfigureOfOthers
{
    1: required ACLProto.LoginSession session;
    2: required i32 OthersId;
    3: required list<configure> ConfigureList;

}

struct UnGrantConfigureOfOthersResponse
{
	1: i32 status;
    2: string message;
}


// -------------------------List Objects-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_LIST_OBJECTS = 310040

struct ListObjects
{
    1: required ACLProto.LoginSession session;
}
typedef list<string> ObjectAttr;
typedef map<string,ObjectAttr> Collection;
struct ListObjectsResponse
{
	1: i32 status;
    2: string message;
    3: map<string, collection> CategoryDict;
}

// -------------------------List Authority Sharers-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_LIST_AUTHORITY_SHARERS = 310042

struct ListAuthoritySharers
{
    1: required ACLProto.LoginSession session;
    2: required object Object;
}

struct ListAuthoritySharersResponse
{
	1: i32 status;
    2: string message;
    3: list<string> SharerList;
}

