


docReady( function() {

//    $(window).scroll( function(){
//
//        /* Check the location of each desired element */
//        var items = $('.item');
//        $(items).each( function(i){
//
//            var bottom_of_object = $(this).position().top + $(this).outerHeight();
//            var bottom_of_window = $(window).scrollTop() + $(window).height();
//
//            /* If the object is completely visible in the window, fade it it */
//            if( bottom_of_window > bottom_of_object ){
//
//                $(this).animate({'opacity':'1'},500);
//
//            }
//        })
//    });

    //masonry

    var $container = $('.masonry');
    $container.find('.item').fadeIn();

    $container.imagesLoaded(function(){
        $container.masonry({
            itemSelector : '.item',
            // columnWidth: 60,
            "gutter": 22,
            "isFitWidth": true,

            isAnimated: true,
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });


        //$.stellar();
    });


    //youtube

    if( $('body').hasClass('show movies') || $('body').hasClass('search movies')){

        console.log("yessss");

        var title = ($('#movie-name')[0].innerHTML + ' official movie trailer');
        console.log(title);

        jQTubeUtil.search( title, function(response){
            var html = "";
            // for(v in response.videos){
            var video = response.videos[0]; // this is a 'friendly' YouTubeVideo object
            html += "<div class='item'><div class='player'></div>" +
               // "<p>" + video.title + "</p>" +
                "</div>";

            var vid = $('#tuber').data('tube');

            //}
            jQuery(".youtube").html(html);

            jQuery(".player").tubeplayer({
                width: 600, // the width of the player
                height: 450, // the height of the player
                allowFullScreen: "true", // true by default, allow user to go full screen
                initialVideo: vid ? vid : video.videoId, // the video that is loaded into the player
                preferredQuality: "default"// preferred quality: default, small, medium, large, hd720

            });
        });
    } else {
        console.log("noooo");
    }

    //shorten description
    $('p.desc').shorten();


    //alerts
    $("#alerter").animate({
        'opacity':'1',
        'top': "+=150px"
    },500);


});


