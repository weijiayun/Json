#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'


class ClientBasket(object):

    def __init__(self):
        self.items = {}

    def getClient(self, session, registClientName):
        if self.items.has_key(session["uname"]):
            if self.items[session["uname"]].has_key(registClientName):
                return self.items[session["uname"]][registClientName]
            else:
                raise KeyError("Client Error: {0} has not been registed!!!".format(registClientName))
        else:
            raise KeyError("User: {0} has no any Client been registed".format(session["uname"]))

    def getAll(self):
        return self.items

    def registClient(self, session, clientInstance, registClientName):

        '''rigist the own Client for user'''

        if not self.items.has_key(session["uname"]):
            self.items[session["uname"]] = {registClientName: clientInstance}
        else:
            self.items[session["uname"]].update({registClientName: clientInstance})

    def unRegistClient(self, session):

        '''remove all Client of user'''

        if self.items.has_key(session["uname"]):
            del self.items[session["uname"]]
        else:
            raise KeyError("User: {0} has no any Client been registed".format(session["uname"]))