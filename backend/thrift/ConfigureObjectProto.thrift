include "ACLProto.thrift"

struct configure{
    1: required string Name;
    2: required string Date;
    3: required string Version;
}
struct collection{
    1: required string Name;
    2: required string Date;
    3: required string Version;
    4: required string TemplateName;
    5: required string Category;
}
struct collectionContent{
    1: required string Name;
    2: required string Date;
    3: required string Version;
    4: required string Content;
    5: required string TemplateName;
    6: required string Category;
}

// -------------------------Create Configure-----------------------------
const i32 CONFIGUREOBJECTPROTO_MESSAGE_CREATE_CONFIGURE = 310008

struct CreateConfigure
{
    1: required ACLProto.LoginSession session;
    2: required configure Configure;
    3: required list<collection> ObjectList;
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

// -------------------------Create Collection-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_CREATE_COLLECTION = 310020

struct CreateCollection
{
    1: required ACLProto.LoginSession session;
    2: required collectionContent Collection;
    3: required string publicKey;
}

struct CreateCollectionResponse
{
    1: i32 status;
    2: string message;
    3: i32 resourceId;
}

// -------------------------Delete Collection-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_DELETE_COLLECTION = 310022

struct DeleteCollection
{
    1: required ACLProto.LoginSession session;
    2: required list<collection> Collections;

}

struct DeleteCollectionResponse
{
    1: i32 status;
    2: string message;
}

// -------------------------Get Collection-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_GET_COLLECTION = 310024

struct GetCollection
{
    1: required ACLProto.LoginSession session;
    2: required list<collection> Collections;
    3: required string privateKey;
}

struct GetCollectionResponse
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
    3: required string privateKey;

}

struct GetConfigureResponse
{
    1: i32 status;
    2: string message;
    3: map<string, binary> Content;

}


// -------------------------Grant Collection-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_GRANT_COLLECTION = 310032

struct GrantCollection
{
	1: required ACLProto.LoginSession session;
	2: required i32 RoleId;
	3: required list<i32> ResourceIds;
	4: required string PrivateKey;
}

struct GrantCollectionResponse
{
	1: i32 status;
    2: string message;
}

// -------------------------Revoke Collection-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_REVOKE_COLLECTION = 310034

struct RevokeCollection
{
    1: required ACLProto.LoginSession session;
	2: required i32 OthersId;
	3: required list<collection> CollectionList;
}
struct RevokeCollectionResponse
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
    4: required string privateKey;
	5: required string othersPublicKey;

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


// -------------------------List Collections-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_LIST_COLLECTIONS = 310040

struct ListCollections
{
    1: required ACLProto.LoginSession session;
}
typedef list<collection> cols
struct ListCollectionsResponse
{
	1: i32 status;
    2: string message;
    3: map<string, cols> collections;
}

// -------------------------List Authority Sharers-----------------------------

const i32 CONFIGUREOBJECTPROTO_MESSAGE_LIST_AUTHORITY_SHARERS = 310042

struct ListAuthoritySharers
{
    1: required ACLProto.LoginSession session;
    2: required collection Object;
}

struct ListAuthoritySharersResponse
{
	1: i32 status;
    2: string message;
    3: list<string> SharerList;
}



