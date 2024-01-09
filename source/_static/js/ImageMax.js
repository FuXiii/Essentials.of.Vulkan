$(function () {
    $(".img-responsive").click(function () {
        debugger
        var _this = $(this);
        imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
    });
});

function imgShow(outerdiv, innerdiv, bigimg, _this) {
    debugger
    var src = _this.attr("src");
    $(bigimg).attr("src", src);
    $("<img/>").attr("src", src).on('load', function () {
        debugger
        var windowW = $(window).width()
        var windowH = $(window).height();
        var realWidth = this.width;
        var readHeight = this.height;
        var imgWidth, imgHeight;
        var scale = 0.8;
        if (realWidth > windowW + scale) {
            imgHeight = windowH * scale;
            imgWidth = imgHeight / readHeight * realWidth;
            if (imgWidth > windowW * scale) {
                imgWidth = windowW * scale;
            }
        } else if (realWidth > windowW * scale) {
            imgWidth = windowW * scale;
            imgHeight = imgWidth / realWidth * readHeight;
        } else {
            imgWidth = realWidth;
            imgHeight = readHeight;
        }
        $(bigimg).css("width", imgWidth);
        var w = (windowW - imgWidth) / 2;
        var h = (windowH - imgHeight) / 2;
        $(innerdiv).css({ "top": h, "left": w });
        $(outerdiv).fadeIn("fast");
    });
    $(outerdiv).click(function () {
        $(this).fadeOut("fast");
    });
};