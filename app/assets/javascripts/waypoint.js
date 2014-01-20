$(function() {
    var nav_container = $(".nav-container"),
    first_section = $('#opening_movies'),
    first_title = $('first_title'),
    nav = $("nav"),
    top_spacing = -10,
    waypoint_offset = -nav_container.height();

    nav_container.waypoint({
        handler: function(event, direction) {

            if (direction == 'down') {
                //nav_container.css({ 'height':nav.outerHeight() });
                nav.addClass("sticky");

                //first_title.animate({"top":100});
                //first_section.animate({"top":100});

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

    var sections = $('.masonry'),
    navigation_links = $("nav a");

    sections.waypoint({
        handler: function(event, direction) {

            var active_section;
            active_section= $(this);
            var active_link = $('nav a[data-link="#' + active_section.attr('id') + '"]');
            if (direction === "up"){

                active_link = $('nav a[data-link="#' + active_section.prev().prev().prev().prev().attr('id') + '"]');

            }
            navigation_links.removeClass("selected");

            active_link.addClass("selected");
            console.log(active_link);

        },
        offset: (nav_container.height() * 2)
    });

    navigation_links.click( function(e) {
        console.log($(this));
        $.scrollTo(
            $(this).data("link"), {
                duration: 200 * this.offsetParent.DOCUMENT_POSITION_PRECEDING,
                offset: { 'left':0, 'top':-0.09*$(window).height() }
            }
        );
    });
});