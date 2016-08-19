/**
 * Created by sommily on 2/15/16.
 */
var Is_Test_Color = 'silver';

function show_alert(message) {
    $("#AlertContent").html(message);
    $("#show_alert").click();
}

function SetMappingDate() {
    var currentDate = new Date();
    var hours = currentDate.getHours();
    if (hours >= 15) {
        $("#mappingdate").datepicker('setValue', currentDate.toISOString().split('T')[0]);
    }
    else {
        var PrevDay = null;
        if (currentDate.getDay() == 1) {
            PrevDay = new Date(currentDate.valueOf() - 24 * 3600000 * 3);
        }
        else {
            PrevDay = new Date(currentDate.valueOf() - 24 * 3600000);
        }
        $("#mappingdate").datepicker('setValue', PrevDay.toISOString().split('T')[0]);
    }
}

function upload_to_daoba() {
    var update_button = $("#updateButton");
    update_button.attr('disabled', true);
    var iq2_name = $("#iq2NameSelect").val();
    var encrypt_select = $("#DoEncryptSelect").val();
    var automaton_encrypt = 1;
    if(encrypt_select == 'NotEncrypt')
    {
        automaton_encrypt = 0;
    }
    $.ajax({
        url: '/automaton/upload_to_colo',
        data: {
            "iq2_name": iq2_name,
            "automaton_encrypt":automaton_encrypt
        },
        type: 'get',
        success: function (return_data) {
            var data = JSON.parse(return_data);
            var code = data["code"];
            if (code == 0) {
                show_alert('Update Done');
            }
            else {
                show_alert(data["message"] + "<br>Detail Message: " + data["content"]);
            }
        },
        error: function () {
            show_alert("Request update failed");
        }
    });
    update_button.attr('disabled', false);
}

function upload_mapping_to_daoba() {
    var update_mapping_button = $("#updateMappingButton");
    update_mapping_button.attr('disabled', true);
    var iq2_name = $("#iq2NameSelect").val();
    var automaton_name = $("#automatonInput").val();
    var mapping_date = $("#mappingdate").val();
    $.ajax({
        url: '/automaton/update_mapping_to_daoba',
        data: {
            "automaton_name": automaton_name,
            "iq2_name": iq2_name,
            "mapping_date": mapping_date
        },
        type: 'get',
        success: function (return_data) {
            var data = JSON.parse(return_data);
            var code = data["code"];
            if (code == 0) {
                show_alert('Update Mapping Done');
            }
            else {
                show_alert(data["message"] + "<br>Detail Message: " + data["content"]);
            }
        },
        error: function () {
            show_alert("Request update mapping failed");
        }
    });
    update_mapping_button.attr('disabled', false);
}

function GenerateAutomaton() {
    $("#my-modal-loading").modal();
    $("#Generate").attr('disabled', true);
    var iq2_name = $("#iq2NameSelect").val();
    var automaton_name = $("#automatonInput").val();
    var generate_mode = $("#generate_mode_select").val();
    $.ajax({
        url: '/index/get_automaton',
        type: 'get',
        data: {
            broker_account: "",
            automaton_name: automaton_name,
            feedsource: "",
            generate_mode: generate_mode,
            iq2_name: iq2_name
        },
        success: function (return_data) {
            $("#my-modal-loading").modal("close");
            $("#Generate").attr('disabled', false);
            var data = JSON.parse(return_data);
            if (data['code'] == 0) {
                var content = data['content'];
                content = content.replace(/Name/g, 'label');
                content = content.replace(/Children/g, 'children');
                $("#tree1").tree('loadData', JSON.parse(content));
                show_existed_module();
            }
            else {
                show_alert(data["message"] + "<br>Detail Message:<br> " + data["content"]);
            }
        },
        error: function () {
            $("#my-modal-loading").modal("close");
            $("#Generate").attr('disabled', false);
            show_alert('Error : GenerateAutomaton failed');
        }
    });
}

function generate_automaton_graph(automaton_list, parent) {
    $.each(automaton_list, function (index, val) {
        if (val.Children.length > 0) {
            var li = $("<li id=\"" + val.Name + "\" name=\"" + val.Name + "\">" + val.Name + "</li>");
            var ul = $("<ul></ul>");
            generate_automaton_graph(val.Children, $(ul));
            li.append(ul).appendTo(parent);
        }
        else {
            $("<li id=\"" + val.Name + "\" name=\"" + val.Name + "\">" + val.Name + "</li>").appendTo(parent);
        }
    });
    show_existed_module();
}

function clear_automaton() {
    $("#tree1").html("");
}

function query_margin_ratio() {
    var iq2_name = $("#iq2NameSelect").val();
    var trading_day = $("#mappingdate").val();
    $.ajax({
        url: '/automaton/get_margin',
        data: {
            "iq2_name": iq2_name,
            "trading_day": trading_day
        },
        type: 'get',
        success: function (return_data) {
            var data = JSON.parse(return_data);
            if (0 == data["code"]) {
                var margin_ratio_json = data["content"];
                var iq2_name = margin_ratio_json['iq2_name'];
                var trading_day = margin_ratio_json['trading_day'];
                var day_margin_price = margin_ratio_json['day_margin_price'];
                var night_margin_price = margin_ratio_json['night_margin_price'];
                var content = '';
                content += 'IQ2Name: ' + iq2_name + '<br>';
                content += 'TradingDay: ' + trading_day + '<br>';
                content += 'DayMarginPrice: ' + day_margin_price + '<br>';
                content += 'NightMarginPrice: ' + night_margin_price + '<br>';
                show_alert(content);
            }
            else {
                show_alert(data["message"] + "<br>Detail message: " + data["content"]);
            }
        },
        error: function () {
            show_alert('Request query margin Failed');
        }
    })
}

function delete_signal() {
    var delete_signal_button = $("#DeleteSignal");
    delete_signal_button.attr('disabled', true);
    $.ajax({
        url: '/signal/delete_all_signal',
        type: 'get',
        success: function () {
            show_alert("Delete Signal Done");
        },
        error: function () {
            show_alert("Request Delete all signal failed");
        }
    });
    delete_signal_button.attr('disabled', false);
}

function import_signal() {
    $("#my-modal-loading").modal();
    var iq2_name = $("#iq2NameSelect").val();
    $.ajax({
        url: "/signal/start_import_signal",
        type: "GET",
        data: {
            "iq2_name": iq2_name
        },
        success: function (data) {
            $("#my-modal-loading").modal("close");
            var return_data = JSON.parse(data);
            if (return_data['code'] == 0) {
                show_alert("Import Signal Done");
            }
            else {
                show_alert("Import Signal Failed,<br>Detail message: " + return_data["content"]);
            }
        },
        error: function () {
            $("#my-modal-loading").modal("close");
            show_alert("Request Import Signal Failed");
        }
    });
}

function generate_automaton_json(li, data_json) {
    var tmp_data = {};
    tmp_data['Name'] = li.attr('name');
    tmp_data['Children'] = [];
    $.each(li.children('ul').children('li'), function () {
        generate_automaton_json($(this), tmp_data);
    });
    data_json['Children'].push(tmp_data);
}

function save_new_automaton() {
    var iq2_name = $("#iq2NameSelect").val();
    var automaton_name = $("#automatonInput").val();
    var mapping_date = $("#mappingdate").val();
    var data_json = $("#tree1").tree("toJson");
    data_json = data_json.replace(/name/g, 'Name');
    data_json = data_json.replace(/children/g, 'Children');
    data_json = data_json.replace(/"is_open":true,/g, '');
    data_json = data_json.replace(/"is_open":fakse,/g, '');
    $.ajax({
        url: '/automaton/update_automaton',
        type: 'get',
        data: {
            "iq2_name": iq2_name,
            "automaton_name": automaton_name,
            "mapping_date": mapping_date,
            "automaton_json": data_json
        },
        success: function (return_data) {
            var data = JSON.parse(return_data);
            var code = data["code"];
            if (code == 0) {
                show_alert("Save automaton success");
            }
            else {
                show_alert(data["message"] + "<br>Detail Message: " + data["content"]);
            }
        },
        error: function () {
            show_alert("Request save automaton failed");
        }
    })
}

function show_existed_module() {
    $.ajax({
        url: '/automaton/get_all_existed_module_name_list',
        type: 'get',
        success: function (data) {
            var existed_module_name_list = JSON.parse(data);
            var existed_module_list = $('#ExistedModuleList');
            existed_module_list.html("");
            $.each(existed_module_name_list, function (index, existed_module_name) {
                existed_module_list.append($('<li><a style="cursor: pointer;" onClick="add_module(\'' + existed_module_name + '\')">' + existed_module_name + '</a></li>'));
            });
        },
        error: function () {
            show_alert("Get all existed module failed");
        }
    })
}

function add_module(existed_module_name) {
    var $tree = $('#tree1');
    var root_node = $tree.tree('getNodeByName', 'DFC');
    $tree.tree('appendNode', {label: existed_module_name}, root_node);
}

function export_automaton() {
    var iq2_name = $("#iq2NameSelect").val();
    var automaton_graph = $("#org").html();
    var fileDownFrame = $("#fileDownFrame");
    fileDownFrame.attr("src", "/automaton/download_automaton_graph?iq2_name=" + iq2_name + "&automaton_graph=" + automaton_graph);
}

function import_automaton() {
    var iq2_name = $("#iq2NameSelect").val();
    $.ajax({
        url: '/automaton/import_automaton_graph',
        type: 'get',
        data: {
            "iq2_name": iq2_name
        },
        success: function (return_data) {
            var data = JSON.parse(return_data);
            var code = data["code"];
            if (code == 0) {
                var org = $("#org");
                var automaton_graph = data["content"];
                org.html(automaton_graph);
                $("#chart").html("");
                org.jOrgChart({
                    chartElement: '#chart',
                    dragAndDrop: true
                });
            }
            else {
                show_alert(data["message"] + "<br>Detail Message: " + data["content"]);
            }

        },
        error: function () {
            show_alert("Request import automaton failed");
        }
    });
}

function download_book() {
    $("#fileDownFrame").attr("src", "/automaton/v2/download_book");
}

function download_signals() {
    $("#fileDownFrame").attr("src", "/automaton/v2/download_signals");
}

function download_automaton() {
    $("#fileDownFrame").attr("src", "/automaton/v2/download_automaton");
}

