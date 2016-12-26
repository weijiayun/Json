#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'

import thread
import random
import time
import sys

response = thread._local()

response.abc = 1

aaa=""

def getit():
    print thread.get_ident(), "getit response.id is", response.abc

def myfunc(string, sleeptime, *args):
    while 1:
        response.abc = random.randrange(1,20)
        print string, "getit response.id is", response.abc
        arg1 = random.randrange(1,6)
        time.sleep(arg1)
        getit()
        time.sleep(sleeptime)
        if aaa == "quit":
            sys.exit()

def test(x, y):
    print x, y
    global aaa
    while 1:
        aaa = sys.stdin.readline()# raw_input() also can read keyboard, aaa must be a global var
        aaa = aaa[:-1]
        print 'aaa is ',aaa
        if aaa == "quit":
            print "10 seconds quit the thread, not the proccess"
            time.sleep(10)
            sys.exit()
        time.sleep(1)

if __name__ == "__main__":
    thread.start_new_thread(myfunc, ("thread No: 1", 2))
    thread.start_new_thread(myfunc, ("thread No: 2", 2))
    thread.start_new_thread(test, ("1", "2"))
    while 1:
        print "main thread"
        print "aaa in main",aaa
        if aaa != 'any':
            for i in range(10):
                print i
                time.sleep(1)
        else:
            print 'input some words'
            sys.exit()
