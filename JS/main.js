$(document).ready(function () {

    setupCounter();
    setupCalendar();
    setupPhotoGallery();
    setupResponseBox();
});

/**
 * Cài đặt bộ đếm thời gian
 */
setupCounter = function () {
    var time = "2023-10-20T17:00:00";
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
 * Cài đặt phần album ảnh
 */
setupPhotoGallery = function () {
    var slideIndex = 1;
    var touchstartX = 0; // điểm bắt đầu
    var touchendX = 0; // điểm kết thúc
    var photoGalleryImages = [
        "DSC_0981", "DSC_1023", "DSC_1238",
        "DSC_1326"
    ];

    // build ra danh sách các ảnh
    for (var i = 0; i < photoGalleryImages.length; i++) {
        var imgName = photoGalleryImages[i],
            imgHtml = `<div class="mySlides">
                <div class="wedding-image" style="background-image: url('` + `./Uploads/Images/${imgName}.jpg` + `');"></div>
            </div>`;

        $("#photo_gallery_page .slideshow-container").append(imgHtml);
    }

    function plusSlides(n) {
        slideIndex += n;

        showSlides(slideIndex);
    }

    function showSlides(n) {
        var slides = $("#photo_gallery_page .mySlides");

        if (n > slides.length) {
            slideIndex = 1;
        }

        if (n < 1) {
            slideIndex = slides.length
        }

        for (var i = 0; i < slides.length; i++) {
            $(slides[i]).hide();
        }

        $(slides[slideIndex - 1]).show();
    }

    $("#photo_gallery_page .slideshow-container").on("click", ".prev", plusSlides.bind(this, -1));

    $("#photo_gallery_page .slideshow-container").on("click", ".next", plusSlides.bind(this, 1));

    $("#photo_gallery_page .slideshow-container").on("touchstart", function (evt) {
        touchstartX = evt.changedTouches[0].screenX;
    });

    $("#photo_gallery_page .slideshow-container").on("touchend", function (evt) {
        touchendX = e.changedTouches[0].screenX;

        // swiped left
        if (touchendX < touchstartX - 50) {
            plusSlides(1);
        }
        // swiped right
        if (touchendX - 50 > touchstartX) {
            plusSlides(-1);
        }
    });

    // hiển thị mặc định ảnh đầu tiên
    showSlides(slideIndex);
}

/**
 * Cài đặt form phản hồi
 */
setupResponseBox = function () {
    var ggSheetUrl = "https://script.google.com/macros/s/AKfycbwXuTKarcluP8GfRo-vqdwWlP3l9Q6VpDq8LU0Bl-OuX-vU7URbusBFTx-xS-stzDx5ig/exec";

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
        var btnSend = this;
        var data = getResponseBoxData();
        var originMsg = "Gửi phản hồi";
        var processingMsg = "Đang gửi phản hồi";
        var successMsg = "Đã gửi phản hồi";
        var errorMsg = "Bạn gửi phản hồi không thành công, vui lòng thử lại!";

        if (!data["customer_name"]) {
            alert("Vui lòng nhập Tên khách mời!");
            $(".form-control[name='customer_name']").focus();
        }
        else {
            $(btnSend).text(processingMsg);
            $(btnSend).addClass("disabled");

            $.ajax({
                url: ggSheetUrl,
                method: "GET",
                dataType: "json",
                data: data,
                success: function (response) {
                    if (response["result"] == "success") {
                        $(btnSend).text(successMsg);
                    }
                    else {
                        $(btnSend).text(originMsg);
                        $(btnSend).removeClass("disabled");
                        alert(errorMsg);
                    }
                },
                error: function () {
                    $(btnSend).text(originMsg);
                    $(btnSend).removeClass("disabled");
                    alert(errorMsg);
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
        // customer_wishes: ""
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
