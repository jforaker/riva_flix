(function($) {
    $.fn.shorten = function (settings) {

        var config = {
            showChars: (1 + 2 * Math.random()) * 50,
            ellipsesText: "...",
            moreText: "more",
            lessText: "less"
        };

        if (settings) {
            $.extend(config, settings);
        }

        $(document).off("click", '.morelink');

        return this.each(function () {
            var $this = $(this);
            if($this.hasClass("shortened")) return;

            $this.addClass("shortened");
            var content = $this.html();
            var link = $this.parent().find('a').attr('href');
            if (content.length > (1 + 2 * Math.random()) * 50) {
                var c = content.substr(0, (1 + 2 * Math.random()) * 50);
                var h = content.substr(config.showChars, content.length - config.showChars);
                var html = c + '<span class="moreellipses">' + config.ellipsesText + ' </span><span class="morecontent"><span>' + h + '</span> <a href="'+ link +'" class="morelink">' + config.moreText + '</a></span>';
                $this.html(html);
                $(".morecontent span").hide();
            }
        });

    };

})(jQuery);