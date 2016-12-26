var TabBlock = {
  s: {
    tabName: "TAB0"
  },
  
  init: function() {
    TabBlock.bindUIActions();
    TabBlock.hideInactive();
    TabBlock.addButton();
  },
  
  bindUIActions: function() {
    $('.tabBlock-tabs').on('click', '.tabBlock-tab', function(){
      TabBlock.switchTab($(this));
    });
  },
  hideInactive: function() {
    var $tabBlocks = $('.tabBlock');
    
    $tabBlocks.each(function(i) {
      var
        $tabBlock = $($tabBlocks[i]),
        $panes = $tabBlock.find('.tabBlock-pane'),
        $activeTab = $tabBlock.find('.tabBlock-tab.is-active');
      $panes.hide();
      $($panes[$activeTab.index()]).show();
    });
  },
  addButton:function () {
    var buttonhtml = '<li><button id="tabBlock-tab-plus" class="tabBlock-tab-plus"><span class="glyphicon glyphicon-plus"></span></button></li>';
    $(".tabBlock-tabs").append(buttonhtml);
    $(".tabBlock-tab-plus").on("click",function () {
      TabBlock.addTab();
    })

  },
  
  switchTab: function($tab) {
    var $context = $tab.closest('.tabBlock');
    
    if (!$tab.hasClass('is-active')) {
      $tab.siblings().removeClass('is-active');
      $tab.addClass('is-active');
      
      TabBlock.showPane($tab.index(), $context);
    }
    $("#jsonlog-right").BootSideClose();
   },
  addTab:function () {
    var Nostr = TabBlock.s.tabName.replace("TAB","");
    var NoInt = parseInt(Nostr)+1;
    TabBlock.s.tabName = "TAB"+NoInt;
    var tabhtml = "<li class='tabBlock-tab {0}' tabblock-id='{0}'><span class='tabBlock-tab-name'  contenteditable='true' spellcheck='false'>New collection".format(TabBlock.s.tabName)+
        "</span><button class='tabBlock-tab-remove' tabblock-tab-name='{0}' onclick='TabBlock.deleteTab(this)'><span class=' glyphicon glyphicon-remove'></span></button></li>".format(TabBlock.s.tabName);
    $(".tabBlock-tabs").children().eq(-1).before(tabhtml);
    TabBlock.switchTab($("li.tabBlock-tab.{0}".format(TabBlock.s.tabName)))
  },
  deleteTab:function (obj) {
    if($(obj).parent().prev())
      TabBlock.switchTab($(obj).parent().prev());
    else if($(obj).parent().next())
      TabBlock.switchTab($(obj).parent().next());
    $(obj).parent().remove();
    var tagName = $(obj).attr("tabblock-tab-name");
    $("div.tabBlock-pane.{0}".format(tagName)).remove()
  },
  showPane: function(i, $context) {
    var $panes = $context.find('.tabBlock-pane');
    $panes.hide();
    $($panes[i]).show();
  }
};

$(function() {
  TabBlock.init();
});