// -------------------------------------------
include "ACLProto.thrift" 
namespace cpp TEMPL_JSON
// -------------------------------------------

const i32 TEMPLJSON_MESSAGE_UP_CONTENT = 210001

struct UpContent //发送内容请求
{
	1: required ACLProto.LoginSession session;
	2: required string name;
	3: required string version;
	4: required binary contents;
}

struct UpContentResponse //返回的内容信息
{
	1: i32 status;
    2: string message;
	3: string name;
	4: bool isLegal;
	5: string version;
	6: bool isVersionIn;
}

// -------------------------------------------

const i32 TEMPLJSON_MESSAGE_JSON_RELATION = 210002

struct JsonRelation//请求Json relationship
{
    1: required ACLProto.LoginSession session;
	2: required string JsonRelationName;
	3: required string version;
}

struct JsonRelationResponse //返回Json relationship信息
{
	1: i32 status;
    2: string message;
    3: string JsonRelationName;
	4: string version;
	5: string JRelation;
}

// -------------------------------------------

const i32 TEMPLJSON_MESSAGE_BASE_CHECK = 210003

struct BaseCheck//基类查看
{
    1: required ACLProto.LoginSession session;
	2: required string BaseName;
	3: required string version;
}

struct BaseCheckResponse //返回基类查看信息
{
	1: i32 status;
    2: string message;
    3: string BaseName;
	4: string version;
	5: string BRelation;
}

// -------------------------------------------

const i32 TEMPLJSON_MESSAGE_DOWNLOAD = 210004

struct DownLoad//下载
{
    1: required ACLProto.LoginSession session;
	2: required string TemplName;
	3: required string version;
}

struct DownLoadResponse //返回下载信息
{
	1: i32 status;
    2: string message;
    3: string TemplName;
	4: string version;
	5: binary contents;
}

// -------------------------------------------

const i32 TEMPLJSON_MESSAGE_GET_JSON_CON = 210005

struct GetJsonCon//请求Json内容
{
    1: required ACLProto.LoginSession session;
	2: required string JsonAttrName;
	3: required string version;
}

struct GetJsonConResponse //返回内容信息
{
	1: i32 status;
    2: string message;
    3: string JsonAttr;
	4: string version;
}

// -------------------------------------------

const i32 TEMPLJSON_MESSAGE_GRANT_AUTHORITY = 210006

struct GrantAuthority//请求授权
{
    1: required ACLProto.LoginSession session;
	2: required i32 userId;
}

struct GrantAuthorityResponse //返回授权信息
{
	1: i32 status;
    2: string message;
}

// -------------------------------------------

const i32 TEMPLJSON_MESSAGE_TEMPL_MERGE = 210007

struct TemplMerge//请求合并模板
{
    1: required ACLProto.LoginSession session;
}

struct TemplMergeResponse //返回合并信息
{
	1: i32 status;
    2: string message;
}

// -------------------------------------------

const i32 TEMPLJSON_MESSAGE_CREATE_VERSION = 210008

struct CreateVersion//请求创建版本
{
    1: required ACLProto.LoginSession session;
	2: required string name;
	3: required string version;
	4: required binary contents;
}

struct CreateVersionResponse //返回合并信息
{
	1: i32 status;
    2: string message;
}
