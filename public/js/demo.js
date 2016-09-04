$(function() {
    $("#parse").on("click", function() {
        $("table").slideUp();
        hideAlert();
        var courseNum = $("#courseNum").val();
        if (courseNum == "") {
            showAlert("请先输入课程号进行解析！");
            $("#courseNum").focus();
            return;
        }
        $("tbody").text("");
        showAlert("正在拉取章节列表中……请稍等片刻……");
        $.ajax({
            url: "/get/course?courseNum=" + courseNum,
            success: function(data) {
                initDom(data);
            },
            error: function(xhr) {
                if (xhr.status == 404) {
                    showAlert("没有该课程!");
                } else {
                    showAlert("网络可能出现问题了!");
                }
            }
        });
    })
});

function initDom(data) {
    if(data.list.length==0){
        showAlert("没有该课程~，请重新输入");
        return;
    }
    var title = data.title;
    showAlert("成功拉取课程「" + title + "」的章节列表！");
    $("table").slideDown();
    for(var i=0,len=data.list.length;i<len;i++){
        var trObj;
        if(data.list[i].type=="video"){
            var btn1 = "<button class='btn btn-success' data-toggle='popover' data-placement='bottom' classId='" + data.list[i].videoId + "' videoDef=" + 0 + ">普清</button>&nbsp;";
            var btn2 = "<button class='btn btn-success' data-toggle='popover' data-placement='bottom' classId='" + data.list[i].videoId + "' videoDef=" + 1 + ">高清</button>&nbsp;";
            var btn3 = "<button class='btn btn-success' data-toggle='popover' data-placement='bottom' classId='" + data.list[i].videoId + "' videoDef=" + 2 + ">超清</button>";
            trObj = $("<tr><td>" + data.list[i].name + "<span class='label label-success'>视频</span></td><td>" + btn1 + btn2 + btn3 + "</td></tr>");
        }else if(data.list[i].type=="code"){
            var url = "http://www.imooc.com/code/" + data.list[i].videoId;
            trObj = $("<tr><td>" + data.list[i].name + "<span class='label label-info'>编程</span></td><td><a href=" + url + " class='btn btn-info' target='_blank'>编程</a></td></tr>");
        }else if(data.list[i].type=='ceping'){
            var url = "http://www.imooc.com/ceping/" + data.list[i].videoId;
            trObj = $("<tr><td>" + data.list[i].name + "<span class='label label-info'>练习</span></td><td><a href=" + url + " class='btn btn-info' target='_blank'>练习</a></td></tr>");
        }
        $("tbody").append(trObj);
    }
    initEvent();
}

function getVideoUrl(videoId, videoDef) {
    var videoUrl;
    $.ajax({
        url: "/get/video?videoId="+videoId+"&videoDef="+videoDef,
        async: false,
        dataType: 'json',
        success: function(data) {
            videoUrl = data;
        },
        error: function(xhr, status, error) {
            showAlert("网络异常~");
            return null;
        }
    });
    return videoUrl;
}

var lastClick;

function initEvent() {
    $("table").show();
    $("[data-toggle='popover']").popover({
        html: true,
        trigger: 'manual',
        animation: false
    });

    $("[data-toggle='popover']").on('click', function() {
        if (lastClick == this) {
            $(this).popover('toggle');
        } else {
            if ($(this).attr("data-content") == undefined) {
                var classId = $(this).attr('classId');
                var videoDef = $(this).attr('videoDef');
                var videoUrl = getVideoUrl(classId, videoDef);
                if (videoUrl == null) {
                    return;
                }
                var data_content = "<a href='" + videoUrl + "' class='btn btn-success' target='_blank' data-title='右键另存为进行下载' data-placement='bottom' data-toggle='tooltip'>下载视频</a>"
                $(this).attr("data-content", data_content);
            }
            $("[data-toggle='popover']").popover('hide');
            $(this).popover('show');
            lastClick = this;
        }
        $("[data-toggle='tooltip']").tooltip();
    })
}

function hideAlert() {
    $(".alert").slideUp();
}

function showAlert(info) {
    $("#alertInfo").text(info);
    $(".alert").slideDown();
}