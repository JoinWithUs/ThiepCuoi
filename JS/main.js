$(document).ready(function () {

    loadSubPage("Introduce", "introduce_page");
    loadSubPage("PhotoGallery", "photo_gallery_page");
    loadSubPage("ResponseBox", "response_box_page", function () {
        setupResponseBox();
    });

    setupCounter();
    setupCalendar();
});

/**
 * Load các trang nhỏ
 */
loadSubPage = function (name, targetId, callbackFn) {
    $.ajax({
        url: `/Pages/${name}.txt`,
        method: "GET",
        dataType: 'text',
        success: function (data, textStatus, jqXHR) {
            $(`#main_content #${targetId}`).html(data);

            typeof callbackFn == "function" && callbackFn();
        }
    })
};

/**
 * Cài đặt bộ đếm thời gian
 */
setupCounter = function () {
    let time = $("div.countdown-time").text();
    var countDownDate = new Date(time).getTime();

    // Update the count down every 1 second
    var x = setInterval(function () {
        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (parseInt(hours) < 10) {
            hours = "0" + parseInt(hours);
        }
        if (parseInt(minutes) < 10) {
            minutes = "0" + parseInt(minutes);
        }
        if (parseInt(seconds) < 10) {
            seconds = "0" + parseInt(seconds);
        }
        if (parseInt(days) < 10) {
            days = "0" + parseInt(days);
        }

        $(".day-left .num").html(days);
        $(".hour-left .num").html(hours);
        $(".minute-left .num").html(minutes);
        $(".second-left .num").html(seconds);

        // If the count down is over, write some text 
        if (distance < 0) {
            clearInterval(x);
            $(".day-left .num").html('00');
            $(".hour-left .num").html('00');
            $(".minute-left .num").html('00');
            $(".second-left .num").html('00');
        }
    }, 1000);
}

/**
 * Cài đặt phần đặt lịch
 */
setupCalendar = function () {
    var eventData = {
        "title": "Lễ cưới của Chú rể và Cô dâu Nguyệt Hằng",
        "desc": "Thiệp cưới online của Chú rể và Nguyệt Hằng",
        "start": "2023-10-23T11:00:00",
        "end": "2023-10-23T12:00:00",
        "location": "",
        "timezone": "Asia/Bangkok"
    };
    var formatTextParam = function (text) {
        return text.replaceAll(" ", "+");
    }
    var formatDateParam = function (date) {
        var tempDate = null;
        var result = ""

        if (typeof (date) == "string") {
            tempDate = new Date(date);
        }
        if (typeof (date.getDate) == "function") {
            tempDate = date;
        }

        if (tempDate) {
            result = tempDate.formatDateTime();
        }

        return result.replaceAll("-", "").replaceAll(":", "");
    }

    var url = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${formatTextParam(eventData.title)}
    &dates=${formatDateParam(eventData.start) + "/" + formatDateParam(eventData.end)}&details=${eventData.desc}&location&ctz=${eventData.timezone}&output=xml`;

    $('#btn_save_event').on('click', function () {
        window.open(url);
    });
}

/**
 * Cài đặt form phản hồi
 */
setupResponseBox = function () {
    var ggSheetUrl = "https://script.google.com/macros/s/AKfycbwXuTKarcluP8GfRo-vqdwWlP3l9Q6VpDq8LU0Bl-OuX-vU7URbusBFTx-xS-stzDx5ig/exec";
    var btn_send_response_disabled = false;

    $(".form-control[name='customer_type']").val("Nhà gái");
    $(".form-control[name='attend_status']").val("Tham dự");

    // thêm các event
    // event chọn loại khách
    $("#response_box_page").on("click", "label.option", function (event) {
        var rdId = $(event.currentTarget).attr("for");
        var newVal = $(`input#${rdId}`).val();

        $(".form-control[name='customer_type']").val(newVal);
    });

    // event chọn trạng thái tham gia
    $("#response_box_page").on("click", "label.optionboxp", function (event) {
        var rdId = $(event.currentTarget).attr("for");
        var newVal = $(`input#${rdId}`).val();

        if (newVal.toLowerCase() != "Tham dự".toLowerCase()) {
            $("#response_box_page .element-hide-rap").hide();
        }
        else {
            $("#response_box_page .element-hide-rap").show();
        }

        $(".form-control[name='attend_status']").val(newVal);
    });

    // event gửi phản hồi
    $("#response_box_page").on("click", "#btn_send_response", function (event) {
        var data = getResponseBoxData();
        var processingMsg = "Lời phản hồi đang được gửi đi. Vui lòng chờ trong giây lát!";
        var successMsg = "Bạn đã gửi phản hồi thành công!";
        var errorMsg = "Bạn gửi phản hồi không thành công, vui lòng thử lại!";

        if (btn_send_response_disabled) {
            alert(processingMsg);
            return;
        }

        if (!data["customer_name"]) {
            alert("Vui lòng nhập Tên khách mời!");
            $(".form-control[name='customer_name']").focus();
        }
        else {
            btn_send_response_disabled = true;
            $.ajax({
                url: ggSheetUrl,
                method: "GET",
                dataType: "json",
                data: data,
                success: function (response) {
                    if (response["result"] == "success") {
                        alert(successMsg);
                    }
                    else {
                        alert(errorMsg);
                    }
                },
                error: function () {
                    alert(errorMsg);
                },
                complete: function () {
                    btn_send_response_disabled = false;
                }
            });
        }
    });
}

/**
 * Lấy dữ liệu phản hồi từ khách mời
 */
getResponseBoxData = function () {
    var data = {
        // customer_type: "Nhà gái",
        // customer_name: "nmtuan2",
        // attend_status: "Tham dự",
        // attendee_number: "1",
        // transport_type: "tự túc",
        // customer_phone: "123"
    }
    var formFields = $("#response_box_page .form-control");

    $.each(formFields, function (index, obj) {
        var isVisible = $(obj).parents(".element-hide-rap").css("display") != "none",
            key = $(obj).attr("name"),
            value = isVisible ? $(obj).val() : "";

        data[key] = value;
    });

    return data;
}