
class foo(object):

    def func(self,p1,p2):
        print "para1: "+p1+"para2: "+p2

    def addnewattributesfromotherclass(self,class_name):
        func_names = dir(class_name)
        for func_name in func_names:
          if not func_name.startswith('_'):
            new_func = getattr(class_name,func_name)
            self.__setattr__(func_name,new_func())

if __name__ == "__main__":

    funcDict = {
        "functionName":"func",
        "paras":["test1","test2"]
    }
    a=funcDict["paras"]
    print '{0:,}'.format(34535345345)
    summ = reduce(lambda x,y:"'{0}','{1}'".format(x,y),a)
    exec("s=foo()")
    exec("s.func({0})".format(summ))





