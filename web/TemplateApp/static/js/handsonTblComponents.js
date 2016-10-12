/**
 * Created by jiayun.wei on 7/28/16.
 */

var configureObjectContext = configureObjectContext||(function () {
        var app={};
        var options = {
            selector:"loadlog",
            tabName:"TAB1",
            templateData:null,
            selectedTemplate:null,
            category:null,
            data:null,
            modalselector:"jsonlog-right"
        };
        function getMainHandsonIns(tabName) {
            return app[tabName+options.selector]
        }
        function initialize(opts) {
            options = $.extend({}, options, opts);
            var container ='';  
            container += "<div class='tabBlock-pane {0} {1}' >".format(options.tabName);
            container += "<input id='{0}search_field' placeholder='Search' type='search'> <span id='{0}resultCount'>0</span> results".format(options.tabName);
            container += "<div class='handsontable htRowHeaders htColumnHeaders handsontable-container' " +
                "id='{0}' style='height: 400px;'></div>".format(options.tabName+options.selector);
            container += "</div></div>";
            $("div.tabBlock-content").append(container);
        }
        function settings(opts) {
            options = $.extend({}, options, opts);
        }
        function HtmlExcelAll() {
            var TemplatesUnitIdPrefix = options.tabName;
            var mainTableId = TemplatesUnitIdPrefix+options.selector;
            $("#{0}".format(mainTableId)).eq(0).attr("handsontable-container-id",mainTableId);
            var ColumsAttr = [];
            var container1;
            container1 = document.getElementById(mainTableId);
            var searchFiled = document.getElementById(TemplatesUnitIdPrefix+'search_field');
            var resultCount = document.getElementById(TemplatesUnitIdPrefix+'resultCount');
            ColumsAttr=getColumsAttrs();

            function expandMatrix(instance, td, row, col, prop, value, cellProperties) {
                var currentRowindex = $(".currentRow").eq(0).parent().index();
                if($(td).parent().index() != currentRowindex){
                    if($(td).children().length==0) {
                        $(td).html("<button>{0}</button>".format(prop));
                        $(td).find("button").on("click",function (event) {
                            MatButton(this,event)
                        });
                        $(td).children().eq(0).attr("data-dimensionRows", ColumsAttr[3][prop].DimensionY);
                        $(td).children().eq(0).attr("data-dimensionCols", ColumsAttr[3][prop].DimensionX);
                        $(td).children().eq(0).attr("data-type","MATRIX");
                        $(td).children().eq(0).attr("data-Rows", row);
                        $(td).children().eq(0).attr("data-Cols", col);
                        $(td).children().eq(0).attr("data-Prop", prop);
                        $(td).children().eq(0).addClass("popupTrigger");

                    }
                    var a3 = $(td).parent().parent().children().eq(currentRowindex).children().eq(col+1).children().eq(0).val();
                    $(td).children().eq(0).val(a3);
                }
            }
            function expandList(instance, td, row, col, prop, value, cellProperties) {
                var currentRowindex = $(".currentRow").eq(0).parent().index();
                if($(td).parent().index() != currentRowindex){
                    if($(td).children().length==0) {
                        $(td).html("<button>{0}</button>".format(prop));
                        $(td).find("button").on("click",function (event) {
                            ListButton(this,event);
                        })
                        $(td).children().eq(0).attr("data-colNamesList",JSON.stringify(Object.getOwnPropertyNames(ColumsAttr[2][prop])));
                        $(td).children().eq(0).attr("data-Rows", row);
                        $(td).children().eq(0).attr("data-Cols", col);
                        $(td).children().eq(0).attr("data-Prop", prop);
                        $(td).children().eq(0).attr("data-type","LIST");
                        $(td).children().eq(0).addClass("popupTrigger");
                    }
                        var a3 = $(td).parent().parent().children().eq(currentRowindex).children().eq(col+1).children().eq(0).val();
                        $(td).children().eq(0).val(a3);
                    }
            }
            function expandMultiRefList(instance,td,row,col,prop,value,cellProperties) {
                var currentRowindex = $(".currentRow").eq(0).parent().index();
                if($(td).parent().index() != currentRowindex){
                    if($(td).children().length==0) {
                        var refhtml = "<select id='{0}{1}{2}refSelect' class='selectResult' multiple='multiple' size='2'>".format(TemplatesUnitIdPrefix,row,col);
                        for( var e in ColumsAttr[2][prop]){
                            refhtml += "<option value='{0}'>{0}</option>".format(ColumsAttr[2][prop][e])
                        }
                        refhtml += "</select>";
                        $(td).html(refhtml);
                        $("#{0}{1}{2}refSelect".format(TemplatesUnitIdPrefix,row,col)).multiselect({
                            noneSelectedText:"---select---",
                            checkAllText: "all",
                            uncheckAllText: 'none',
                            selectedList:1
                        }).multiselectfilter({
                            label:"Search: ",
                            width:130,
                            height:25
                        }).on("multiselectclick",function (event, ui) {
                            var result = $(this).multiselect("getChecked").map(function () {
                                return this.value;
                            }).get();
                            $(this).attr("data-select",JSON.stringify(result));

                        }).bind("multiselectbeforeopen",function () {
                            $(this).multiselect("setChecked");
                        });
                        $(td).children().eq(0).attr("data-Rows", row);
                        $(td).children().eq(0).attr("data-Cols", col);
                        $(td).children().eq(0).attr("data-Prop", prop);
                        $(td).children().eq(0).attr("data-local-list",JSON.stringify(ColumsAttr[2][prop]));
                        $(td).children().eq(0).attr("data-type","REFLIST");
                        $(td).children().eq(0).addClass("popupTrigger");
                    }
                    if($(td).parent().parent().children().eq(currentRowindex).children().eq(col+1).children().eq(0).attr("data-select")) {
                        var temp = $(td).parent().parent().children().eq(currentRowindex).children().eq(col+1).children().eq(0).attr("data-select")
                        $(td).find("select").attr("data-select",temp)
                    }
                }
            }
            Handsontable.renderers.registerRenderer('expandMatrix', expandMatrix);
            Handsontable.renderers.registerRenderer('expandList', expandList);
            Handsontable.renderers.registerRenderer('expandMultiRefList',expandMultiRefList);
            app[mainTableId] = new Handsontable(container1, {
                data: options.data||[ColumsAttr[2]],
                colHeaders: ColumsAttr[0],
                columns:ColumsAttr[1],
                //manualColumnMove: true,
                manualRowMove: true,
                manualColumnResize: true,
                manualRowResize: true,
                rowHeaders:true,
                manualColumnFreeze:true,
                //fixedColumnsLeft: 2,
               // colHeights:100,
                currentRowClassName: 'currentRow',
                currentColClassName: 'currentCol',
                //minSpareRows: 1,
                //autoWrapRow: true,
                startRows:1,
                //stretchH: 'all',
                comments:true,
                cells:function (row, col, prop) {
                    var cellProperties = {};
                    if(!ColumsAttr[3][prop].Reference){
                        if (ColumsAttr[3][prop].Type === 'mat' || ColumsAttr[3][prop].Type === 'vec') {
                            cellProperties.renderer = "expandMatrix";
                        }
                        else if (ColumsAttr[3][prop].Type === "list") {
                            cellProperties.renderer = "expandList";
                        }

                    }
                    else{
                        if (ColumsAttr[3][prop].Type === "list") {
                            cellProperties.renderer = "expandMultiRefList";
                        }
                    }
                    return cellProperties;
                }
            });
          var searchResultCount = 0;

          var searchResultCounter = function (instance, row, col, value, result) {

              Handsontable.Search.DEFAULT_CALLBACK.apply(this, arguments);
              if (result) {
                  searchResultCount++;
              }
          };
            app[mainTableId].updateSettings({
                search:{
                    callback:searchResultCounter
                },
                contextMenu: {
                    callback: function (key, options) {
                        if (key === 'json') {
                            turnRowToJson();
                        }
                    },
                    items: {
                        row_above: {},
                        row_below: {},
                        hsep1:"---------",
                        undo:{},
                        redo:{},
                        hsep2:"---------",
                        clear_column:{},
                        remove_row:{
                            name:"remove this row!",
                            disabled:function () {
                                return (app[mainTableId].getSelected() && app[mainTableId].getSelected()[0] === 0)
                            }
                        },
                        commentsAddEdit:{},
                        commentsRemove:{},
                        hsep3:"---------",
                        json:{name:"Trun row to Json"},
                        hsep4:"---------",
                        alignment:{}
                    }

                }
            });

            Handsontable.Dom.addEvent(searchFiled, 'keyup', function (event) {
                searchResultCount = 0;
                app[mainTableId].search.query(this.value);
                resultCount.innerHTML = searchResultCount.toString();
                app[mainTableId].render();
            });
        }

        function MatButton(field,evt) {

            var container = $("#popupContainer");
            container.fadeIn();
            var pos =$(field).offset();
            var width =$(field).width();
            var hot,container0,data1;
            container.css({
                position:"absolute",
                left: (pos.left + width) + 'px',
                top: pos.top + 5 + 'px'
            });

            $('#popupContent').html("<div class='handsontable htRowHeaders htColumnHeaders'></div>");
            container0 = $('#popupContent').children().get(0);
            var rowlen = parseInt($(field).attr("data-dimensionRows"));
            var collen = parseInt($(field).attr("data-dimensionCols"));
            var rowindex = parseInt($(field).attr("data-Rows"));
            var colindex = parseInt($(field).attr("data-Cols"));
            var colHeader =$(field).attr("data-prop");
            if($(field).val())
                data1 = JSON.parse($(field).val());
            hot = new Handsontable(container0, {
                data:data1,
                startRows:rowlen,
                startCols:collen,
                maxRows:rowlen,
                rowHeaders:true,
                colHeaders: true,
                contextMenu: true,
                currentRowClassName: 'currentRow',
                currentColClassName: 'currentCol',
                autoWrapRow: true
            });


            evt.stopPropagation();
            $("#popupContainer").click(function (event) {
                event.stopPropagation();
            });

            $(document).click(function (event) {
                event.stopPropagation();
                $(field).val(JSON.stringify(hot.getData()));
                $("#popupContainer").fadeOut();
            });



        }


        function ListButton(field,evt) {
            var hideDelay = 2000;
            var hideTimer = null;
            var hot,container0,data1;
            var container = $("#popupContainer");
            container.fadeIn();
            var pos =$(field).offset();
            var width =$(field).width();
            container.css({
                position:"absolute",
                left: (pos.left + width) + 'px',
                top: pos.top + 5 + 'px'
            });
            $('#popupContent').html("<div class='handsontable htRowHeaders htColumnHeaders'></div>");
            container0 = $('#popupContent').children().get(0);
            var rowindex = parseInt($(field).attr("data-Rows"));
            var colindex = parseInt($(field).attr("data-Cols"));
            var colHeader = $(field).attr("data-prop");
            var colHeadsList = JSON.parse($(field).attr("data-colnameslist"))
            if( $(field).val())
                data1 = JSON.parse($(field).val());
            var columnsAttrsList = [];
            for(var i in colHeadsList){
                columnsAttrsList.push({data:colHeadsList[i],type:"numeric"})
            }
            hot = new Handsontable(container0, {
                data:data1,
                rowHeaders:true,
                colHeaders:colHeadsList,
                columns:columnsAttrsList,
                contextMenu: true,
                currentRowClassName: 'currentRow',
                currentColClassName: 'currentCol',
                startRows:1
            });

            evt.stopPropagation();
            $("#popupContainer").click(function (event) {
                event.stopPropagation();
            });

            $(document).click(function (event) {
                event.stopPropagation();
                var a1 = [];
                var tempDict;
                var a2 = hot.getData();
                for(var i in a2){
                    tempDict = {};
                    for(var j in a2[i] ){
                        tempDict[colHeadsList[j]]=a2[i][j];
                    }
                    a1.push(tempDict)
                }
                $(field).val(JSON.stringify(a1));
                $("#popupContainer").fadeOut();
            });

        }

        function getColumsAttrs() {
            var structname = options.selectedTemplate;
            var StrategyDict = options.templateData;
            var FieldsVarAttrs = {};
            var ColumsAttrList =[];
            var ColDataDict = {};
            var colAttrDict = {};
            var colHeaders = [];
            var FieldsVar = StrategyDict[structname].Fields;
            var ipValidatorRegexp = /^(?:\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|null)$/;
            for(var varName in FieldsVar){
                colAttrDict = {};
                FieldsVarAttrs = FieldsVar[varName];
                FieldsVarAttrs["Name"] = varName;
                if(!FieldsVarAttrs.Reference){
                    if(FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32") {
                        colAttrDict.data = FieldsVarAttrs.Name;
                        colAttrDict.type = "numeric";
                       // colAttrDict.allowInvalid = false;
                        ColumsAttrList.push(colAttrDict);
                        colHeaders.push(FieldsVarAttrs.Name);
                        ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
                    }
                    else if(FieldsVarAttrs.Type == "double"){
                        colAttrDict.data = FieldsVarAttrs.Name;
                        colAttrDict.type = "numeric";
                        //colAttrDict.allowInvalid = false;
                        colAttrDict.format = '0,0.0000';
                        ColumsAttrList.push(colAttrDict);
                        colHeaders.push(FieldsVarAttrs.Name);
                        ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
                    }
                    else if(FieldsVarAttrs.Type == "string") {
                        colAttrDict.data = FieldsVarAttrs.Name;
                        //colAttrDict.allowInvalid = false;
                        ColumsAttrList.push(colAttrDict);
                        colHeaders.push(FieldsVarAttrs.Name);
                        ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
                    }
                    else if(FieldsVarAttrs.Type == "enum"){
                        var enumList = Object.getOwnPropertyNames(StrategyDict[FieldsVarAttrs.EleType].Fields);
                        colAttrDict.data = FieldsVarAttrs.Name;
                        colAttrDict.type = "dropdown";
                        //colAttrDict.allowInvalid = false;
                        colAttrDict.source = enumList;
                        ColumsAttrList.push(colAttrDict);
                        colHeaders.push(FieldsVarAttrs.Name);
                        ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
                    }
                    else if(FieldsVarAttrs.Type.match("mat") ||FieldsVarAttrs.Type.match("vec")){
                        colAttrDict.data = FieldsVarAttrs.Name;
                        ColumsAttrList.push(colAttrDict);
                        colHeaders.push(FieldsVarAttrs.Name);
                        ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
                    }
                    else if(FieldsVarAttrs.Type == "bool"){
                        colAttrDict.data = FieldsVarAttrs.Name;
                        colAttrDict.type = "checkbox";
                        ColumsAttrList.push(colAttrDict);
                        colHeaders.push(FieldsVarAttrs.Name);
                        ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
                    }
                    else if(FieldsVarAttrs.Type == "list"){
                        colAttrDict.data = FieldsVarAttrs.Name;
                        ColumsAttrList.push(colAttrDict);
                        colHeaders.push(FieldsVarAttrs.Name);
                        ColDataDict[FieldsVarAttrs.Name] = StrategyDict[FieldsVarAttrs.EleType].Fields;
                    }
                    else if(FieldsVarAttrs.Type == 'date'){
                        colAttrDict.data = FieldsVarAttrs.Name;
                        colAttrDict.type = "date";
                        colAttrDict.dateFormat = "YYYY/MM/DD";
                        colAttrDict.correctFormat = true;
                        //colAttrDict.allowInvalid = false;
                        ColumsAttrList.push(colAttrDict);
                        colHeaders.push(FieldsVarAttrs.Name);
                        ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
                    }
                    else if(FieldsVarAttrs.Type == 'time'){
                        colAttrDict.data = FieldsVarAttrs.Name;
                        colAttrDict.type = "time";
                        colAttrDict.timeFormat = "hh:mm:ss:SSS a";
                        colAttrDict.correctFormat = true;
                        //colAttrDict.allowInvalid = false;
                        ColumsAttrList.push(colAttrDict);
                        colHeaders.push(FieldsVarAttrs.Name);
                        ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
                    }
                    else if(FieldsVarAttrs.Type == 'timespan'){
                        colAttrDict.data = FieldsVarAttrs.Name;
                        colAttrDict.type = "numeric";
                        colAttrDict.format = "00:00:00";//moment.duration(string,unit)
                        //colAttrDict.allowInvalid = false;
                        ColumsAttrList.push(colAttrDict);
                        colHeaders.push(FieldsVarAttrs.Name);
                        ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
                    }
                    else if(FieldsVarAttrs.Type == 'ip'){
                        colAttrDict.data = FieldsVarAttrs.Name;
                        colAttrDict.validator = ipValidatorRegexp;
                        //colAttrDict.allowInvalid = false;
                        ColumsAttrList.push(colAttrDict);
                        colHeaders.push(FieldsVarAttrs.Name);
                        ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
                    }
                }
                else {
                    if(FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32"){
                        colAttrDict.data = FieldsVarAttrs.Name;
                        var reference = FieldsVarAttrs.Reference;
                        var refFeedback = $.ajax("/reference/{0}".format(reference), {
                            dataType: 'json',
                            async:false
                        }).done(function (data) {
                            colAttrDict.type= "dropdown";
                            colAttrDict.source = data;
                            ColumsAttrList.push(colAttrDict);
                            colHeaders.push(FieldsVarAttrs.Name);
                            ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
                        }).fail(function (xhr,status) {
                            alert("Failed: {0}\n Reason: {1}\n".format(xhr.status,status));
                        });
                    }
                    else if(FieldsVarAttrs.Type == "list"){
                        colAttrDict.data = FieldsVarAttrs.Name;
                        reference = FieldsVarAttrs.Reference;
                        refFeedback = $.ajax("/reference/{0}".format(reference), {
                            dataType: 'json',
                            async:false
                        }).done(function (data) {
                            ColumsAttrList.push(colAttrDict);
                            colHeaders.push(FieldsVarAttrs.Name);
                            ColDataDict[FieldsVarAttrs.Name] = data;
                        }).fail(function (xhr,status) {
                            alert("Failed: {0}\n Reason: {1}\n".format(xhr.status,status));
                        });
                    }
                }
            }
            return [colHeaders,ColumsAttrList,ColDataDict,FieldsVar];
        }
        function getMainTableData(tabName) {
            var hot = app[tabName+options.selector];
            var tbl = hot.table;
            var tbody = $(tbl).children().eq(2).get(0);
            var rowlen = $(tbl).children().eq(2).children().size();
            var collen = $(tbl).children().eq(2).children().eq(0).children().size();//start of row is 1
            var i,j,td,theader,datalist = [],tempdict = {},listTest = /[\[\]\{\}]/i;
            for(i=0;i<rowlen;i++){
                tempdict = {};
                for(j=1;j<collen;j++){
                    theader = $(tbl).children().eq(1).children().eq(0).children().eq(j).children().eq(0).children().eq(0).html();
                    td = $(tbody).children().eq(i).children().eq(j).get(0);
                    if($(td).children().size() != 0){
                    if($(td).children().eq(0).get(0).tagName == "BUTTON"){
                        if($(td).children().eq(0).attr("data-type") === "MATRIX") {
                            if (listTest.test($(td).children().eq(0).val())) {
                                tempdict[theader] = JSON.parse($(td).children().eq(0).val()).map(function (s) {
                                    return s.map(function (se) {
                                        return JsonFormatConvt(se)
                                    })
                                });
                            }
                            else
                                tempdict[theader] = JsonFormatConvt($(td).children().eq(0).val())
                        }
                        else if($(td).children().eq(0).attr("data-type") === "LIST") {
                            if (listTest.test($(td).children().eq(0).val()))
                                tempdict[theader] = JSON.parse($(td).children().eq(0).val());
                            else
                                tempdict[theader] = JsonFormatConvt($(td).children().eq(0).val())
                        }
                    }
                    else if($(td).children().eq(0).get(0).tagName == "INPUT"){
                        tempdict[theader] = $(td).children().eq(0).get(0).checked;
                    }
                    else if($(td).children().eq(0).get(0).tagName == "DIV") {
                        tempdict[theader] = JsonFormatConvt($(td).html().split('<div')[0]);
                    }
                    else if($(td).children().eq(0).get(0).tagName == "SELECT"){
                        if($(td).children().eq(0).attr("data-select"))
                            tempdict[theader] = JSON.parse($(td).children().eq(0).attr("data-select"));
                        else
                            tempdict[theader] = $(td).children().eq(0).attr("data-select");
                    }
                }
                else
                    {
                        tempdict[theader] = JsonFormatConvt($(td).html());
                    }
                }
                datalist.push(tempdict);

            }
            return datalist;
        }
        function turnRowToJson() {
            var TemplateUnitIdPrefix = options.tabName;
            var structName = options.selectedTemplate;
            var i, j, tbl, tr, td, theader, tempdict = {}, listTest = /[\[\]\{\}]/i, collen;
            tr = $(".currentRow").parent().eq(1);
            tbl = $(".currentRow").parent().parent().parent().eq(1);
            collen = tr.children().size();
            var colIndexDict = {};
            for (j = 1; j < collen; j++) {

                theader = $(tbl).children().eq(1).children().eq(0).children().eq(j).children().eq(0).children().eq(0).html();
                colIndexDict[theader] = j-1;
                td = tr.children().eq(j).get(0);
                var a = $(td).children().size();
                if ($(td).children().size() != 0) {

                    if ($(td).children().eq(0).get(0).tagName == "BUTTON") {
                        if ($(td).children().eq(0).attr("data-type") === "MATRIX") {
                            if (listTest.test($(td).children().eq(0).val()))
                                tempdict[theader] = JSON.parse($(td).children().eq(0).val()).map(function (s) {
                                    return s.map(function (se) {
                                        return JsonFormatConvt(se)
                                    })
                                });
                            else
                                tempdict[theader] = JsonFormatConvt($(td).children().eq(0).val())
                        }
                        else if ($(td).children().eq(0).attr("data-type") === "LIST") {
                            if (listTest.test($(td).children().eq(0).val()))
                                tempdict[theader] = JSON.parse($(td).children().eq(0).val());
                            else
                                tempdict[theader] = JsonFormatConvt($(td).children().eq(0).val())
                        }
                    }
                    else if ($(td).children().eq(0).get(0).tagName == "INPUT") {
                        tempdict[theader] = $(td).children().eq(0).get(0).checked;
                    }
                    else if ($(td).children().eq(0).get(0).tagName == "DIV") {
                        tempdict[theader] = JsonFormatConvt($(td).html().split('<div')[0]);
                    }
                    else if ($(td).children().eq(0).get(0).tagName == "SELECT") {
                        if ($(td).children().eq(0).attr("data-select"))
                            tempdict[theader] = JSON.parse($(td).children().eq(0).attr("data-select"));
                        else
                            tempdict[theader] = $(td).children().eq(0).attr("data-select");
                    }
                }
                else {
                    tempdict[theader] = JsonFormatConvt($(td).html());
                }
            }
            var data = JSON.stringify(tempdict, null, 10);
            $("#showhot1data").html(data);
            var typehtml = "",StrategyDict = options.templateData,modalId =options.modalselector;
            var curtRowIndex = $(".currentRow").parent().eq(1).index();
            var htmlElementData = {};
            typehtml += "<div class='json-right-tree'><ul id=\"{0}{1}\" class='jsoneditor'></ul></div>".format(TemplateUnitIdPrefix, structName);
            if($("#{0}".format(modalId)).has("div.json-right-tree")){
                $("#{0}".format(modalId)).find("div.json-right-tree").remove();
                $("#{0}".format(modalId)).append(typehtml);
            }
            else {
                $("#{0}".format(modalId)).append(typehtml);
            }
            $("#{0}".format(TemplateUnitIdPrefix + structName)).eq(0).attr("index-currentRow", curtRowIndex);
            $("#{0}".format(TemplateUnitIdPrefix + structName)).eq(0).attr("handsontable-container-id", $(".currentRow").parents("div.handsontable-container").eq(0).attr("id"));
            var FieldsVar = StrategyDict[structName].Fields;
            var FieldsVarAttrs = {};
            for (var varName in FieldsVar) {
                FieldsVarAttrs = FieldsVar[varName];
                FieldsVarAttrs["Name"] = varName;
                if (!FieldsVarAttrs.Reference) {
                    if (FieldsVarAttrs.Type == "sint_32" ||
                        FieldsVarAttrs.Type == "uint_32" ||
                        FieldsVarAttrs.Type == "string" ||
                        FieldsVarAttrs.Type == "date" ||
                        FieldsVarAttrs.Type == "time" ||
                        FieldsVarAttrs.Type == "timespan"){
                        NumberandStringTemplate(structName, FieldsVarAttrs, TemplateUnitIdPrefix, tempdict,modalId, curtRowIndex, colIndexDict[FieldsVarAttrs.Name]);
                        htmlElementData["string-{0}-{1}-{2}-{3}-{4}".format(TemplateUnitIdPrefix,structName,
                            curtRowIndex,colIndexDict[FieldsVarAttrs.Name], FieldsVarAttrs.Name)]= $("#{0}{1}{2}".format(TemplateUnitIdPrefix,structName,FieldsVarAttrs.Name))
                    }
                    else if (FieldsVarAttrs.Type == "enum") {
                        var enumList = Object.getOwnPropertyNames(StrategyDict[FieldsVarAttrs.EleType].Fields);
                        enumTemplate(structName, enumList, FieldsVarAttrs, TemplateUnitIdPrefix, tempdict,modalId,curtRowIndex, colIndexDict[FieldsVarAttrs.Name]);
                        htmlElementData["enum-{0}-{1}-{2}-{3}-{4}".format(TemplateUnitIdPrefix,structName,
                            curtRowIndex,colIndexDict[FieldsVarAttrs.Name], FieldsVarAttrs.Name)]= $("#{0}{1}{2}enumULSelect".format(TemplateUnitIdPrefix,structName,FieldsVarAttrs.Name));
                    }
                    else if (FieldsVarAttrs.Type.match("mat") || FieldsVarAttrs.Type.match("vec")){
                        matrixTemplate(structName, FieldsVarAttrs, TemplateUnitIdPrefix, tempdict,modalId,curtRowIndex, colIndexDict[FieldsVarAttrs.Name]);
                        htmlElementData["mat-{0}-{1}-{2}-{3}-{4}".format(TemplateUnitIdPrefix,structName,
                            curtRowIndex,colIndexDict[FieldsVarAttrs.Name], FieldsVarAttrs.Name)]= $("#{0}{1}{2}matrix".format(TemplateUnitIdPrefix,structName,FieldsVarAttrs.Name));
                    }
                    else if (FieldsVarAttrs.Type == "bool"){
                        boolTemplate(structName, FieldsVarAttrs, TemplateUnitIdPrefix, tempdict,modalId,curtRowIndex, colIndexDict[FieldsVarAttrs.Name]);
                        htmlElementData["boolean-{0}-{1}-{2}-{3}-{4}".format(TemplateUnitIdPrefix,structName,
                            curtRowIndex,colIndexDict[FieldsVarAttrs.Name], FieldsVarAttrs.Name)]= $("#m{0}{1}{2}".format(TemplateUnitIdPrefix,structName,FieldsVarAttrs.Name));
                    }
                        
                    else if (FieldsVarAttrs.Type.match("list")){
                        listTamplate(structName, StrategyDict[FieldsVarAttrs.EleType].Fields, FieldsVarAttrs, false, structName, TemplateUnitIdPrefix, tempdict,modalId,curtRowIndex, colIndexDict[FieldsVarAttrs.Name]);
                        htmlElementData["list-{0}-{1}-{2}-{3}-{4}".format(TemplateUnitIdPrefix,structName,
                            curtRowIndex,colIndexDict[FieldsVarAttrs.Name], FieldsVarAttrs.Name)]= $("#{0}{1}{2}".format(TemplateUnitIdPrefix,structName,FieldsVarAttrs.Name));
                    }
                        
                }
                else {
                    if (FieldsVarAttrs.Type.match("list"))
                        listRefTemplate(structName, FieldsVarAttrs, TemplateUnitIdPrefix, tempdict,modalId);
                    else if (FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32") {
                        var reference = FieldsVarAttrs.Reference;
                        $.ajax("/reference/{0}".format(reference), {
                            dataType: 'json',
                            async:false
                        }).done(function (data) {
                            enumTemplate(structName,data,FieldsVarAttrs, TemplateUnitIdPrefix, tempdict,modalId,curtRowIndex, colIndexDict[FieldsVarAttrs.Name]);
                            htmlElementData["enum-{0}-{1}-{2}-{3}-{4}".format(TemplateUnitIdPrefix,structName,
                                curtRowIndex,colIndexDict[FieldsVarAttrs.Name], FieldsVarAttrs.Name)]= $("#{0}{1}{2}enumULSelect".format(TemplateUnitIdPrefix,structName,FieldsVarAttrs.Name));
                        }).fail(function (xhr,status) {
                            alert("Failed: {0}\n Reason: {1}\n".format(xhr.status,status));
                        });
                    }
                }

            }
            $("div.wtHolder").css("height","auto");
            var model = new ListModel({});
            var view = new ListView(model,htmlElementData);
            var controller = new ListController(model,view);
        }
        function getDataFromJsonTree() {
            var TemplatesUnitIdPrefix = options.tabName;
            var structName = options.selectedTemplate;
            var jsonDict = options.templateData;
            var ul = document.getElementById(TemplatesUnitIdPrefix+structName);
            var ullen = ul.childNodes.length;
            var Jsoncode = {};
            var currentRowIndex = $("#{0}".format(TemplatesUnitIdPrefix+structName)).eq(0).attr("index-currentRow");
            var currentContainerId = $("#{0}".format(TemplatesUnitIdPrefix+structName)).eq(0).attr("handsontable-container-id");
            var j,tr,td,table;

            var hot = app[currentContainerId];
            for (var i = 0; i < ullen; i++) {
                var ili = ul.childNodes[i];
                var varName = ili.childNodes[1].innerHTML;
                var varType = jsonDict[structName].Fields[varName].Type;
                var varEleType = jsonDict[structName].Fields[varName].EleType;
                var varReference = jsonDict[structName]["Fields"][varName]["Reference"];
                if (varReference == null) {
                    if (varType == "string" ||
                        varType == "double" ||
                        varType == "sint_32" ||
                        varType == "uint_32" ||
                        varType == "date" ||
                        varType == "time" ||
                        varType == "timespan") {
                        Jsoncode[varName] =JsonFormatConvt($(ili).find("td.jsoneditor-listinput").text());
                    }
                    else if (varType.match("list")) {
                        table = $("#{0}".format(TemplatesUnitIdPrefix+structName+varName)).find("table.htCore").eq(0);
                        var theader = table.children().eq(1);
                        var tbody = table.children().eq(2);
                        var headName="";
                        var bodyDict = {};
                        var bodyDataList = [];
                        var tdvalue = "";
                        var rowlen = tbody.eq(0).children().size();
                        var collen = tbody.eq(0).children().eq(0).children().size();
                        for(var ti=0;ti<rowlen;ti++ ){
                            bodyDict = {};
                            for (var tj=1;tj<collen;tj++){
                                headName = theader.eq(0).children().eq(0).children().eq(tj).find("span.colHeader").eq(0).html();
                                tdvalue = tbody.eq(0).children().eq(ti).children().eq(tj).eq(0).html();
                                bodyDict[headName] = tdvalue;
                            }
                            bodyDataList.push(bodyDict);
                        }
                        Jsoncode[varName] = bodyDataList;
                    }
                    else if (varType == "bool") {
                        Jsoncode[varName] = JsonFormatConvt($(ili).find("span.boolResult").text());

                    }
                    else if (varType.match("mat") || varType.match("vec")) {
                        table = $("#{0}matrix".format(TemplatesUnitIdPrefix+structName+varName)).find("table.htCore").eq(0);
                        tbody = table.children().eq(2);
                        var tmplist = [];
                        bodyDataList = [];
                        tdvalue = "";
                        rowlen = tbody.eq(0).children().size();
                        collen = tbody.eq(0).children().eq(0).children().size();
                        for( ti=0;ti<rowlen;ti++ ){
                            tmplist = [];
                            for ( tj=1;tj<collen;tj++){
                                tmplist.push( tbody.eq(0).children().eq(ti).children().eq(tj).eq(0).html());
                            }
                            bodyDataList.push(tmplist);
                        }
                        Jsoncode[varName] = bodyDataList;
                    }
                    else if (varType.match("enum")) {
                        Jsoncode[varName] = JsonFormatConvt(document.getElementById(TemplatesUnitIdPrefix+structName + varName + "enumSelect").value);
                    }
                }
                else {
                    if(varType == "list"){
                        for(j=1;j<collen;j++){
                            table = $("#{0}".format(currentContainerId)).find("table.htCore").eq(0);
                            tr = table.find("tbody").children().eq(currentRowIndex);
                            collen = tr.children().size();
                            theader = table.eq(0).children().eq(1).children().eq(0).children().eq(j).find("span.colHeader").eq(0).html();
                            if(varName == theader){
                                j=j-1;
                                var tempselect = $("#{0}refSelect".format(TemplatesUnitIdPrefix+currentRowIndex+j)).attr("data-select")
                                if(tempselect) {
                                    Jsoncode[varName] = JSON.parse(tempselect);
                                }
                                else
                                    Jsoncode[varName] = null;
                                break;
                            }
                        }
                    }
                    else if(varType == "uint_32" || varType == "sint_32"){
                        Jsoncode[varName] = JsonFormatConvt(document.getElementById(TemplatesUnitIdPrefix+structName + varName + "enumSelect").value);
                    }
                }
            }
            table = $("#{0}".format(currentContainerId)).find("table.htCore").eq(0);
            tr = table.find("tbody").children().eq(currentRowIndex);
            collen = tr.children().size();
            for(j=1;j<collen;j++){
                theader = table.eq(0).children().eq(1).children().eq(0).children().eq(j).find("span.colHeader").eq(0).html();
                td = tr.children().eq(j).get(0);
                if($(td).children().size() != 0){
                    if($(td).children().eq(0).get(0).tagName == "BUTTON")
                        $(td).children().eq(0).val(JSON.stringify(Jsoncode[theader]));
                    else if($(td).children().eq(0).get(0).tagName == "INPUT")
                        hot.setDataAtCell(currentRowIndex,j-1,Jsoncode[theader]);
                    else if($(td).children().eq(0).get(0).tagName == "DIV")
                        hot.setDataAtCell(currentRowIndex,j-1,Jsoncode[theader]);
                }
                else
                {
                    hot.setDataAtCell(currentRowIndex,j-1,Jsoncode[theader]);
                }
            }
            $("#showjsondata").html(JSON.stringify(Jsoncode));
        }

        function boolTemplate(structname,VarAttrs,TemplateUnitIdPrefix,valueDict,modalId,rowIndex,colIndex) {
            var Ischecked = valueDict[VarAttrs.Name]?"checked":"";
            var boolhtml = "";
            boolhtml += "<li class='jsoneditor' id=\"{0}{1}{2}bool\" style=\"display: block\">".format(TemplateUnitIdPrefix,structname,VarAttrs.Name);
            if(VarAttrs.Requiredness == "bool")
                boolhtml += '<label><span class="glyphicon glyphicon-check"></span><span class="glyphicon glyphicon-asterisk asterisk"></span></label>';
            else
                boolhtml += '<label><span></span></label>';
            boolhtml += '<span style="display: none">{0}</span>'.format(VarAttrs.Name);
            boolhtml += '<span><span class=" jsoneditor-readonly jsoneditor-value">{0}</span></span>'.format(VarAttrs.Name);
            boolhtml += '<input type="checkbox" box-info="boolean-{0}-{1}-{4}-{5}-{2}" id="m{0}{1}{2}" {3}/>'.format(TemplateUnitIdPrefix,structname,VarAttrs.Name,Ischecked,rowIndex,colIndex);
            boolhtml += '<span>  </span>';
            boolhtml +='<span style="color: deepskyblue" id="{0}{1}{2}boolval" class="boolResult">{3}</span></li>'.format(TemplateUnitIdPrefix,structname,VarAttrs.Name,valueDict[VarAttrs.Name]);
            $("#{0}".format(modalId)).find("ul.jsoneditor").append(boolhtml);
            $("#m{0}".format(TemplateUnitIdPrefix+structname+VarAttrs.Name)).on("click",function () {
                if(this.checked){
                    $(this).parent().find(".boolResult").html('true');
                }
                else {
                    $(this).parent().find(".boolResult").html('false');
                }
            });
        }
        
        function enumTemplate(structname,enumlist,VarAttrs,TemplatesUnitIdPrefix,valueDict,modalId, rowIndex, colIndex) {
            var enumhtml = "";
            enumhtml = '<li class="jsoneditor" id="{0}">'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name);
            if(VarAttrs.Requiredness )
                enumhtml += '<label><span><span class="glyphicon glyphicon-list-alt"></span><span class="glyphicon glyphicon-asterisk asterisk"></span></span></label>';
            else
                enumhtml += '<label><span class="glyphicon glyphicon-list-alt"></span></label>';
            enumhtml += '<span style="display: none">{0}</span>'.format(VarAttrs.Name);
            enumhtml +='<span class="jsoneditor-readonly jsoneditor-value" >{0}</span>'.format(VarAttrs.Name);
            enumhtml +="<span class='dropdown'>";
            enumhtml +="<button type='button' class='btn dropdown-toggle btn-large btn-primary' style='background-color: lightslategray;height: 28px' id='{0}enumSelect' data-toggle='dropdown' value='{1}'>".format(TemplatesUnitIdPrefix+structname+VarAttrs.Name,valueDict[VarAttrs.Name]);
            valueDict[VarAttrs.Name] = valueDict[VarAttrs.Name]?valueDict[VarAttrs.Name]:"select";
            enumhtml +="<span id=\"{0}{1}{2}buttonValue\">{3}</span><span class='caret'></span></button>".format(TemplatesUnitIdPrefix,structname,VarAttrs.Name,valueDict[VarAttrs.Name]);
            enumhtml +="<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\" id=\"{0}{1}{4}enumULSelect\" box-info='enum-{0}-{1}-{2}-{3}-{4}'>".format(TemplatesUnitIdPrefix,structname,rowIndex, colIndex,VarAttrs.Name);
            for(var i in enumlist){
                enumhtml += "<li role=\"presentation\">";
                enumhtml += '<a role="menuitem" tabindex="-1" onmouseover="shadowover(this)" onmouseout="shadowout(this)"  name="{0}">{0}</a>'.format(enumlist[i]);
                enumhtml += "</li>"
            }
            enumhtml += "</ul></span></li>";
            $("#{0}".format(modalId)).find("ul.jsoneditor").append(enumhtml);
        }

        function NumberandStringTemplate(structname,VarAttrs,TemplatesUnitIdPrefix,valueDict,modalId, rowIndex, colIndex) {
            var NumStrhtml = "",temp,temp1;
            NumStrhtml += '<li class="jsoneditor" style="display: block" >';
            if(VarAttrs.Requiredness ){
                temp1 ='<span class="glyphicon glyphicon-asterisk asterisk"></span>';
                if(VarAttrs.Type === "date")
                    temp ='<label>{0}<span class="glyphicon glyphicon-calendar"></span></label>'.format(temp1);
                else if(VarAttrs.Type === "time")
                    temp ='<label>{0}<span class="glyphicon glyphicon-time"></span></label>'.format(temp1);
                else if(VarAttrs.Type === "timespan")
                    temp ='<label>{0}<span class="glyphicon glyphicon-dashboard"></span></label>'.format(temp1);
                else
                    temp ='<label>{0}</label>'.format(temp1);
            }
            else{
                if(VarAttrs.Type === "date")
                    temp ='<label><span class="glyphicon glyphicon-calendar"></span></label>';
                else if(VarAttrs.Type === "time")
                    temp ='<label><span class="glyphicon glyphicon-time"></span></label>';
                else if(VarAttrs.Type === "timespan")
                    temp ='<label><span class="glyphicon glyphicon-dashboard"></span></label>';
                else
                    temp ='<label></label>';
            }
            NumStrhtml += '<span></span>';
            NumStrhtml += '<span style="display: none">{0}</span>'.format(VarAttrs.Name);
            NumStrhtml += '<table><tr>';
            NumStrhtml += '<td>';
            NumStrhtml += '</td>';
            NumStrhtml +="<td class=\"jsoneditor-readonly jsoneditor-value\" id=\"m{0}{1}{2}\">{3}{2}</td>".format(TemplatesUnitIdPrefix,structname,VarAttrs.Name,temp);
            NumStrhtml += "<td style='width: 8px'>:</td>";
            VarAttrs.Default = valueDict[VarAttrs.Name];
            if(VarAttrs.Default == null)
                VarAttrs.Default = "";
            NumStrhtml +='<td contenteditable="true" spellcheck="false" class="jsoneditor-number jsoneditor-value jsoneditor-listinput" onblur="inputTypeChecktips(this)" ' +
                'data-type="{4}" id="{0}{1}{2}" box-info="string-{0}-{1}-{5}-{6}-{2}">{3}</td>'.format(TemplatesUnitIdPrefix,
                    structname,VarAttrs.Name,VarAttrs.Default,VarAttrs.Type,rowIndex,colIndex);
            NumStrhtml += '</tr></table></li>';
            var bbb = $("#{0}".format(modalId)).find("ul.jsoneditor").append(NumStrhtml)
        }

        function listTamplate(structname,listTypeFieldsDict,VarAttrs,IsReference,preStructName,TemplatesUnitIdPrefix,valueDict,modalId,rowIndex,colIndex) {
            var struct = "";
            var name = "";
            var listIdBase = "";
            if(IsReference){
                struct = preStructName;
                name = structname;
                preStructName = VarAttrs.Name;
                listIdBase = TemplatesUnitIdPrefix+struct+preStructName+name;
            }
            else {
                struct = structname;
                name = VarAttrs.Name;
                listIdBase = TemplatesUnitIdPrefix+struct+name;
            }
            var listhtml = "<li class='jsoneditor' id='{0}ListHeader'>".format(listIdBase);
            if(VarAttrs.Requiredness)
                listhtml += '<label><span class="glyphicon glyphicon-list" style="height: 30px"></span><span class="glyphicon glyphicon-asterisk asterisk"></span></label>';
            else
                listhtml += '<label><span class="glyphicon glyphicon-list" style="height: 30px"></span></label>';
            listhtml += '<span style="display: none">{0}</span>'.format(name);
            listhtml += '<span><span data-toggle="collapse" data-target="#{0}" class=" jsoneditor-readonly jsoneditor-value " >{1}</span></span>'.format(listIdBase,name);
            listhtml += '<span style="z-index: -1"><div  id="{0}" box-info="list-{1}-{2}-{3}-{4}-{5}" style="margin-left: 30px" class="handsontable htRowHeaders htColumnHeaders collapse in" ></div></span></li>'.format(listIdBase,TemplatesUnitIdPrefix,structname,rowIndex,colIndex,name);
            $("#{0}".format(modalId)).find("ul.jsoneditor").append(listhtml);
            var $container = $('#{0}'.format(listIdBase));
            var colHeadsList = Object.getOwnPropertyNames(listTypeFieldsDict);
            var columnsAttrsList = [];
            for(var i in colHeadsList){
                columnsAttrsList.push({data:colHeadsList[i],type:"numeric"})
            }
            $container.handsontable({
                data:valueDict[VarAttrs.Name],
                rowHeaders:true,
                colHeaders:colHeadsList,
                columns:columnsAttrsList,
                contextMenu: true,
                currentRowClassName: 'currentRow',
                currentColClassName: 'currentCol',
                //minSpareRows: 1,
                startRows:1
                //autoWrapRow: true
                });
        }
        function listRefTemplate(structname,VarAttrs,TemplatesUnitIdPrefix,valueDict,modalId) {
            var row,col,table,tr,collen,AllSelectItemsList,headName,currentContainerId;
            var listrefhtml ="<li class='jsoneditor'>";
            if(VarAttrs.Requiredness)
                listrefhtml += '<label><span class="glyphicon glyphicon-magnetk"></span><span class="glyphicon glyphicon-asterisk asterisk"></span></label>';
            else
                listrefhtml += '<label><span class="glyphicon glyphicon-magnet"></span></label>';
            listrefhtml += '<span style="display: none">{0}</span>'.format(VarAttrs.Name);
            row = $("#{0}{1}".format(TemplatesUnitIdPrefix,structname)).eq(0).attr("index-currentRow");
            currentContainerId = $("#{0}{1}".format(TemplatesUnitIdPrefix,structname)).eq(0).attr("handsontable-container-id");
            table = $("#{0}".format(currentContainerId)).find("table.htCore").eq(0);
            var theader = table.children().eq(1);
            tr = table.find("thead").children().eq(0).children().each(function (index) {
                headName = theader.eq(0).children().eq(0).children().eq(index).find("span.colHeader").eq(0).html();
                if(headName == VarAttrs.Name)
                    col = index
            });
            col = col-1;
            listrefhtml +='<span class="jsoneditor-readonly jsoneditor-value"  id="m{2}{0}{1}">{1}: '.format(structname,VarAttrs.Name,TemplatesUnitIdPrefix);
            listrefhtml += "<select id='{0}{1}{2}JsonrefSelect' class='selectResult' multiple='multiple' size='2'>".format(TemplatesUnitIdPrefix,row,col);
            AllSelectItemsList = JSON.parse($("#{0}".format(TemplatesUnitIdPrefix+row+col+"refSelect")).eq(0).attr("data-local-list"));
            for( var e in AllSelectItemsList){
                listrefhtml += "<option value='{0}'>{0}</option>".format(AllSelectItemsList[e])
            }
            listrefhtml += "</select></span>";
            listrefhtml += "<div class='jsoneditor-ref-tags'><input type='text' data-role='tagsinput' style='display: none' class='collection-elements-tagsinput'/></div></li>".format(TemplatesUnitIdPrefix+row+col);
            $("#{0}".format(modalId)).find("ul.jsoneditor").append(listrefhtml);

            $("#{0}{1}{2}JsonrefSelect".format(TemplatesUnitIdPrefix,row,col)).multiselect({
                // noneSelectedText:"---select---",
                // checkAllText: "all",
                // uncheckAllText: 'none',
                // selectedList:1
            }).multiselectfilter({
                        label:"Search: ",
                        width:130,
                        height:25
            }).on("multiselectclick",function (event,ui) {
                var result = $(this).multiselect("getChecked").map(function () {
                    return this.value;
                }).get();
                var elt1 =$(this).parent().parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                result.unshift(0);
                if(result.length > 1){
                    for(var i in result){
                        elt1.tagsinput('add',result[i]);
                    }
                }
                elt1.tagsinput("refresh");
                var that = this;//select
                $(this).parent().parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");

                $(this).multiselect("setChecked");
                elt1.on("itemRemoved",function () {
                    $(that).multiselect("setChecked");
                });
            }).bind("multiselectoptgrouptoggle",function (event,ui) {
                var result = $(this).multiselect("getChecked").map(function () {
                    return this.value;
                }).get();
                var elt1 = $(this).parent().parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                result.unshift(0);
                if (result.length > 1) {
                    for (var i in result) {
                        elt1.tagsinput('add', result[i]);
                    }
                }
                elt1.tagsinput("refresh");
                $(this).parent().parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                var that = this;//select
                $(this).multiselect("setChecked");
                elt1.on("itemRemoved", function () {
                    $(that).multiselect("setChecked");
                });
            }
            ).bind("multiselectuncheckall",function () {
                var elt1 = $(this).parent().parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                $(this).parent().parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                $(this).multiselect("setChecked");

            }).bind("multiselectcheckall",function () {
                var result = $(this).multiselect("getChecked").map(function () {
                    return this.value;
                }).get();
                var elt1 = $(this).parent().parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                result.unshift(0);
                if (result.length > 1) {
                    for (var i in result) {
                        elt1.tagsinput('add', result[i]);
                    }
                }
                elt1.tagsinput("refresh");
                $(this).parent().parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                var that = this;//select
                $(this).multiselect("setChecked");
                elt1.on("itemRemoved", function () {
                    $(that).multiselect("setChecked");
                });

            }).bind("multiselectbeforeopen",function () {
                var initDataSelectList = $("#{0}refSelect".format(TemplatesUnitIdPrefix+row+col)).attr("data-select");
                if(initDataSelectList){
                    var elt = $(this).parent().parent().find("input.collection-elements-tagsinput");
                    initDataSelectList = JSON.parse(initDataSelectList);
                    initDataSelectList.unshift(0);
                    for(var i in initDataSelectList){
                        elt.tagsinput('add',initDataSelectList[i]);
                    }
                    $(this).parent().parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                    $(this).parent().parent().find("div.bootstrap-tagsinput").find("input").css("width","1px");
                    $(this).multiselect("setChecked");

                }
            });
        }

        function matrixTemplate(structname,VarAttrs,TemplatesUnitIdPrefix,valueDict,modalId, rowIndex, colIndex) {
            var mathtml = "",hot,container,data1;
            mathtml +="<li class='jsoneditor'>";
            if(VarAttrs.Requiredness)
                mathtml += '<label><span class="glyphicon glyphicon-th" style="height: 30px"></span><span class="glyphicon glyphicon-asterisk asterisk"></span></label>';
            else
                mathtml += '<label><span class="glyphicon glyphicon-th" style="height: 30px"></span></label>';
            mathtml += '<span style="display: none">{0}</span>'.format(VarAttrs.Name);
            mathtml += '<span><span data-toggle="collapse" data-target="#{0}matrix" class=" jsoneditor-readonly jsoneditor-value ">{1}[{2}x{3}]</span></span>'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name,VarAttrs.Name,VarAttrs.DimensionY,VarAttrs.DimensionX);
            mathtml += '<span><div id="{0}{1}{2}matrix" box-info="mat-{0}-{1}-{3}-{4}-{2}" style="margin-left: 30px" class="handsontable htRowHeaders htColumnHeaders collapse in"></span></div></li>'.format(TemplatesUnitIdPrefix,structname,VarAttrs.Name,rowIndex,colIndex);
            $("#{0}".format(modalId)).find("ul.jsoneditor").append(mathtml);
            var $container = $('#{0}matrix'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name));
            var rowlen = parseInt(VarAttrs.DimensionY);
            var collen = parseInt(VarAttrs.DimensionX);
            $container.handsontable({
                data:valueDict[VarAttrs.Name],
                startRows:rowlen,
                startCols:collen,
                maxRows:rowlen,
                rowHeaders:true,
                colHeaders: true,
                //columns:a,
                contextMenu: true,
                // currentRowClassName: 'currentRow',
                // currentColClassName: 'currentCol',
                autoWrapRow: true
                });
        }

        function checkCollectionName(name) {
            return name
        }
        function saveCollection(field) {
            if($(field).parent().find(".Object-multiselect").find(".bootstrap-tagsinput").children().size()>1){
                var elt1 = $(field).parent().find(".Object-multiselect").find("input.collection-elements-tagsinput");
                var result = elt1.tagsinput("items");
                var elt2 = $(field).parent().find(".collectionTags");
                var collectionName = elt2.tagsinput("items");
                $.ajax("/saveCollection/{0}".format(JSON.stringify([collectionName[0],result])),{
                    dataType:"text",
                    type:"POST"
                }).done(function (data) {
                    alert(data)

                }).fail(function (xhr,status) {
                    alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
                });
            }
        }
        
        function createCollection(field) {
            var colhtml = "",elt;
            var labelName = $(field).next().children().text();
            if(checkCollectionName(labelName)) {
                $.ajax("/objectList", {
                    dataType: 'json'
                }).done(function (data) {
                    elt = $(field).next().parent().find(".collectionTags");
                    elt.on('itemRemoved', function (event) {
                        $(this).parent().remove();
                    });
                    colhtml = '<button style="position: absolute;right: 62.5%" onclick="saveCollection(this)"><span class="glyphicon glyphicon-send" ></span></button>';
                    $(field).parent().append(colhtml);

                    colhtml = "<div style='margin-left: 6px' class='Object-multiselect'><select class='selectResult' multiple='multiple' size='2'>";
                    for (var e in data) {
                        colhtml += "<optgroup label='{0}'>".format(data[e][0]);
                        for(var i in data[e][1]) {
                            colhtml += "<option value='{0}'>{0}</option>".format(data[e][1][i])
                        }
                        colhtml += "</optgroup>";
                    }
                    colhtml += "</select>";
                    colhtml += "<input type='text' class='collection-elements-tagsinput' data-role='tagsinput'  style='display: none'/></div>";
                    $(field).parent().append(colhtml);
                    $(field).parent().find("div.Object-multiselect").find("select").multiselect({
                        // noneSelectedText: "---select---",
                        // checkAllText: "all",
                        // uncheckAllText: 'none',
                        // selectedList: 1,
                    }
                    ).multiselectfilter({
                        label:"Search: ",
                        width:130,
                        height:25
                    }).on("multiselectclick",function (event,ui) {

                        var result = $(this).multiselect("getChecked").map(function () {
                            return this.value;
                        }).get();
                        var elt1 =$(this).parent().find("input.collection-elements-tagsinput");
                        elt1.tagsinput("removeAll");
                        result.unshift(0);
                        if(result.length > 1){
                            for(var i in result){
                                elt1.tagsinput('add',result[i]);
                            }
                        }
                        elt1.tagsinput("refresh");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                        $(this).parent().find("div.bootstrap-tagsinput").css("margin-left","4px");
                        var that = this;//select
                        elt1.on("itemRemoved",function () {
                            $(that).multiselect("setChecked");
                        });
                    }).bind("multiselectoptgrouptoggle",function (event,ui) {
                        var result = $(this).multiselect("getChecked").map(function () {
                            return this.value;
                        }).get();

                        var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                        elt1.tagsinput("removeAll");
                        result.unshift(0);
                        if (result.length > 1) {
                            for (var i in result) {
                                elt1.tagsinput('add', result[i]);
                            }
                        }
                        elt1.tagsinput("refresh");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                        $(this).parent().find("div.bootstrap-tagsinput").css("margin-left","4px");
                        var that = this;//select$(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                        elt1.on("itemRemoved", function () {
                            $(that).multiselect("setChecked");
                        });
                    }
                    ).bind("multiselectuncheckall",function () {

                        var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                        elt1.tagsinput("removeAll");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                        $(this).parent().find("div.bootstrap-tagsinput").css("margin-left","4px");

                    }).bind("multiselectcheckall",function () {
                        var result = $(this).multiselect("getChecked").map(function () {
                            return this.value;
                        }).get();
                        var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                        elt1.tagsinput("removeAll");
                        result.unshift(0);
                        if (result.length > 1) {
                            for (var i in result) {
                                elt1.tagsinput('add', result[i]);
                            }
                        }
                        elt1.tagsinput("refresh");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                        $(this).parent().find("div.bootstrap-tagsinput").css("margin-left","4px");
                        var that = this;//select
                        elt1.on("itemRemoved", function () {
                            $(that).multiselect("setChecked");
                        });

                    });
                    colhtml = '<span class="newCollection"><button class="bootstrap-tagsinput-add-button" onclick="createCollection(this)"><span class="glyphicon glyphicon-plus-sign" style="color:lightgreen;top: 3px;" ></span></button><input class="collectionTags label label-success" type="text"  data-role="tagsinput" /></span>';
                    $(field).parent().find("div.Object-multiselect").find("select").next().css("vertical-align","top");
                    $(field).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");

                    $(field).parent().parent().append(colhtml);
                    $(field).remove();

                    $('.collectionTags').tagsinput({
                        maxTags:1,
                        tagClass:'label label-primary'
                    });
                    $(".collectionTags").prev().css("border","transparent");

                }).fail(function (xhr, status) {
                    alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
                });
            }
        }

        function saveConfigure(field) {
            if($(field).parent().find(".Object-multiselect").find(".bootstrap-tagsinput").children().size()>1){
                var elt1 = $(field).parent().find(".Object-multiselect").find("input.collection-elements-tagsinput");
                var result = elt1.tagsinput("items");
                var elt2 = $(field).parent().find(".configureTags");
                var version = elt2.tagsinput("items");
                var aj = $.ajax("/saveConfigure/{0}".format(JSON.stringify([version[0],result])),{
                    dataType:"text",
                    type:"POST"
                }).done(function (data) {
                    alert(data)

                }).fail(function (xhr,status) {
                    alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
                });
            }
        }

        function createConfigure(field) {
            var colhtml = "",elt;
            var labelName = $(field).next().children().text();
            if(checkCollectionName(labelName)) {
                $.ajax("/objectList", {
                    dataType: 'json'
                }).done(function (data) {
                    elt = $(field).parent().find(".configureTags");
                    //if($(field).next().parent().attr("class") === "newCollection") {
                        elt.on('itemRemoved', function (event) {
                            $(this).parent().remove();
                        });
                    //}
                    colhtml = '<button style="position: absolute;right: 62.5%" onclick="saveConfigure(this)"><span class="glyphicon glyphicon-send" ></span></button>';
                    $(field).parent().append(colhtml);

                    colhtml = "<div style='margin-left: 6px' class='Object-multiselect'><select class='selectResult' multiple='multiple' size='2'>";

                    for (var e in data) {
                        colhtml += "<optgroup label='{0}'>".format(data[e][0]);
                        for(var i in data[e][1]) {
                            colhtml += "<option value='{0}'>{0}</option>".format(data[e][1][i])
                        }
                        colhtml += "</optgroup>";
                    }
                    colhtml += "</select>";
                    colhtml += "<input type='text' class='collection-elements-tagsinput' data-role='tagsinput'  style='display: none'/></div>";
                    $(field).parent().append(colhtml);
                    $(field).parent().find("div.Object-multiselect").find("select").multiselect({
                        // noneSelectedText: "---select---",
                        // checkAllText: "all",
                        // uncheckAllText: 'none',
                        // selectedList: 1,
                    }
                    ).multiselectfilter({
                        label:"Search: ",
                        width:130,
                        height:25
                    }).on("multiselectclick",function (event,ui) {

                        var result = $(this).multiselect("getChecked").map(function () {
                            return this.value;
                        }).get();
                        var elt1 =$(this).parent().find("input.collection-elements-tagsinput");
                        elt1.tagsinput("removeAll");
                        result.unshift(0);
                        if(result.length > 1){
                            for(var i in result){
                                elt1.tagsinput('add',result[i]);
                            }
                        }
                        elt1.tagsinput("refresh");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                        $(this).parent().find("div.bootstrap-tagsinput").css("margin-left","4px");
                        var that = this;//select
                        elt1.on("itemRemoved",function () {
                            $(that).multiselect("setChecked");
                        });
                    }).bind("multiselectoptgrouptoggle",function (event,ui) {
                        var result = $(this).multiselect("getChecked").map(function () {
                            return this.value;
                        }).get();
                        var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                        elt1.tagsinput("removeAll");
                        result.unshift(0);
                        if (result.length > 1) {
                            for (var i in result) {
                                elt1.tagsinput('add', result[i]);
                            }
                        }
                        elt1.tagsinput("refresh");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                        $(this).parent().find("div.bootstrap-tagsinput").css("margin-left","4px");
                        var that = this;//select$(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                        elt1.on("itemRemoved", function () {
                            $(that).multiselect("setChecked");
                        });
                    }
                    ).bind("multiselectuncheckall",function () {

                        var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                        elt1.tagsinput("removeAll");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                        $(this).parent().find("div.bootstrap-tagsinput").css("margin-left","4px");
                    }).bind("multiselectcheckall",function () {
                        var result = $(this).multiselect("getChecked").map(function () {
                            return this.value;
                        }).get();
                        var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                        elt1.tagsinput("removeAll");
                        result.unshift(0);
                        if (result.length > 1) {
                            for (var i in result) {
                                elt1.tagsinput('add', result[i]);
                            }
                        }
                        elt1.tagsinput("refresh");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                        $(this).parent().find("div.bootstrap-tagsinput").css("margin-left","4px");
                        var that = this;//select
                        elt1.on("itemRemoved", function () {
                            $(that).multiselect("setChecked");
                        });
                    });
                    colhtml = '<span class="newCollection"><button class="bootstrap-tagsinput-add-button" onclick="createConfigure(this)"><span class="glyphicon glyphicon-plus-sign" style="color:lightgreen;top: 3px;" ></span></button><input class="configureTags" type="text"  data-role="tagsinput" /></span>';
                    $(field).parent().find("div.Object-multiselect").find("select").next().css("vertical-align","top");
                    $(field).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                    $(field).parent().parent().append(colhtml);
                    $(field).remove();
                    $("input.configureTags").tagsinput({
                        maxTags:1,
                        tagClass:'label label-success'
                    });
                    $("input.configureTags").prev().css("border","transparent");


                }).fail(function (xhr, status) {
                    alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
                });
            }
        }
        return {
            init:initialize,
            setting:settings,
            create:HtmlExcelAll,
            getCollectionData:getMainTableData,
            getMainHandsonInst:getMainHandsonIns
        }
    })();
