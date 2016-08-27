/**
 * Created by weijiayun on 8/27/16.
 */
(function ($) {
    'use strict';

    var DelayTooltip = function (element, options) {
    this.init('delayTooltip', element, options);
    this.initDelayTooltip();
    };

    if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');

    DelayTooltip.VERSION  = '0.1';

    DelayTooltip.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        trigger: 'hover',
        delay: {hide: 300}
    });

    DelayTooltip.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

    DelayTooltip.prototype.constructor = DelayTooltip;

    DelayTooltip.prototype.getDefaults = function () {
        return DelayTooltip.DEFAULTS;
    };

    DelayTooltip.prototype.delayTooltipEnter = function(){
        this.hoverState = 'in';
    };

    DelayTooltip.prototype.delayTooltipLeave = function(){
        this.hoverState = 'out';
        this.leave(this);
    };

    DelayTooltip.prototype.initDelayTooltip = function(){
      this.tip()
          .on('mouseenter.'  +  this.type, $.proxy(this.delayTooltipEnter, this))
          .on('mouseleave.' + this.type, $.proxy(this.delayTooltipLeave, this));
    };

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('bs.delayTooltip');
            var options = typeof option == 'object' && option;

            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data('bs.delayTooltip', (data = new DelayTooltip(this, options)));
            if (typeof option == 'string') data[option]();
        });
    }

    var old = $.fn.delayTooltip;

    $.fn.delayTooltip             = Plugin;
    $.fn.delayTooltip.Constructor = DelayTooltip;

    $.fn.delayTooltip.noConflict = function () {
        $.fn.delayTooltip = old;
        return this;
    };

})(jQuery);


(function(global, $){

    var page = function(){

    };

    page.prototype.bootstrap = function(){
        var html = 'Weclome to my blog <a target="_blank" href="greengerong.github.io">破狼博客</a>!<input type="text" placeholder="input some thing"/>';
        $('#tooltip').tooltip( {
            html: true,
            placement: 'top',
            title: html
        });

        $('#delayTooltip').delayTooltip( {
            html: true,
            placement: 'bottom',
            title: html
        });

  $('#delayTooltipInHtml').attr('title', html).delayTooltip();

        return this;
    };

    global.Page = page;

})(this, jQuery);

$(function(){
    'use strict';
  var page = new window.Page().bootstrap();
    //
});