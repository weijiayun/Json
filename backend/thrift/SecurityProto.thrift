include "ACLProto.thrift"
// -------------------------Put content-----------------------------

const i32 SECURITYPROTO_MESSAGE_PUT_CONTENT = 110000

struct PutContent
{
	1: required ACLProto.LoginSession session;
	2: required binary content;
	3: required binary key;	
}

struct PutContentResponse
{
    1: i32 status;
    2: string message;
    3: i32 contentId;
	4: i32 keyId;
}


// -------------------------Get Content----------------------------

const i32 SECURITYPROTO_MESSAGE_GET_CONTENT = 110002

struct GetContent
{
	1: required ACLProto.LoginSession session;
	2: required i32 contentId;
	//3: required i32 keyId;
}

struct GetContentResponse
{
    1: i32 status;
    2: string message;
    3: binary content;
	4: binary key;	
}




// -------------------------Delete content-----------------------

const i32 SECURITYPROTO_MESSAGE_DELETE_CONTENT = 110004

struct DeleteContent
{
	1: required ACLProto.LoginSession session;
	2: required i32 contentId;
}

struct DeleteContentResponse
{
    1: i32 status;
    2: string message;
}



// -------------------------List content---------------------------

const i32 SECURITYPROTO_MESSAGE_LIST_CONTENT = 110006

struct ListContent
{
	1: required ACLProto.LoginSession session;
}

struct ContentKey
{
	1: i32 contentId;
	2: i32 keyId;
}

struct ListContentResponse
{
    1: i32 status;
    2: string message;
	3: list<ContentKey> contents;
}



// -------------------------Get key----------------------------

const i32 SECURITYPROTO_MESSAGE_GET_KEY= 110008

struct GetKey
{
	1: required ACLProto.LoginSession session;
	//2: required i32 keyId; 
	2: required i32 contentId;
}

struct GetKeyResponse
{
    1: i32 status;
    2: string message;
	3: binary key;	
}


// -------------------------Put key-----------------------------

const i32 SECURITYPROTO_MESSAGE_PUT_KEY = 110010

struct PutKey
{
	1: required ACLProto.LoginSession session;
	2: required binary key;	
    3: required i32 contentId;
    4: required i32 userId;
}

struct PutKeyResponse
{
    1: i32 status;
    2: string message;
	3: i32 keyId;
}


// -------------------------Put series content --------------------

const i32 SECURITYPROTO_MESSAGE_PUT_SERIES_CONTENT = 110012

struct Content
{
	1: required string name;
	2: required binary content;
	3: required binary key;
}


struct PutSeriesContent
{
	1: required ACLProto.LoginSession session;
	2: required list<Content>  seriesContent;
}

struct ContentKeyId
{
	//1: string name;
    1: i32 contentId;
    2: i32 keyId;
}
struct PutSeriesContentResponse
{
    1: i32 status;
    2: string message;
    3: map<string, ContentKeyId> ckIds;
}










