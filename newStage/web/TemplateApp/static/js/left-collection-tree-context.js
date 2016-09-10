/**
 * Created by weijiayun on 9/4/16.
 */

var leftTreeContextMenu = leftTreeContextMenu ||(function(){
		var contextMenuFunctions = {
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
								alert($(target).attr("data-nodeid"))
							},
							type: "appendCollection"
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
				getContextTree(thisTree[0].nodes,cont);
				return cont;
			},
			UpdateContextMenu:function () {
				context.attach('#left-collection-tree', [
					{header: 'operating'},
					{text: 'Delete',action:function (e) {
					}},
					{
						text:"add collection",
						nodes:[
							{
								text: '<p>collection name: </p><div><input type="text"><button class="addCollectionButton">add</button></div>',
								type:"input"
							}
						]
					},
					{text:"append to",nodes:contextMenuFunctions.getCollectionMenu()},
					{divider: true},
					{header: 'Authority'},
					{text: 'Grant to',nodes:[
						{text:"user1",action: function(e){}},
						{text:"user2",action: function(e){}},
						{text:"user3",action: function(e){}}
					]},
					{text: 'Ungrant from', nodes:[
						{text:"user1",action: function(e){}},
						{text:"user2",action: function(e){}},
						{text:"user3",action: function(e){}}
					]},
					{divider: true},
					{header: 'Authority'},
					{
						text:"update menu",
						action:function () {
							contextMenuFunctions.getCollectionMenu()
						}
					}
				]);

			},
			initContextMenu:function () {
				context.init({preventDoubleContext: false});
				context.settings({compress: true});
				$('button.addCollectionButton').on('click',function () {
					alert("add collection !!!")
				})
			}

		};
		return {
			updateContextMenu:contextMenuFunctions.UpdateContextMenu,
			initializeContextMenu:contextMenuFunctions.initContextMenu

		}
})();