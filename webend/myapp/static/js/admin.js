/**
 * Created by weijiayun on 12/21/16.
 */
$(document).ready(function() {
    adminContext.updateAddUserRow();
    adminContext.showResources();
    adminContext.showRoles();
    adminContext.showUsers();
});
var adminContext = adminContext || (function () {
        var contextCustomFuncDict = {
            showRoles:function () {
                $.ajax("/listRoles", {
                    dataType: 'json'
                }).done(function (data) {
                if (data.flag){
                    data = data.data;
                    var tbhtml = '<table class="am-table am-table-bd am-table-striped admin- content-table am-table-hover  am-table-centered">';
                    tbhtml += '<thead><tr><th></th><th>ID</th><th>Name</th><th>Resource</th></tr></thead>';
                    tbhtml += '<tbody></tbody></table>';
                    $("#roleTable").append(tbhtml);
                    for (var i = 0; i < data.length; ++i) {
                        var trhtml = '<tr onclick="setActive(this)" ondblclick="dblclickToShow()"><td width="5%"><label class="am-checkbox hx-rmmargin"><input name="ckb" type="checkbox"/> </label></td>';
                        trhtml += '<td>{0}</td>'.format(data[i][0]);
                        trhtml += '<td><a href="#">{0}</a></td>'.format(data[i][1]);
                        var selectId = 'roleTableNew{0}'.format(data[i][1]);
                        var optionList = data[i][3];
                        trhtml += "<td><select id='{0}' multiple='multiple' size='2'>".format(selectId);
                        for (var j in optionList) {
                            trhtml += "<option value='{0}'>{1}</option>".format(optionList[j][0], optionList[j][1]);
                        }
                        trhtml += '</select></td></tr>';
                        $("#roleTable").find("table.am-table").find("tbody").append(trhtml);
                        $("#{0}".format(selectId)).multiselect({
                            checkAllText: "CheckAll", uncheckAllText: "UnCheckAll", selectedList: 3})
                    }
                }
                }).fail(function (xhr, atatus) {
                    alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
                });
                
            },
            addRole:function () {
                

            },
            updateAddUserRow:function () {
                $.ajax("/listRoles", {
                    dataType: 'json'
                }).done(function (data) {
                    if(data.flag){
                        $("#newUser").empty();
                        var html = '<td contenteditable="true" spellcheck="false">1</td>'
                        html += '<td spellcheck="false"><input type="text" onkeydown="preventEnterSpace(event)" style="border:0; height :100%;width:100%" placeholder="user name"></td>';
                        html +='<td spellcheck="false"><input type="text" onkeydown="preventEnterSpace(event)" style="border:0; height :100%;width:100%" placeholder="password"></td>'
                        html +='<td spellcheck="false"><input type="text" onkeydown="preventEnterSpace(event)" style="border:0; height :100%;width:100%" placeholder="xx@xx.com"></td>'
                        html += "<td id='roleSelect'></td>";
                        html += '<td><button class=" am-btn am-btn-secondary" type="button" onclick="adminContext.addUser()" >Commit</button></td>';
                        $("#newUser").append(html);
                        data = data.data;
                        html = "<select  id='newSelectRole'>";
                        for(var i in data){
                            html += "<option value='{0}'>{1}</option>".format(data[i][0],data[i][1])
                        }
                        html += "</select>";
                        $('#roleSelect').append(html);
                        $("#newSelectRole").multiselect({
                            buttonWidth: '180px',
                            enableFiltering: true,
                            enableCaseInsensitiveFiltering: true,
                            filterPlaceholder: 'Search'
                        });
                    }
                }).fail(function (xhr, atatus) {
                    alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
                })
            },
            getNewUserInfo:function (){
                var newRole = [];
                var uname=$("#newUser").children().eq(1).children().val();
                var passwd=$("#newUser").children().eq(2).children().val();
                var email=$("#newUser").children().eq(3).children().val();
                var array_of_checked_values = $("#newSelectRole").val();
                newRole.push($("#userTable tbody").children().size()+1);
                newRole.push(uname);
                newRole.push(email);
                newRole.push(passwd);
                newRole.push(array_of_checked_values);
                return newRole;
            },
            addUser:function () {
                var info = contextCustomFuncDict.getNewUserInfo();
                $.ajax("/addUser/{0}/{1}/{2}/{3}".format(info[1],info[2],hex_md5(info[3]),parseInt(info[4])), {
                    dataType: 'json'
                }).done(function (user) {
                    if (user.flag){
                        $.ajax("/listRoles", {
                            dataType: 'json'
                        }).done(function (data) {
                            if(data.flag){
                                contextCustomFuncDict.updateAddUserRow();
                                var trHtml = '<tr onclick="setActive(this)" ondblclick="dblclickToShow()"><td><label class="am-checkbox hx-rmmargin"><input name="ckb" type="checkbox"/> </label></td>';
                                for (var i=0; i<info.length-2; i++ )
                                {
                                    trHtml+="<td>" + info[i]+ "</td>";
                                }
                                var selectId='userTableNew{0}'.format(user.id);
                                trHtml += "<td><select id='{0}' size='2'>".format(selectId);
                                data = data.data;
                                for(var i in data){
                                    if(data[i][0] === parseInt(info[4]))
                                        trHtml += "<option value='{0}' selected>{1}</option>".format(data[i][0],data[i][1])
                                    else
                                        trHtml += "<option value='{0}' >{1}</option>".format(data[i][0],data[i][1])
                                }
                                trHtml += '</select></td></tr>';
                                $("#userTable tbody").append(trHtml);
                                $("#{0}".format(selectId)).multiselect({
                                    buttonWidth: '180px',
                                    enableFiltering: true,
                                    enableCaseInsensitiveFiltering: true,
                                    filterPlaceholder: 'Search'
                                });
                            }
                        }).fail(function (xhr, atatus) {
                            alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
                        })
                    }
                    
                }).fail(function (xhr, atatus) {
                    alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
                })
            },
            deleteUser: function () {
                var ckbs=$("#userTable input[name=ckb]:checked");
                if(ckbs.size()==0){
                    alert("Please select at least one row to delete!");
                    return;}
                ckbs.each(function(){
                    var $tr = $(this).parents("tr").children();
                    var userId = parseInt($tr.eq(1).html());
                    var _this = this;
                    $.ajax("/deleteUser/{0}".format(userId), {
                        dataType: 'json'
                    }).done(function (data) {
                        if(data.flag){
                            $(_this).parent().parent().parent().remove();
                        }
                    }).fail(function (xhr, atatus) {
                        alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
                    });
                });
            },
            showUsers:function () {
                $.ajax("/listUsers", {
                    dataType: 'json'
                }).done(function (data) {
                    if(data.flag){
                        var rolesList = data.roles;
                        var usersList = data.users;
                        var tbhtml = '<table class="am-table am-table-bd am-table-striped admin-content-table am-table-hover  am-table-centered">';
                        tbhtml += '<thead><tr><th></th><th>ID</th><th>Name</th><th>Email</th><th>Own Roles</th></tr></thead>';
                        tbhtml += '<tbody></tbody></table>';
                        $("#userTable").append(tbhtml);
                        for (var i = 0; i < usersList.length; ++i) {
                            var trhtml ='<tr onclick="setActive(this)" ondblclick="dblclickToShow()"><td width="5%"><label class="am-checkbox hx-rmmargin"><input name="ckb" type="checkbox"/> </label></td>';
                            trhtml +='<td>{0}</td>'.format(usersList[i][0]);
                            trhtml +='</td><td><a href="#">{0}</a></td>'.format(usersList[i][1]);
                            trhtml +='<td>{0}</td>'.format(usersList[i][2]);
                            var selectId = 'userTableNew{0}'.format(usersList[i][0]);
                            var selectedData = usersList[i][3];
                            trhtml += "<td><select id='{0}' size='2' >".format(selectId);
                            for(var j in rolesList){
                                if(rolesList[j][1] === selectedData)
                                    trhtml += "<option value='{0}' selected>{1}</option>".format(rolesList[j][0],rolesList[j][1])
                                else
                                    trhtml += "<option value='{0}' >{1}</option>".format(rolesList[j][0],rolesList[j][1])

                            }
                            trhtml += '</select></td></tr>';
                            $("#userTable tbody").append(trhtml);
                            $("#{0}".format(selectId)).multiselect({
                                buttonWidth: '180px',
                                enableFiltering: true,
                                enableCaseInsensitiveFiltering: true,
                                filterPlaceholder: 'Search',
                                onChange:function (element, checked) {
                                    var selectRoleName = $(element).text();
                                    var selectRoleId = $(element).val();
                                    var uid = $(this.$select).parent().parent().parent().children().eq(1).text();
                                    $.ajax("/changeUserRole/{0}/{1}".format(uid, selectRoleId), {
                                        dataType: 'json'
                                    }).done(function (data) {
                                        if(data.flag){
                                            alert("change successfully")
                                        }
                                    }).fail(function (xhr, atatus) {
                                        alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
                                    })
                                }    

                            })
                        }

                    }
                }).fail(function (xhr, atatus) {
                    alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
                })
            },
            showResources:function () {
                $.ajax("/getResources", {
                    dataType: 'json'
                }).done(function (data) {
                    if (data.flag) {
                        var html = '<select  id="newSelectResource" multiple="multiple">';
                        for (var i in data) {
                            html += '<option value="{1}" data-resource-id="{0}">{1}</option>'.format(data[i][0], data[i][1])
                        }
                        html += '</select>';
                        $("#RoleSectionResourceSelect").html(html);
                        $("#newSelectResource").multiselect({
                            checkAllText: "CheckAll",
                            uncheckAllText: "UnCheckAll",
                            selectedList: 2
                        });
                    }
                    else {
                        alert("Error: read resources failed!!!")
                    }
                }).fail(function (xhr, atatus) {
                    alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
                });
            }
        };
        return {
            showUsers:contextCustomFuncDict.showUsers,
            showRoles:contextCustomFuncDict.showRoles,
            showResources:contextCustomFuncDict.showResources,
            updateAddUserRow:contextCustomFuncDict.updateAddUserRow,
            addUser:contextCustomFuncDict.addUser,
            deleteUser:contextCustomFuncDict.deleteUser
        }
    })();
   
