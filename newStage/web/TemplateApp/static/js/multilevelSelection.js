
var multilevelSelection = multilevelSelection || (function () {

	var options = {
		fadeSpeed: 300,
		filter: function ($obj) {
			// Modify $obj, Do not return
		},
		above: "auto",
		preventDoubleContext: true,
		compress: false,
		contextMenu:"contextmenu"
	};

	function initialize(opts) {

		options = $.extend({}, options, opts);

		$(document).on('click', 'html', function () {
			$('.dropdown-context').fadeOut(options.fadeSpeed, function(){
				$('.dropdown-context').css({display:''}).find('.drop-left').removeClass('drop-left');
			});
		});
		if(options.preventDoubleContext){//contextmenu
			$(document).on(options.contextMenu, '.dropdown-context', function (e) {
				e.preventDefault();
			});
		}

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
					$sub = $('<li class="dropdown-submenu"><a tabindex="-1" href="' + data[i].href + '">' + data[i].text + '</a></li>');
				}
				else {
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


		$(document).on(options.contextMenu, selector, function (e) {//contextmenu
			e.preventDefault();
			e.stopPropagation();

			$('.dropdown-context:not(.dropdown-context-sub)').hide();

			$dd = $('#dropdown-' + id);
			if (typeof options.above == 'string' && options.above == 'auto') {
				$dd.removeClass('dropdown-context-up');
				$dd.css({
					top: e.target.offsetTop+e.target.clientHeight+3,
					left: e.target.offsetLeft//+e.target.clientWidth/2
				}).fadeIn(options.fadeSpeed);
			}
		});
	}
	
		function destroyContext(selector) {
			$(document).off(options.contextMenu, selector).off('click', '.context-event');//contextmenu
		}
		
	
		return {
			init: initialize,
			settings: updateOptions,
			attach: addContext,
			destroy: destroyContext

		};
})();