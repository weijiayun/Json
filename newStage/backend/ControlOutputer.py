from protoMeta.MessageOutputCore import MessageOutputer
from protoMeta.TypeSpec import EnumSpec
import collections

class ControlOutputer(MessageOutputer):
    def __init__(self,sink):
        self.indent = 0
        self.sink = sink
        self.lastIsEmpty = False
        self.columnInterval = None
        self.isOutputList = True

        import json
        self.tableMappings = json.load(open('list2table.mapping','r'), object_pairs_hook=collections.OrderedDict)
        self.columns = []
        self.currentMapping = None

    def indentString(self):
        #return ' ' * self.indent
        return '    '

    def writeLine(self,text):
        if 0 != len(text):
            self.sink.write(text + '\n')
        elif not self.lastIsEmpty:
            self.lastIsEmpty = True
            self.sink.write('\n')

    def outputValue(self,fieldSpec,fieldName,obj):
        if isinstance(fieldSpec,EnumSpec):
            obj = fieldSpec.value2String(obj)

        if 0 != len(self.columns):
            if fieldName in self.currentMapping:
                self.columns[-1][self.currentMapping[fieldName]] = str(obj)
        else:
            line = self.indentString() + fieldName + '(' + fieldSpec.getName() + '):'
            if len(line) < 50:
                line = line + ' ' * (50 - len(line))
            self.writeLine(line + str(obj))
        self.lastIsEmpty = False


    def beginStruct(self,fieldSpec,fieldName,obj):
        #if '' != fieldName:
        #    self.writeLine(self.indentString() + fieldName + '(' + fieldSpec.getName() + ')')
        #self.indent = self.indent + 4
        if self.isOutputList and fieldSpec.getName() in self.tableMappings:
            if self.currentMapping is None:
                self.currentMapping = self.tableMappings[fieldSpec.getName()]
            obj = collections.OrderedDict()
            for (realName, mapName) in self.currentMapping.items():
                obj[mapName] = None
            self.columns.append(obj)


    def endStruct(self,fieldSpec,fieldName,obj):
        self.indent = self.indent - 4
        if self.currentMapping is None:
            self.writeLine('')

    def beginList(self,fieldSpec,fieldName,obj):
        #self.writeLine(self.indentString() + fieldName + '(list)')
        #self.indent = self.indent + 4
        self.isOutputList = True
        self.columns = []
        self.currentMapping = None

    def endList(self,fieldSpec,fieldName,obj):
        self.indent = self.indent - 4
        self.isOutputList = False
        if 0 != len(self.columns):
            from tabulate import tabulate
            table = tabulate(self.columns, headers='keys',tablefmt='orgtbl')
            table = self.indentString() + table.replace('\n','\n' + self.indentString())
            self.sink.write(table)
        self.columns = []
        self.currentMapping = None
        self.writeLine('')

    def beginMap(self,fieldSpec,fieldName,obj):
        #self.writeLine(self.indentString() + fieldName + '(map)')
        #self.indent = self.indent + 4
        pass

    def endMap(self,fieldSpec,fieldName,obj):
        self.indent = self.indent - 4
        self.writeLine('')

    def endMessage(self, fieldSpec, fieldName, obj):
        self.writeLine(self.indentString() + 50 * '-')

