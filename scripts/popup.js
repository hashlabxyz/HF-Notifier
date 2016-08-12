document.addEventListener('DOMContentLoaded', function() {
    $("#pms_count").html("loading");

    var url = "http://hackforums.net/usercp.php";
    $.get(url, function(data) {
        checkResponse(data);
    });
});

function checkResponse(data) {

    var pm = $(data).find("#pm_notice");
    if (pm.length > 0) {
        var number = $(pm).find("strong").html().substr(9, 1);

        if (!Number.isInteger(number))
            number = 1;

        $("#pms_count").html(number);
        $("#pms_count").attr("class", "neg");
    }
    else {
        $("#pms_count").html("0");
        $("#pms_count").attr("class", "pos");
    }
}
