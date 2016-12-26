/* 
 * Context.js
 * Copyright Jacob Kelley
 * MIT License
 */

var context = context || (function () {
		var options = {
			fadeSpeed: 100,
			filter: function ($obj) {
				// Modify $obj, Do not return
			},
			above: 'auto',
			preventDoubleContext: true,
			compress: false,
			target:"null",
			contextMenu:"contextmenu"//right key of mouse as default
		};
		function initialize(opts) {

		options = $.extend({}, options, opts);

		$(document).on('click', 'html', function () {
			$('.dropdown-context').fadeOut(options.fadeSpeed, function(){
				$('.dropdown-context').css({display:''}).find('.drop-left').removeClass('drop-left');
			});
		});
		if(options.preventDoubleContext){
			$(document).on(options.contextMenu, '.dropdown-context', function (e) {
				e.preventDefault();
			});
		}
		$(document).on('click', '.collectionNameInput', function (e) {
			e.stopPropagation();
		});
		$(document).on('mouseenter', '.dropdown-submenu', function(){
			var $sub = $(this).find('.dropdown-context-sub:first'),
				subWidth = $sub.width(),
				subLeft = $sub.offset().left,
				collision = (subWidth+subLeft) > window.innerWidth;
			if(collision){
				$sub.addClass('drop-left');
			}
		});

	}

	function updateOptions(opts){
		options = $.extend({}, options, opts);
	}

	function buildMenu(data, id, nodes) {
		var subClass = (nodes) ? ' dropdown-context-sub' : '',
			compressed = options.compress ? ' compressed-context' : '',
			$menu = $('<ul class="dropdown-menu dropdown-context' + subClass + compressed+'" id="dropdown-' + id + '"></ul>');
        var i = 0, linkTarget = '';
        for(i; i<data.length; i++) {
        	if (typeof data[i].divider !== 'undefined') {
				$menu.append('<li class="divider"></li>');
			} else if (typeof data[i].header !== 'undefined') {
				$menu.append('<li class="nav-header">' + data[i].header + '</li>');
			} else {
				if (typeof data[i].href == 'undefined') {
					data[i].href = '#';
				}
				if (typeof data[i].target !== 'undefined') {
					linkTarget = ' target="'+data[i].target+'"';
				}

				if (typeof data[i].nodes !== 'undefined') {
					if(typeof data[i].type !== 'undefined'&&data[i].type === 'addToCollection'){
						$sub = $('<li class="dropdown-submenu"><a tabindex="-1" data-nodeid="' + data[i].nodeId + '">' + data[i].text + '</a></li>');
					}
					else
						$sub = $('<li class="dropdown-submenu"><a tabindex="-1" href="' + data[i].href + '">' + data[i].text + '</a></li>');
				}
				else {
					if(typeof data[i].type !== 'undefined'&&data[i].type === 'input'){
						$sub = $('<li class="collectionNameInput">'+data[i].text+'</li>');
					}
					else if(typeof data[i].type !== 'undefined'&&data[i].type === 'addToCollection'){
						$sub = $('<li><a tabindex="-1" data-nodeid="' + data[i].nodeId + '">' + data[i].text + '</a></li>');
					}
					else if(typeof data[i].type !== 'undefined'&&data[i].type === 'grantAuthoity'){
						$sub = $('<li><a tabindex="-1" data-userid="' + data[i].userId+ '">' + data[i].text + '</a></li>');
					}
					else
						$sub = $('<li><a tabindex="-1" href="' + data[i].href + '"'+linkTarget+'>' + data[i].text + '</a></li>');
				}

				if (typeof data[i].action !== 'undefined') {
					var actiond = new Date(),
						actionID = 'event-' + actiond.getTime() * Math.floor(Math.random()*100000),
						eventAction = data[i].action;
					$sub.find('a').attr('id', actionID);
					$('#' + actionID).addClass('context-event');
					$(document).on('click', '#' + actionID, eventAction);
				}
				$menu.append($sub);
				if (typeof data[i].nodes != 'undefined') {
					var nodesData = buildMenu(data[i].nodes, id, true);
					$menu.find('li:last').append(nodesData);
				}
			}
			if (typeof options.filter == 'function') {
				options.filter($menu.find('li:last'));
			}
		}
		return $menu;
	}

	function addContext(selector, data) {

		var d = new Date(),
			id = d.getTime(),
			$menu = buildMenu(data, id);

		$('body').append($menu);
		var $dd = $('#dropdown-' + id);
		if(options.contextMenu === "contextmenu") {
			$(document).on(options.contextMenu, selector, function (e) {
				options.target = e.target;
				e.preventDefault();
				e.stopPropagation();
				$('.dropdown-context:not(.dropdown-context-sub)').hide();
				if (typeof options.above == 'boolean' && options.above) {
					$dd.addClass('dropdown-context-up').css({
						top: e.pageY - 20 - $('#dropdown-' + id).height(),
						left: e.pageX - 13
					}).fadeIn(options.fadeSpeed);
				} else if (typeof options.above == 'string' && options.above == 'auto') {
					$dd.removeClass('dropdown-context-up');
					var autoH = $dd.height() + 12;
					if ((e.pageY + autoH) > $('html').height()) {
						$dd.addClass('dropdown-context-up').css({
							top: e.pageY - 20 - autoH,
							left: e.pageX - 13
						}).fadeIn(options.fadeSpeed);
					} else {
						$dd.css({
							top: e.pageY + 10,
							left: e.pageX - 13
						}).fadeIn(options.fadeSpeed);
					}
				}
			});
		}
		else if(options.contextMenu === "click"){
			$(document).on("click", selector, function (e) {
				e.preventDefault();
				e.stopPropagation();
				$('.dropdown-context:not(.dropdown-context-sub)').hide();
				var $activeTab = $("li.tabBlock-tab.is-active");
				var TabHeight = $activeTab.height();
				var TabWidth = $activeTab.width();
				var offset = $activeTab.offset();

				if (typeof options.above == 'string' && options.above == 'auto') {
					$dd.removeClass('dropdown-context-up');
					$dd.css({
						top: offset.top+TabHeight*3/2,
						left: offset.left+TabWidth/6
					}).fadeIn(options.fadeSpeed);
				}
			});
		}
	}
	function destroyContext(selector) {
		$(document).off(options.contextMenu, selector).off('click', '.context-event');
	}
	function menuTarget() {
		return options.target;
	}
	return {
		init: initialize,
		settings: updateOptions,
		attach: addContext,
		destroy: destroyContext,
		getMenuTarget:menuTarget
	};
})();