/**
 * Created by weijiayun on 9/4/16.
 */
var insertCollectionAction ={
	click:function () {
		var input = $("#context-collection-input");
		var result = $("#context-collection-input").val();
		leftTreeContextMenu.addCollection(result);
		$('.dropdown-context').hide();
	},
	keydown:function (event) {
		if(event.keyCode == 13){
			var result = $("#context-collection-input").val();
			leftTreeContextMenu.addCollection(result);
			$('.dropdown-context').hide();
		}
	}
};
var leftTreeContextMenu = leftTreeContextMenu||(function(){
		var contextCustomFucDict = {
			tree:$("#left-collection-tree"),
			getObjects:function(){
				var inst = contextCustomFucDict.tree;
				var arr = inst.treeview("getSelected");
				var arr1 = [];
				function putObjToArr(nodes) {
					for(var i=0;i<nodes.length;i++){
						var node = nodes[i];
						if(node.type === "collection"){
							putObjToArr(node.nodes)
						}
						else if(node.type === "object"){
							var temp = [
								node.text,
								node.nodes[0].text,
								node.nodes[1].text,
								node.category,
								node.nodes[2].text,
								node.collection
							];
							arr1.push(temp.join("-"));
						}
						else
							return null;
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
			grantCollectionsToUser:function (userId) {
				
				var objectList = this.getObjects();
				 $.ajax("/grantCollections/{0}/{1}".format(userId,JSON.stringify(objectList)), {
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
			unGrantCollectionOfUser:function (userId) {
				var objectList = this.getObjects();
				 $.ajax("/unGrantCollections/{0}/{1}".format(userId,JSON.stringify(objectList)), {
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
			grantUserContextMenu:function (userDict) {
				var userSubMenu = [];
				for(var i in userDict){
					userSubMenu.push({
						text: userDict[i],
						userId: i,
						type:"grantAuthoity",
						action: function (e) {
							var ae = e.target;
							var userId = parseInt($(ae).attr("data-userid"));
							contextCustomFucDict.grantCollectionsToUser(userId)
						}
					})
				}
				return userSubMenu;
				
			},
			unGrantUserContextMenu:function (userDict) {
				var userSubMenu = [];
				for(var i in userDict){
					userSubMenu.push({
						text: userDict[i],
						userId: i,
						type:"grantAuthoity",
						action: function (e) {
							var ae = e.target;
							var userId = parseInt($(ae).attr("data-userid"));
							contextCustomFucDict.unGrantCollectionOfUser(userId)
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
				var isUnique = false,tabId;
				$("li.tabBlock-tab").each(function () {
					if($(this).find("span.tabBlock-tab-name").text() === node.text){
						isUnique =isUnique ||true;
						tabId = $(this).attr("tabblock-id")
					}
				});
				if(!isUnique) {
					var templVersion = node.templInfo.split("-")[0];
					var templName = node.templInfo.split("-")[1];
					var templCat = node.templInfo.split("-")[2];
					$.ajax("/gettemplate/{0}/{1}/{2}".format(templCat, templName, templVersion), {
						dataType: 'json'
					}).done(function (templateData) {
						var objectList = leftTreeContextMenu.getSelectObjects();
						$.ajax("/getObjects/{0}".format(JSON.stringify(objectList)), {
							dataType: 'json'
						}).done(function (datasets) {
							TabBlock.addTab();
							var $activeTab = $("li.tabBlock-tab.is-active");
							var tabName = $activeTab.attr("tabblock-id");
							$activeTab.addClass(templName);
							$activeTab.attr("tabblock-tmpl-name", templName);
							$activeTab.attr("tabblock-tmpl-category", templCat);
							$activeTab.attr("tabblock-tmpl-version", templVersion);
							$activeTab.find("span.tabBlock-tab-name").html(node.text);
							var hot = configureObjectContext.getMainHandsonInst(tabName);
							configureObjectContext.init({
								data: datasets,
								tabName: tabName,
								templateData: templateData,
								selectedTemplate: templName
							});
							configureObjectContext.create();
							configureObjectContext.setting({data: null});
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
					}).fail(function (xhr, status) {
						alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
					});
				}
				else {
					TabBlock.switchTab($("li.tabBlock-tab.{0}".format(tabId)))
					var objectList = leftTreeContextMenu.getSelectObjects();
					$.ajax("/getObjects/{0}".format(JSON.stringify(objectList)), {
						dataType: 'json'
					}).done(function (datasets) {
						var hot = configureObjectContext.getMainHandsonInst(tabId);
						hot.loadData(datasets)
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
			},
			updateContextMenu:function () {
				$.ajax("/userList",{
					dataType: 'json'
				}).done(function (userDict) {
					if(userDict){
						context.init({preventDoubleContext: false});
						context.settings({compress:true,contextMenu:"contextmenu"});
						context.attach('#left-collection-tree', [
							{header: 'operating'},
							{text: 'Insert collection below',nodes:[
								{
									text:"<p>Collection Name:</p><div><input onkeydown='insertCollectionAction.keydown(event)'  tabindex='1' id='context-collection-input' " +
									"placeholder='input collection name...'><button tabindex='2' " +
									"id='saveCollection' onclick='insertCollectionAction.click()' class='addCollectionButton'>save</button></div>",
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
							{text: 'Grant to',nodes:contextCustomFucDict.grantUserContextMenu(userDict)},
							{text: 'Ungrant from', nodes:contextCustomFucDict.unGrantUserContextMenu(userDict)}
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
			getSelectObjects:contextCustomFucDict.getObjects,
			showCollectionInTable:contextCustomFucDict.showCollectionInTable
		}
})();