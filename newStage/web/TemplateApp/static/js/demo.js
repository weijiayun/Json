$(document).ready(function(){
	
	context.init({preventDoubleContext: false});
	context.settings({contextMenu:"click"});
	context.attach('.inline-menu', [
		{header: 'Options'},
		{text: 'Open', href: '#'},
		{text: 'Open in new Window', href: '#'},
		{divider: true},
		{text: 'Copy', href: '#'},
		{text: 'Dafuq!?', href: '#'}
	]);
	
	context.attach('#download', [
		
		{header: 'Download'},
		{text: 'The Script', nodes: [
			{header: 'Requires jQuery'},
			{text: 'context.js', href: 'http://contextjs.com/context.js', target:'_blank', action: function(e){
				_gaq.push(['_trackEvent', 'ContextJS Download', this.pathname, this.innerHTML]);
			}}
		]},
		{text: 'The Styles', nodes: [
		
			{text: 'context.bootstrap.css', href: 'http://contextjs.com/context.bootstrap.css', target:'_blank', action: function(e){
				_gaq.push(['_trackEvent', 'ContextJS Bootstrap CSS Download', this.pathname, this.innerHTML]);
			}},
			
			{text: 'context.standalone.css', href: 'http://contextjs.com/context.standalone.css', target:'_blank', action: function(e){
				_gaq.push(['_trackEvent', 'ContextJS Standalone CSS Download', this.pathname, this.innerHTML]);
			}}
		]},
		{divider: true},
		{header: 'Meta'},
		{text: 'The Author', nodes: [
			{header: '@jakiestfu'},
			{text: 'Website', href: 'http://jakiestfu.com/', target: '_blank'},
			{text: 'Forrst', href: 'http://forrst.com/people/jakiestfu', target: '_blank'},
			{text: 'Twitter', href: 'http://twitter.com/jakiestfu', target: '_blank'},
			{text: 'Donate?', action: function(e){
				e.preventDefault();
				$('#donate').submit();
			}}
		]},
		{text: 'Hmm?', nodes: [
			{header: 'Well, thats lovely.'},
			{text: '2nd Level', nodes: [
				{header: 'You like?'},
				{text: '3rd Level!?', nodes: [
					{header: 'Of course you do'},
					{text: 'MENUCEPTION', nodes: [
						{header:'FUCK'},
						{text: 'MAKE IT STOP!', nodes: [
							{header: 'NEVAH!'},
							{text: 'Shieeet', nodes: [
								{header: 'WIN'},
								{text: 'Dont Click Me', href: 'http://omglilwayne.com/', target:'_blank', action: function(){
									_gaq.push(['_trackEvent', 'ContextJS Weezy Click', this.pathname, this.innerHTML]);
								}}
							]}
						]}
					]}
				]}
			]}
		]}
	]);

});