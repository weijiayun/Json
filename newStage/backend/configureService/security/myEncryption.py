#coding: utf8
import sys
from Crypto.Cipher import AES
from binascii import b2a_hex, a2b_hex
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5 as Cipher_pkcs1_v1_5
import base64
import hashlib
import os
import time
from Crypto.Signature import PKCS1_v1_5 as Signature_pkcs1_v1_5
from Crypto import Random
from Crypto.Hash import SHA


#产生唯一的KEY
def key():
    timeNow = time.time()
    userName = os.path.expanduser('~').split('\\')[-1]
    m = hashlib.md5()
    m.update(str(timeNow)+userName)
    return  m.hexdigest()

#AES
#加密
def aesEnctypt(key, text):
    cryptor = AES.new(key, AES.MODE_CBC, key[:16])
    #加密函数，如果text不是16的倍数，那就补足为16的倍数
    length = 16
    count = len(text)
    add = length - (count % length)
    text = text + ('\0' * add)
    ciphertext = cryptor.encrypt(text)
    #因为AES加密时候得到的字符串不一定是ascii字符集的，输出到终端或者保存时候可能存在问题
    #所以这里统一把加密后的字符串转化为16进制字符串
    return b2a_hex(ciphertext)
#解密
def aesDectypt(key, ciphertext):
    cryptor = AES.new(key, AES.MODE_CBC, key[:16])
    text2 = cryptor.decrypt(a2b_hex(ciphertext))
    #解密后，用strip()去掉补足的空格
    return text2.rstrip('\0')

#RSA
#公钥加密
def rsaEncrypt( text, publicKey):
    rsakey = RSA.importKey(publicKey)
    cipher = Cipher_pkcs1_v1_5.new(rsakey)
    cipher_text = base64.b64encode(cipher.encrypt(text))
    return  cipher_text

#私钥解密
def rsaDecrypt( entext, privateKey):
    rsakey = RSA.importKey(privateKey)
    cipher = Cipher_pkcs1_v1_5.new(rsakey)
    text = cipher.decrypt(base64.b64decode(entext),' decrypt failed ')
    return text


def grantToOther(enkey, myPrivateKey, othersPrivateKey):
    key = rsaDecrypt(enkey, myPrivateKey)
    enkey2 = rsaEncrypt(key,othersPrivateKey)
    return enkey2


if __name__ == '__main__':
    mykey = key()
    print mykey[:16]
    print 1111111111111111111111111
    # 'keyskeyskeyskeys'
    pc = aesEnctypt(mykey,"00000")
    d = aesDectypt(mykey,pc)
    print  d


    # rsa算法生成实例
    rsa = RSA.generate(1024)
    # master的秘钥对的生成
    private_pem = rsa.exportKey()
    with open('ghost-private.pem', 'w') as f:
        f.write(private_pem)
    #     print private_pem
    print private_pem
    public_pem = rsa.publickey().exportKey()
    with open('ghost-public.pem', 'w') as f:
        f.write(public_pem)
    #     print public_pem
    print public_pem
   # print private_pem
    t = "zhang hai xu !!!!"
    t1 = rsaEncrypt(t,public_pem)
    print t1
    t2 = rsaDecrypt(t1, private_pem)
    print t2==t

    t3= grantToOther(t1, private_pem, public_pem )

    t4= rsaDecrypt(t3, private_pem)


    print t4


















