#!/opt/Apps/local/Python/anaconda/bin/python
#coding: utf-8
import json

class VV(object):
    pass

class MyEncoder(json.JSONEncoder):
    def default(self, o):
        so = {}
        for attr in o.__dict__:
            if attr != 'islegal' and attr != 'objectcontent':
                if getattr(o, attr)== {}:
                    pass
                elif getattr(o, attr)== []:
                    pass
                elif getattr(o, attr)== None:
                    pass
                elif not callable(attr):
                        v = getattr(o, attr)
                        if not v and issubclass(type(v), VV):
                            so[attr] = self.default(v)
                        else:
                            so[attr] = v
        return so

class FFunction(VV):
    def __init__(self,FunctionName):
        self.FunctionName = FunctionName
        self.Parameters = []

class FieldObject(VV):
    def __init__(self,Fieldname):
        self.Fieldname = Fieldname
        self.Requiredness = True
        self.Type = None
        self.EleType = None
        self.IsAuto = False
        self.Default = None
        self.IsFixed = False
        self.Reference = None
        self.Function = None
        self.DimensionX = None
        self.DimensionY = None

class TemplObject(VV):
    def __init__(self,objectcontent): #templobject为string
        ############初始化模板元素##############
        #无需输出
        self.objectcontent = objectcontent
        self.islegal = None
        #共有输出
        self.TemplName = None
        self.TemplType = None
        #struct输出
        self.BaseName = None
        self.Category = None
        self.Fields = [] #连接field属性
        self.FieldName = {} #存field名称
        #enum输出
        self.Values = {}
        ############初始化模板内容##############
        if self.objectcontent[0].startswith('enum '):
            self.TemplType = 'enum'
        elif self.objectcontent[0].startswith('struct '):
            self.TemplType = 'struct'
        else:
            self.islegal = 401      ######模板未以‘struct’或者‘enum’开头
            return
        ##########################################
        if self.islegal == None:
            for i0 in range(len(self.objectcontent)):
                self.objectcontent[i0] = self.objectcontent[i0].strip()
            if self.GetTemplName() == False: #获取模板名称
                return
            if self.islegal == None and self.TemplType == 'struct':
                if self.GetBaseName() == False:  # 获取模板基类
                    return
            if self.islegal == None and self.TemplType == 'struct':
                if self.GetCategory() == False:  # 获取模板所属类别
                    return
                ###################将template内容截取出来######################
            if self.islegal == None:
                ind1 = self.objectcontent.index('{')  # self.objectcontent为列表
                if ind1 != -1:
                    self.objectcontent = self.objectcontent[ind1 + 1:]
                    self.FieldDcode()
                    ###########验证field是否有函数，函数是否有参数，参数是否合法########
                    if self.islegal == None and self.TemplType == 'struct':
                        for ii1 in range(len(self.Fields)):
                            if self.Fields[ii1].Function != None:
                                itemslen = len(self.Fields[ii1].Function.Parameters)
                                if itemslen != 0:
                                    for ii2 in range(itemslen):
                                        if self.FieldName.has_key(self.Fields[ii1].Function.Parameters[ii2]):
                                            pass
                                        else:
                                            self.islegal = 402  ######函数中有参数不在该结构体内
                                            break
                                else:
                                    pass
                            if self.Fields[ii1].DimensionX != None and isinstance(self.Fields[ii1].DimensionX,int)!=True:
                                if self.FieldName.has_key(self.Fields[ii1].DimensionX):
                                    pass
                                else:
                                    self.islegal = 403     ######维度X中有参数不在该结构体内
                                    break
                            if self.Fields[ii1].DimensionY != None and isinstance(self.Fields[ii1].DimensionY,int)!=True:
                                if self.FieldName.has_key(self.Fields[ii1].DimensionY):
                                    pass
                                else:
                                    self.islegal = 404     ######维度Y中有参数不在该结构体内
                                    break
                            else:
                                pass
                else:
                    self.islegal = 405
                    return

    def GetTemplName(self): #template名称
        if self.TemplType == 'enum':
            index1 = self.objectcontent[0].find('enum ')
            if index1 != -1:
                self.TemplName = self.objectcontent[0][index1+5:len(self.objectcontent[0])]
                return self.TemplName
            else:
                self.islegal = 406  ######获取‘enum’的template名称失败
                return False
        elif self.TemplType == 'struct':
            index1 = self.objectcontent[0].find('(')
            index2 = self.objectcontent[0].find('struct ')
            if index1 != -1 and index2 != -1:
                self.TemplName = self.objectcontent[0][index2+7:index1]
                return self.TemplName
            else:
                self.islegal = 407  ######获取‘struct’的template名称失败
                return False

    def GetCategory(self): #Category名称
        if self.TemplType == 'struct':
            index1 = self.objectcontent[0].find('(')
            index2 = self.objectcontent[0].find(':')
            if index1 != -1 and index2 != -1:
                category = self.objectcontent[0][index1 + 1:index2]
                if category.islower() == True:
                    self.Category = category
                    return self.Category
                else:
                    self.islegal = 408  ######类别字段中未全部小写
                    return False
            else:
                self.islegal = 409   ######获取Category名称失败，或因格式错误，找不到‘(’or‘：’
                return False

    def GetBaseName(self): #base名称
        if self.TemplType == 'struct':
            index1 = self.objectcontent[0].find(':')
            index2 = self.objectcontent[0].find(')')
            if index1 != -1 and index2 != -1:
                baseName = self.objectcontent[0][index1 + 1:index2]
                self.BaseName = baseName
                return self.BaseName
                # if baseName.islower() == True:
                #     self.BaseName = baseName
                #     return self.BaseName
                # else:
                #     self.islegal = 410  ######基类字段中未全部小写
                #     return False
            else:
                self.islegal = 411  ######获取基类名称失败，或因格式错误，找不到‘)’or‘：’
                return False

    def FieldDcode(self):#field名称和attribute
        ###### DimensionX,Y和Function.items需要最后判断是否在field字段里
        contentsplit = []
        for i1 in range(len(self.objectcontent)):
            if self.TemplType =='enum':
                self.objectcontent[i1] = self.objectcontent[i1].rstrip(',')
                if self.objectcontent[i1].count('=') == 1:
                    contentsplit.append(self.objectcontent[i1].split('='))
                else:
                    self.islegal = 412  ######enum模板格式错误
                    break
            elif self.TemplType =='struct':
                self.objectcontent[i1] = self.objectcontent[i1].rstrip(';')
                if self.objectcontent[i1].count('$') > 1:
                    contentsplit.append(self.objectcontent[i1].split(' ',4))
                else:
                    contentsplit.append(self.objectcontent[i1].split())

        ##########################
        if self.TemplType =='enum' and self.islegal == None:
            for j1 in range(len(contentsplit)):
                for j2 in range(len(contentsplit[j1])):
                    contentsplit[j1][j2] = contentsplit[j1][j2].strip()
                try:
                    self.Values.setdefault(contentsplit[j1][0],int(contentsplit[j1][1]))
                except ValueError:
                    self.islegal = 413  ######enum模板格式错误,'='后面不是数字
                    break

        ##########################
        elif self.TemplType =='struct':
            for i2 in range(len(contentsplit)):
                self.FieldName.setdefault(contentsplit[i2][2],i2)
                contentsplit[i2][2] = FieldObject(contentsplit[i2][2])
                self.Fields.append(contentsplit[i2][2])
                fieldnode = self.Fields.pop()

                if contentsplit[i2][0] == 'optional':
                    fieldnode.Requiredness = False
                elif contentsplit[i2][0] != 'required':
                    self.islegal = 414  ######字段未以optional或required开头
                    break

                if ('<' in contentsplit[i2][1]) and ('>' in contentsplit[i2][1]):
                    typeindex = contentsplit[i2][1].find('<')
                    fieldnode.Type = contentsplit[i2][1][0:typeindex]
                    eleTypeindex = contentsplit[i2][1].find('>')
                    eleType = contentsplit[i2][1][typeindex + 1:eleTypeindex]
                    if (fieldnode.Type != 'vec') and (fieldnode.Type != 'mat'):
                        fieldnode.EleType = eleType
                    elif ((fieldnode.Type == 'vec') or (fieldnode.Type == 'mat')) and (',' not in eleType):
                        fieldnode.DimensionY = 1
                        try:
                            fieldnode.DimensionX = int(eleType)
                        except ValueError:
                            fieldnode.DimensionX = eleType
                    elif ((fieldnode.Type == 'vec') or (fieldnode.Type == 'mat')) and (',' in eleType):
                        dimXY = eleType.split(',')
                        dimX = dimXY[0].strip()
                        dimY = dimXY[1].strip()
                        try:
                            fieldnode.DimensionX = int(dimX)
                            fieldnode.DimensionY = int(dimY)
                        except ValueError:
                            fieldnode.DimensionX = dimX
                            fieldnode.DimensionY = dimY
                    else:
                        self.islegal = 415  ######‘vec’或者‘mat’字段格式错误
                        break

                elif ('<' not in contentsplit[i2][1]) and ('>' not in contentsplit[i2][1]):
                    fieldnode.Type = contentsplit[i2][1]
                else:
                    self.islegal = 416   ######‘vec’或者‘mat’字段格式错误
                    break

                if len(contentsplit[i2]) == 4:
                    if contentsplit[i2][3] == 'auto':
                        fieldnode.IsAuto = True

                if len(contentsplit[i2]) == 5:
                    if contentsplit[i2][3] == 'reference':
                        fieldnode.Reference = contentsplit[i2][4]
                    elif contentsplit[i2][3] == 'default':
                        try:
                            fieldnode.Default = int(contentsplit[i2][4])
                        except ValueError:
                            fieldnode.Default = contentsplit[i2][4]
                    elif contentsplit[i2][3] == 'equal':
                        fieldnode.IsFixed = True
                        #########################
                        if contentsplit[i2][4].count('$') == 1:
                            if '$m' in contentsplit[i2][4]:
                                funcname = contentsplit[i2][4].lstrip('$m')
                                fieldnode.Function = FFunction(funcname)
                            elif '$' in contentsplit[i2][4]:
                                funcname = contentsplit[i2][4].lstrip('$')
                                fieldnode.Function = FFunction(funcname)
                            else:
                                self.islegal = 417 ######函数格式错误
                                break
                        #########################
                        if contentsplit[i2][4].count('$') > 1:
                            func = contentsplit[i2][4].rstrip(')')
                            func = func.split('(')
                            for i4 in range(len(func)):
                                func[i4] = func[i4].strip()
                            if '$m' in func[0]:
                                funcname = func[0].lstrip('$m')
                                fieldnode.Function = FFunction(funcname)
                            elif '$' in func[0]:
                                funcname = func[0].lstrip('$')
                                fieldnode.Function = FFunction(funcname)
                            else:
                                self.islegal = 418 ######函数格式错误
                                break
                            funcitem = func[1].split(',')
                            for i5 in range(len(funcitem)):
                                funcitem[i5] = funcitem[i5].strip()
                            for i3 in range(len(funcitem)):
                                if funcitem[i3].startswith('$m', 0, 2):
                                    funcitem[i3] = funcitem[i3].lstrip('$m')
                                elif funcitem[i3].startswith('$', 0, 1):
                                    funcitem[i3] = funcitem[i3].lstrip('$')
                                else:
                                    self.islegal = 419 ######函数格式错误
                                    break
                                if ('.' not in funcitem[i3]) and ('[' not in funcitem[i3]) and (
                                    ']' not in funcitem[i3]):
                                    fieldnode.Function.Parameters.append(funcitem[i3])
                                elif ('.' not in funcitem[i3]) and ('[' in funcitem[i3]) and (']' in funcitem[i3]):
                                    index = funcitem[i3].find('[')
                                    funcitem[i3] = funcitem[i3][0:index]
                                    fieldnode.Function.Parameters.append(funcitem[i3])
                                elif ('.' in funcitem[i3]) and ('[' not in funcitem[i3]) and (']' not in funcitem[i3]):
                                    index = funcitem[i3].find('.')
                                    funcitem[i3] = funcitem[i3][0:index]
                                    fieldnode.Function.Parameters.append(funcitem[i3])
                                elif ('.' in funcitem[i3]) and ('[' in funcitem[i3]) and (']' in funcitem[i3]):
                                    index = funcitem[i3].find('[')
                                    funcitem[i3] = funcitem[i3][0:index]
                                    fieldnode.Function.Parameters.append(funcitem[i3])
                                else:
                                    self.islegal = 420  ######函数格式错误
                                    break

                    else:
                        self.islegal = 421  ######字段后面有除了'equal,reference,default,auto'以外的字符串，无法识别
                        break
                elif len(contentsplit[i2]) < 2 or len(contentsplit[i2]) > 5:
                    self.islegal = 422  ######字段描述出错，太少或者太多，无法识别
                    break
                self.Fields.append(fieldnode)