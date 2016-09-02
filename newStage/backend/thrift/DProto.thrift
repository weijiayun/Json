namespace cpp DProto

struct DResponse
{
    1:i32 Status;      //0- Sucuess 1-failed.
    2:string Message;  //details
}


//error code
const i32 DMESSAGE_ERROR_FIRST = 0;
const i32 DMESSAGE_ERROR_OK = 0; 
const i32 DMESSAGE_ERROR_FAILED = 1;
const i32 DMESSAGE_ERROR_UNREACHABLE = 2;
const i32 DMESSAGE_ERROR_TYPEBODY_MISMATCH = 3;
const i32 DMESSAGE_ERROR_NO_LOGIN = 4;
const i32 DMESSAGE_ERROR_UNAUTH = 5;
const i32 DMESSAGE_ERROR_MSG_TOOLONG = 6;

const i32 DMESSAGE_ERROR_MAX_COUNT = 1024;
const i32 DMESSAGE_ERROR_1_FIRST = 1024;  // TT
const i32 DMESSAGE_ERROR_2_FIRST = 2048;  // IQ
const i32 DMESSAGE_ERROR_3_FIRST = 4096;  // Mammoth(TTmate)
const i32 DMESSAGE_ERROR_4_FIRST = 8192;  // MO
const i32 DMESSAGE_ERROR_5_FIRST = 16384; // Feed

const i32 DMESSAGE_ERROR_7_FIRST = 65536; // Sundial

//groups
const i32 DMESSAGE_GROUP_MAX_COUNT = 4096;
const i32 DMESSAGE_GROUP_FIRST = 1073741824; // 1 << 30
const i32 DMESSAGE_GROUP_1_FIRST = 1073741824; // DMESSAGE_GROUP_FIRST                  TT
const i32 DMESSAGE_GROUP_2_FIRST = 1073745920; // DMESSAGE_GROUP_FIRST + (1 * 4096)     IQ
const i32 DMESSAGE_GROUP_3_FIRST = 1073750016; // DMESSAGE_GROUP_FIRST + (2 * 4096)     Mammoth(TTmate)
const i32 DMESSAGE_GROUP_4_FIRST = 1073754112; // DMESSAGE_GROUP_FIRST + (3 * 4096)     MO
const i32 DMESSAGE_GROUP_5_FIRST = 1073758208; // DMESSAGE_GROUP_FIRST + (4 * 4096)	    Feed
const i32 DMESSAGE_GROUP_7_FIRST = 1073766400; // DMESSAGE_GROUP_FIRST + (6 * 4096)	    Sundial


//message type
const i32 DMESSAGE_TYPE_MAX_COUNT = 65536;
const i32 DMESSAGE_TYPE_1_FIRST = 0;      //                                      TT
const i32 DMESSAGE_TYPE_2_FIRST = 65536;  // DMESSAGE_TYPE_FIRST + (1 * 65536)    IQ
const i32 DMESSAGE_TYPE_3_FIRST = 131072; // DMESSAGE_TYPE_FIRST + (2 * 65536)    Mammoth(TTmate)
const i32 DMESSAGE_TYPE_4_FIRST = 196608; // DMESSAGE_TYPE_FIRST + (3 * 65536)    MO
const i32 DMESSAGE_TYPE_5_FIRST = 262144; // DMESSAGE_TYPE_FIRST + (4 * 65536)    Feed
const i32 DMESSAGE_TYPE_6_FIRST = 327680; // DMESSAGE_TYPE_FIRST + (5 * 65536)    ACLSystem
const i32 DMESSAGE_TYPE_7_FIRST = 393216; // DMESSAGE_TYPE_FIRST + (6 * 65536)    Sundial
const i32 DMESSAGE_TYPE_8_FIRST = 458752; // DMESSAGE_GROUP_FIRST + (7 * 65536)     LMFHF

//app index
const i32 DMESSAGE_APP_FIRSt = 0;
const i32 DMESSAGE_APP_TT = 0;
const i32 DMESSAGE_APP_IQ = 1;
const i32 DMESSAGE_APP_TTMATE = 2;
const i32 DMESSAGE_APP_MO = 3;
const i32 DMESSAGE_APP_MK = 4;
const i32 DMESSAGE_APP_FEED = 5;
const i32 DMESSAGE_APP_ACLSystem = 6;
const i32 DMESSAGE_APP_SUNDIAL = 7;




