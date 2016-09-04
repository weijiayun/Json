/**
 * Created by weijiayun on 9/4/16.
 */

$(document).ready(function(){

	context.init({preventDoubleContext: false});
	context.attach('#left-collection-tree', [
		{header: 'operating'},
		{text: 'Delete',action:function (e) {
        }},
		{text: 'Merge',action:function (e) {

        }},
		//{divider: true},
		{header: 'Authority'},
		{text: 'Grant to',subMenu:[
            {text:"user1",action: function(e){}},
            {text:"user2",action: function(e){}},
            {text:"user3",action: function(e){}}
        ]},
        {text: 'Ungrant from', subMenu:[
            {text:"user1",action: function(e){}},
            {text:"user2",action: function(e){}},
            {text:"user3",action: function(e){}}
        ]}
	]);
	
	context.settings({compress: true});

	$(document).on('mouseover', '.me-codesta', function(){
		$('.finale h1:first').css({opacity:0});
		$('.finale h1:last').css({opacity:1});
	});
	
	$(document).on('mouseout', '.me-codesta', function(){
		$('.finale h1:last').css({opacity:0});
		$('.finale h1:first').css({opacity:1});
	});
	
});