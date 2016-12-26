/**
 * Created by weijiayun on 9/4/16.
 */
var insertCollectionAction ={
	click:function (event) {
		var result = event.target.previousSibling.value;
		leftTreeContextMenu.addCollection(result);
		$('.dropdown-context').hide();
	},
	keydown:function (event) {
		if(event.keyCode == 13){
			var result = event.target.value;
			leftTreeContextMenu.addCollection(result);
			$('.dropdown-context').hide();
		}
	}
};
var leftTreeContextMenu = leftTreeContextMenu||(function(){
		var contextCustomFucDict = {
			tree:$("#left-collection-tree"),
			getCollection:function(){
				var inst = contextCustomFucDict.tree;
				var arr = inst.treeview("getSelected");
				var arr1 = [];
				function putObjToArr(nodes) {
					for(var i=0;i<nodes.length;i++){
						var node = nodes[i];
						if (node.type === "collection"){
							if(node.isNewCollection){
							putObjToArr(node.nodes);
						}
						else{
								var temp = [
									node.text,
									node.date,
									node.version,
									node.templateName,
									node.category
								];
								arr1.push(temp.join("-"));
							}
						}
					}
				}
				putObjToArr(arr);
				return arr1;
			},
			deleteSelected:function () {
				var inst = contextCustomFucDict.tree;
				var selectedItemList = inst.treeview("getSelected");
				for(var ci=0;ci<selectedItemList.length;ci++){
					var node = selectedItemList[ci];
					if(node.hasOwnProperty("isNewCollection")&&node.isNewCollection){
						inst.treeview("removeNewCol", node);
					}
					else if(node.hasOwnProperty("isNewCollection")&&!node.isNewCollection&&inst.treeview("getNode",node.parentId).parentId === undefined){
						inst.treeview("removeOriginCol", node);
					}
					else if(node.hasOwnProperty("isNewCollection")&&!node.isNewCollection&&inst.treeview("getNode",node.parentId).parentId !== undefined){
						inst.treeview("removeNewCol", node);
					}
				}
				contextCustomFucDict.updateContextMenu();
			},
			addCollection:function (collectionName){
				var inst = contextCustomFucDict.tree;
				var colArr = inst.treeview("getSelected");
				var flag = true;
				for (var i=0;i<colArr.length;i++){
					flag = flag && colArr[i].type == "collection";
				}
				if(flag) {
					inst.treeview("addColNode",[colArr,collectionName]);
					contextCustomFucDict.updateContextMenu();

				}
			},
			grantCollectionsToRole:function (roleId) {
				var collectionList = this.getCollection();
				 $.ajax("/collection/grantCollections/{0}/{1}".format(roleId,JSON.stringify(collectionList)), {
					 dataType: 'json',
					 type:"post"
				 }).done(function (data) {
					 if(data.flag){
						 alert("grant to user successfully");
					 }
					 else
						 alert("Error: grantting to user is failed!!!")
				 }).fail(function (xhr, status) {
					 alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
				 });
			},
			unGrantCollectionOfRole:function (roleId) {
				var collectionList = this.getCollection();
				 $.ajax("/collection/unGrantCollections/{0}/{1}".format(roleId,JSON.stringify(collectionList)), {
					 dataType: 'json',
					 type:"post"
				 }).done(function (data) {
					 if(data.flag){
						 alert("ungrant to user successfully");
					 }
					 else
						 alert("Error: ungrantting to user is failed!!!")
				 }).fail(function (xhr, status) {
					 alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
				 });
			},
			grantRoleContextMenu:function (roleDict) {
				var userSubMenu = [];
				for(var i in roleDict){
					userSubMenu.push({
						text: roleDict[i],
						userId: i,
						type:"grantAuthoity",
						action: function (e) {
							var ae = e.target;
							var roleId = parseInt($(ae).attr("data-userid"));
							contextCustomFucDict.grantCollectionsToRole(roleId)
						}
					})
				}
				return userSubMenu;
				
			},
			unGrantRoleContextMenu:function (roleDict) {
				var userSubMenu = [];
				for(var i in roleDict){
					userSubMenu.push({
						text: roleDict[i],
						userId: i,
						type:"grantAuthoity",
						action: function (e) {
							var ae = e.target;
							var roleId = parseInt($(ae).attr("data-userid"));
							contextCustomFucDict.unGrantCollectionOfRole(roleId)
						}
					})
				}
				return userSubMenu;
			},

			getCollectionMenu:function () {
				var thisTree = $("#left-collection-tree").treeview("getTree"), cont = [];
				function getContextTree(nodes,container) {
					for(var i=0;i<nodes.length;i++){
						if(nodes[i].type === "object"){
							continue;
						}
						var node = [];
						container.push({
							text:nodes[i].text,
							nodes:node,
							nodeId:nodes[i].nodeId,
							action:function (event) {
								var target = event.target;
								var inst = contextCustomFucDict.tree;
								var colArr = inst.treeview("getSelected");
								var flag = true;
								for (var i=0;i<colArr.length;i++){
									flag = flag && colArr[i].type == "collection";
								}
								if(flag) {
									inst.treeview("addToNewCollection",[colArr,parseInt($(target).attr("data-nodeid"))]);
									contextCustomFucDict.updateContextMenu();
								}
							},
							type: "addToCollection"
						});
						if(nodes[i].nodes !== undefined){
							getContextTree(nodes[i].nodes,node);
							for(var j=0;j<container.length;j++){
								if(container[j].nodes!==undefined&& container[j].nodes.length == 0){
									delete container[j].nodes;
								}

							}
						}
					}

				}
				getContextTree(thisTree,cont);
				return cont;
			},
			showCollectionInTable:function (node) {
				if(!node.isNewCollection&&node.type === "collection") {
					var isUnique = false, tabId;
					$("li.tabBlock-tab").each(function () {
						if ($(this).find("span.tabBlock-tab-name").text() === node.text) {
							isUnique = isUnique || true;
							tabId = $(this).attr("tabblock-id")
						}
					});
					if (!isUnique) {
						var templVersion = node.version;
						var templName = node.templateName;
						var templCat = node.category;
						$.ajax("/collection/gettemplate/{0}/{1}/{2}".format(templCat, templName, templVersion), {
							dataType: 'json'
						}).done(function (templateData) {
							var collectionList = leftTreeContextMenu.getSelectCollection();
							$.ajax("/collection/getCollection/{0}".format(JSON.stringify(collectionList)), {
								dataType: 'json'
							}).done(function (datasets) {
								if (datasets.flag != undefined && datasets.flag === true) {
									alert("not find collection");
								}
								else {
									TabBlock.addTab();
									var $activeTab = $("li.tabBlock-tab.is-active");
									var tabName = $activeTab.attr("tabblock-id");
									$activeTab.addClass(templName);
									$activeTab.attr("tabblock-tmpl-name", templName);
									$activeTab.attr("tabblock-tmpl-category", templCat);
									$activeTab.attr("tabblock-tmpl-version", templVersion);
									$activeTab.find("span.tabBlock-tab-name").html(node.text);

									configureObjectContext.init({
										data: datasets,
										tabName: tabName,
										templateData: templateData,
										selectedTemplate: templName
									});
									configureObjectContext.create();
									configureObjectContext.setting({data: null});
									var hot = configureObjectContext.getMainHandsonInst(tabName);
									var td, th, tht, elemType, i, j;
									for (i = 0; i < datasets.length; i++) {
										for (j = 0; j < getPropertyCount(datasets[i]); j++) {
											td = $(hot.table).children().eq(2).children().eq(i).children().eq(j + 1).get(0);
											elemType = $(td).children().eq(0).attr("data-type");
											if (elemType === "MATRIX" || elemType === "LIST") {
												th = $(hot.table).children().eq(1).children().eq(0).children().eq(j + 1).get(0);
												tht = $(th).text();
												$(td).children().eq(0).val(JSON.stringify(datasets[i][tht]))
											}
											else if (elemType === "REFLIST") {
												th = $(hot.table).children().eq(1).children().eq(0).children().eq(j + 1).get(0);
												tht = $(th).text();
												$(td).children().eq(0).attr("data-select", JSON.stringify(datasets[i][tht]))
											}
										}
									}

								}

							}).fail(function (xhr, status) {
								alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
							});
						}).fail(function (xhr, status) {
							alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
						});
					}
					else {
						TabBlock.switchTab($("li.tabBlock-tab.{0}".format(tabId)));
						var collectionInfo = contextCustomFucDict.getCollection();
						$.ajax("/collection/getCollection/{0}".format(JSON.stringify(collectionInfo)), {
							dataType: 'json'
						}).done(function (datasets) {
							var hot = configureObjectContext.getMainHandsonInst(tabId);
							hot.loadData(datasets);
							var td, th, tht, elemType, i, j;
							for (i = 0; i < datasets.length; i++) {
								for (j = 0; j < getPropertyCount(datasets[i]); j++) {
									td = $(hot.table).children().eq(2).children().eq(i).children().eq(j + 1).get(0);
									elemType = $(td).children().eq(0).attr("data-type");
									if (elemType === "MATRIX" || elemType === "LIST") {
										th = $(hot.table).children().eq(1).children().eq(0).children().eq(j + 1).get(0);
										tht = $(th).text();
										$(td).children().eq(0).val(JSON.stringify(datasets[i][tht]))
									}
									else if (elemType === "REFLIST") {
										th = $(hot.table).children().eq(1).children().eq(0).children().eq(j + 1).get(0);
										tht = $(th).text();
										$(td).children().eq(0).attr("data-select", JSON.stringify(datasets[i][tht]))
									}
								}
							}
						}).fail(function (xhr, status) {
							alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
						});
					}
				}
			},
			updateContextMenu:function () {
				$.ajax("/listRoles",{
					dataType: 'json'
				}).done(function (data) {
					if(data.flag){
						var roleDict = {};
						for(var i in data.data){
							roleDict[data.data[i][0]] = data.data[i][1]
						}
						context.init({preventDoubleContext: false});
						context.settings({compress:true,contextMenu:"contextmenu"});
						context.attach('#left-collection-tree', [
							{header: 'operating'},
							{text: 'Insert collection below',nodes:[
								{
									text:"<p>Collection Name:</p><div><input onkeydown='insertCollectionAction.keydown(event)'  tabindex='1' id='context-collection-input' " +
									"placeholder='input collection name...'><button tabindex='2' " +
									"id='saveCollection' onclick='insertCollectionAction.click(event)' class='addCollectionButton'>save</button></div>",
									type:"input"
								}
							]},
							{text:"Append to",nodes:contextCustomFucDict.getCollectionMenu()},
							{text: 'Delete',action:function (e) {
								contextCustomFucDict.deleteSelected();
							}},
							{text:"Show collection",action:function () {
								var node = contextCustomFucDict.tree.treeview("getSelected")[0];
								contextCustomFucDict.showCollectionInTable(node)
							}},
							{divider: true},
							{header: 'Authority'},
							{text: 'Grant to',nodes:contextCustomFucDict.grantRoleContextMenu(roleDict)},
							{text: 'Ungrant from', nodes:contextCustomFucDict.unGrantRoleContextMenu(roleDict)}
						]);

					}
					else
						alert("Error: getting user list is failed!!!")
				}).fail(function (xhr, status) {
					alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
				});
			}
		};
		return {
			updateContextMenu:contextCustomFucDict.updateContextMenu,
			addCollection:contextCustomFucDict.addCollection,
			getSelectCollection:contextCustomFucDict.getCollection,
			showCollectionInTable:contextCustomFucDict.showCollectionInTable
		}
})();