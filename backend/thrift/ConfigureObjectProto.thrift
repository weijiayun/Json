include "ACLProto.thrift"


// -------------------------Get Configure-----------------------------
const i32 CONFIGUREOBJECTPROTO_MESSAGE_GET_CONFIGURE_FROM_GRID = 310000

struct GetConfigureFromGrid
{
    1: required ACLProto.LoginSession session;
    2: required string GridName;
    3: required string Version;
    4: required string Date;
}

struct GetConfigureFromGridResponse
{
    1: i32 status;
    2: string message;
    3: map<string, binary> Content;

}

// -------------------------Create Configure Grid-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_CREATE_CONFIGURE_GRID = 310002

struct Configure
{
    1: required string Date;
    2: required string Version;
}
struct CreateConfigureGrid
{
    1: required ACLProto.LoginSession session;
    2: required string GridName;
    3: required list<Configure> ConfigureList;
}

struct CreateConfigureGridResponse
{
    1: i32 status;
    2: string message;
}


// -------------------------Delete Configure Grid---------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_DELETE_CONFIGURE_GRID = 310004

struct DeleteConfigureGrid
{
    1: required ACLProto.LoginSession session;
    2: required string GridName;
}

struct DeleteConfigureGridResponse
{
    1: i32 status;
    2: string message;
}



// -------------------------Create Configure In Grid-----------------------------
const i32 CONFIGUREOBJECTPROTO_MESSAGE_CREATE_CONFIGURE_TO_GRID = 310006

struct CreateConfigureToGrid
{

    1: required ACLProto.LoginSession session;
    2: required string Version;
    3: required string Date;
    4: required string GridName;
    5: required list<i32> ObjectNameList;
}

struct CreateConfigureToGridResponse
{
    1: i32 status;
    2: string message;
    3: i32 ContentId;
}

// -------------------------Delete Configure In Grid-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_DELETE_CONFIGURE_IN_GRID = 310008

struct DeleteConfigureInGrid
{
    1: required string Version;
    2: required string Date;
    3: required string GridName;
}

struct DeleteConfigureInGridResponse
{
    1: i32 status;
    2: string message;
}



// -------------------------Create Configure Object-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_CREATE_CONFIGURE_OBJECT = 310010

struct CreateConfigureObject
{
    1: required ACLProto.LoginSession session;
    2: required i32 TemplateId;
    3: required string ObjectName;
    4: required string Content;
    5: required string Version;
    6: required string TemplateName;
    7: required string Collection;
}

struct CreateConfigureObjectResponse
{
    1: i32 status;
    2: string message;
    3: i32 ContentId;
}
// -------------------------Delete Configure Object-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_DELETE_CONFIGURE_OBJECT = 310012

struct DeleteConfigureObject
{
    1: required ACLProto.LoginSession session;
    2: required string ObjectName;

}

struct DeleteConfigureObjectResponse
{
    1: i32 status;
    2: string message;
    3: i32 ContentId;
}

// -------------------------Get Configure Object-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_GET_CONFIGURE_OBJECT = 310014

struct GetConfigureObject
{
    1: required ACLProto.LoginSession session;
    2: required i32 ObjectName;
}

struct GetConfigureObjectResponse
{
    1: i32 status;
    2: string message;
    3: map<string, binary> Content;
}


// -------------------------Grant Authority To Others-----------------------------

const i32 CONFIGUREOBJECTPROTO_GRANT_CONFIGURE_OBJECT_AUTHORITY_TO_OTHERS = 310016

struct GrantConfigureObjectAuthorityToOthers
{
	1: required i32 UserId;
	2: required i32 ObjectId;
	3: required ACLProto.LoginSession session;
}

struct GrantConfigureObjectAuthorityToOthersResponse
{
	1: i32 status;
    2: string message;
}

// -------------------------UnGrant Configure Authority To Others-----------------------------

const i32 CONFIGUREOBJECTPROTO_UN_GRANT_CONFIGURE_OBJECT_AUTHORITY_TO_OTHERS = 310018

struct UnGrantConfigureObjectAuthorityToOthers
{
    1: required ACLProto.LoginSession session;
	2: required i32 OthersId;
	3: required i32 ObjectId;
}
struct UnGrantConfigureObjectAuthorityToOthersResponse
{
	1: i32 status;
    2: string message;
}


// -------------------------Grant Configure Instance Authority To Others-----------------------------

const i32 CONFIGUREOBJECTPROTO_GRANT_CONFIGURE_INSTANCE_AUTHORITY_TO_OTHERS = 310020

struct GrantConfigureInstanceAuthorityToOthers
{
    1: required i32 OthersId;
    2: required ACLProto.LoginSession session;
	3: required string ConfigureName;
    4: required string Version;
    5: required string Date;

}
struct GrantConfigureInstanceAuthorityToOthersResponse
{
	1: i32 status;
    2: string message;
}


// -------------------------UnGrant Configure Instance Authority To Others-----------------------------

const i32 CONFIGUREOBJECTPROTO_UN_GRANT_CONFIGURE_INSTANCE_AUTHORITY_TO_OTHERS = 310022

struct UnGrantConfigureInstanceAuthorityToOthers
{
    1: required i32 OthersId;
    2: required ACLProto.LoginSession session;
    3: required string ConfigureName;
    4: required string Version;
    5: required string Date;
}

struct UnGrantConfigureInstanceAuthorityToOthersResponse
{
	1: i32 status;
    2: string message;
}


// -------------------------Grant Configure Grid Authority To Others-----------------------------

const i32 CONFIGUREOBJECTPROTO_GRANT_CONFIGURE_GRID_AUTHORITY_TO_OTHERS = 310024

struct GrantConfigureGridAuthorityToOthers
{
    1: required i32 OthersId;
    2: required ACLProto.LoginSession session;
	3: required string GridName;
    
}
struct GrantConfigureGridAuthorityToOthersResponse
{
	1: i32 status;
    2: string message;
}

// -------------------------UnGrant Configure Grid Authority To Others-----------------------------

const i32 CONFIGUREOBJECTPROTO_UN_GRANT_CONFIGURE_GRID_AUTHORITY_TO_OTHERS = 310026

struct UnGrantConfigureGridAuthorityToOthers
{
    1: required i32 OthersId;
    2: required ACLProto.LoginSession session;
	3: required string GridName;

}
struct UnGrantConfigureGridAuthorityToOthersResponse
{
	1: i32 status;
    2: string message;
}


