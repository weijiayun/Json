/**
 * Created by weijiayun on 9/4/16.
 */
$(document).ready(function() {
    $.ajax("/collection/collectionList", {
        dataType: 'json'
    }).done(function (data) {
        var treeData = {
            //icon: "glyphicon glyphicon-bookmark",
            //selectedIcon: "glyphicon glyphicon-bookmark",
            selectable: false
        };
        //treeData.text = "Collection";
        treeData.nodes = [];
        var temp = {
            //icon: "glyphicon glyphicon-bookmark",
            //selectedIcon: "glyphicon glyphicon-bookmark",
            selectable: true
        };
        for (var s in data) {
            temp.tags = [data[s].length];
            temp.text = s;
            temp.nodes = [];

            var temp2 = {
                    //icon: "glyphicon glyphicon-tasks",
                    selectable: true
                };
            temp2.nodes = [];
            for (var c in data[s]) {

                var tmpdata = data[s][c];
                temp2.type = "collection";
                temp2.isNewCollection = false;
                temp2.text = tmpdata[0];

                temp2.date = tmpdata[1];
                temp2.version = tmpdata[2];
                temp2.templateName = tmpdata[3];
                temp2.category = tmpdata[4];
                for (var obj in data[s][c]){
                    var temp3 = {
                        //icon: "glyphicon glyphicon-bookmark",
                        //selectedIcon: "glyphicon glyphicon-bookmark",
                        selectable: false,
                        text:tmpdata[obj],
                        type:"object"
                    };
                    temp2.nodes.push(JSON.parse(JSON.stringify(temp3)));
                }
                temp.nodes.push(JSON.parse(JSON.stringify(temp2)));
            }
            treeData.nodes.push(JSON.parse(JSON.stringify(temp)));
        }
        //treeData = [treeData];
        var $searchableTree = $("#left-collection-tree").treeview({
            data: treeData.nodes,
            multiSelect: false,
            // expandIcon: "glyphicon glyphicon-stop",
            //collapseIcon: "glyphicon glyphicon-unchecked",
            expandIcon: 'glyphicon glyphicon-chevron-right',
            collapseIcon: 'glyphicon glyphicon-chevron-down',
            // expandIcon: 'glyphicon glyphicon-expand',
            // collapseIcon: 'glyphicon glyphicon-collapse-down',
            color: "#555",
            backColor: "white",
            onhoverColor: "rgb(48, 180, 214)",
            borderColor: "rgb(48, 180, 214)",
            showBorder: false,
            showTags: true,
            highlightSelected: true,
            //selectedColor: "yellow",
            selectedBackColor: "#428bca"
        });
        function nodesSelected(currentNode, state) {
            if (currentNode.state.selected != state) {
                $("#left-collection-tree").treeview("toggleNodeSelected", [currentNode.nodeId, {silent: true}]);
            }
            var sons = currentNode.nodes;
            if (sons) {
                for (var i in sons) {
                    currentNode.state.selected = false;
                    if (sons[i].selectable)
                        nodesSelected(sons[i], state)
                }
            }
            else {
                return;
            }
        }

        $("#left-collection-tree").on("nodeSelected", function (event, data) {
            nodesSelected(data, data.state.selected)
        });
        var search = function (e) {
            var pattern = $('#input-search').val();
            var options = {
                ignoreCase: $('#chk-ignore-case').is(':checked'),
                exactMatch: $('#chk-exact-match').is(':checked'),
                revealResults: true
                //$('#chk-reveal-results').is(':checked')
            };
            var results = $searchableTree.treeview('search', [pattern, options]);

            var output = '<p>' + results.length + ' matches found</p>';
            $.each(results, function (index, result) {
                output += '<p>- ' + result.text + '</p>';
            });
            $('#search-output').html(output);
        };

        $('#input-search').on('keyup', search);

        $('#clear-search').on('click', function (e) {
            $searchableTree.treeview('clearSearch');
            $('#input-search').val('');
            $('#search-output').html('');
        });
        leftTreeContextMenu.updateContextMenu();
    }).fail(function (xhr, status) {
        alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
    });
});

