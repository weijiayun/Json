/**
 * Created by jiayun.wei on 8/29/16.
 */
$(function()
{
    var hideDelay = 2000;
    var hideTimer = null;
    var container = $("#popupContainer");
    $('.popupTrigger').bind('mouseover', function()
    {
        if (hideTimer)
            clearTimeout(hideTimer);

        var pos = $(this).offset();
        var width = $(this).width();
        container.css({
            position:"absolute",
            left: (pos.left + width) + 'px',
            top: pos.top + 5 + 'px'
        });
        var text = "weijiayun";
        $('#popupContent').html('&nbsp;');
        $('#popupContent').html(text);

        container.css('display', 'block');
    });

    $('.popupTrigger').bind('mouseout', function()
    {
        if (hideTimer)
            clearTimeout(hideTimer);
        hideTimer = setTimeout(function()
      {
          container.css('display', 'none');
      }, hideDelay);
  });

});