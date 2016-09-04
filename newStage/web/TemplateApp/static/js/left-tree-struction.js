/**
 * Created by weijiayun on 9/4/16.
 */
$(document).ready(function() {
    var refFeedback = $.ajax("/objectList", {
        dataType: 'json'
    }).done(function (data) {
        var treeData = {};
        treeData.text = "Collection";
        treeData.nodes = [];
        var temp = {};
        for (var s in data) {
            temp.text = s;
            temp.nodes = [];
            var temp2 = {tags: [Object.keys(data[s]).length]};
            for (var c in data[s]) {
                temp2.text = c;
                temp2.nodes = [];
                var temp3 = {};
                for (var i in data[s][c]) {
                    temp3.text = data[s][c][i];
                    temp2.nodes.push(JSON.parse(JSON.stringify(temp3)));
                }
                temp.nodes.push(JSON.parse(JSON.stringify(temp2)));
            }
            treeData.nodes.push(JSON.parse(JSON.stringify(temp)));
        }
        treeData = [treeData];

        var $searchableTree = $("#left-collection-tree").treeview({
            data: treeData,
            //multiSelect:true,
            expandIcon: 'glyphicon glyphicon-chevron-right',
            collapseIcon: 'glyphicon glyphicon-chevron-down',
            nodeIcon: 'glyphicon glyphicon-bookmark',
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

        var search = function (e) {
            var pattern = $('#input-search').val();
            var options = {
                ignoreCase: $('#chk-ignore-case').is(':checked'),
                exactMatch: $('#chk-exact-match').is(':checked'),
                revealResults: true,//$('#chk-reveal-results').is(':checked')
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
        $.pureClearButton.setDefault();
    }).fail(function (xhr, status) {
        alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
    });
});