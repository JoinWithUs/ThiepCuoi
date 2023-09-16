Date.prototype.formatDate = function () {
    var date = this;
    var text = "";
    text = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    return text;
}

Date.prototype.formatTime = function () {
    var date = this;
    var text = "";
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();

    function fillPadding(number) {
        if (number > 9) return number + "";
        return "0" + number;
    }

    text = `${fillPadding(h)}:${fillPadding(m)}:${fillPadding(s)}`;

    return text;
}

Date.prototype.formatDateTime = function () {
    var date = this;
    var text = date.formatDate() + "T" + date.formatTime();

    return text;
}