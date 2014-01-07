$(function() {
    var nav_container = $(".nav-container"),
    first_section = $('#opening_movies'),
    first_title = $('first_title'),
    nav = $("nav"),
    top_spacing = 50,
    waypoint_offset = -50;

    nav_container.waypoint({
        handler: function(event, direction) {

            if (direction == 'down') {
                //nav_container.css({ 'height':nav.outerHeight() });
                nav.addClass("sticky")
                    .css("top",-nav.outerHeight())
                    .animate({"top":top_spacing}, {
                    duration: 500,
//                    specialEasing: {
//                        width: "linear",
//                        height: "easeOutBounce"
//                    }
                });
                //first_title.animate({"top":100});
                first_section.animate({"top":100});

            } else {
               // nav_container.css({ 'height':'auto' });
                first_title.stop().animate({"top":0});
                first_section.stop().animate({"top":0});
                nav.stop().removeClass("sticky").css("top",nav.outerHeight()+waypoint_offset).animate({"top":""});
            }
        },
        offset: function() {
            return -nav.outerHeight()-waypoint_offset;
        }
    });

    var sections = $("section"),
    navigation_links = $("nav a");

    sections.waypoint({
        handler: function(event, direction) {

            var active_section;
            active_section = $(this);
            if (direction === "up") active_section = active_section.prev();

            var active_link = $('nav a[data-link="#' + active_section.attr('id') + '"]');

            navigation_links.removeClass("selected");

            active_link.addClass("selected");


            console.log(active_link);

        },
        offset: '0'
    });

    navigation_links.click( function(e) {
        console.log($(this));
        $.scrollTo(
            $(this).data("link"),

            {
                duration: 200 * this.offsetParent.DOCUMENT_POSITION_PRECEDING,
                offset: { 'left':0, 'top':-0.15*$(window).height() }
            }

        );
    });
});