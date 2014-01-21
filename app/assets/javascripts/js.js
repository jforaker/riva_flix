
docReady( function() {

//youtube

        if( $('body').hasClass('show movies') || $('body').hasClass('search movies')){

            $('#collapse').click(function(){
                $( "#accordian" ).slideToggle( "slow", function() {
                    $("#collapse").html($(this).is(':visible') ? "<i class='closer fa fa-times-circle'></i>" : "<i class='opener fa fa-caret-square-o-down'></i>");
                });
                $('.jumbo-details').toggleClass('upTop');
            });


            console.log("yessss");

            var mdbvid = $('#tuber').data('tube');
            console.log(mdbvid);
            $('#mainer').tubular({videoId: mdbvid ? mdbvid : '', start: 3 });


            var title = ($('#movie-name')[0].innerHTML + ' official movie trailer');
            console.log(title);

//        jQTubeUtil.search( title, function(response){
//            var html = "";
//            // for(v in response.videos){
//            var video = response.videos[0]; // this is a 'friendly' YouTubeVideo object
//            html += "<div class='item'><div class='player'></div>" +
//                // "<p>" + video.title + "</p>" +
//                "</div>";
//
//            var vid = $('#tuber').data('tube');
//
//            //}
////            jQuery(".youtube").html(html);
////
////            jQuery(".player").tubeplayer({
////                width: 600, // the width of the player
////                height: 450, // the height of the player
////                allowFullScreen: "true", // true by default, allow user to go full screen
////                initialVideo: vid ? vid : video.videoId, // the video that is loaded into the player
////                preferredQuality: "default"// preferred quality: default, small, medium, large, hd720
////
////            });
//
//            //hide info div
//            // click to enable volume
////            $.okvideo({
////                video: vid ? vid : video.videoId,
////                //volume: 50,
////                onPlay: function(){
////                    //$(this).volume(30);
////                    console.log(this);
////                }
////            });
//            $('#mainer').tubular({videoId: vid ? vid : video.videoId});
//        });
        } else {
            console.log("noooo");
        }




});


docReady( function() {

    //fade in
    var items = $('.item');
    $(items).each( function(i){
        var those = $(this);
        setTimeout(function() {
            those.animate({'opacity':'1'},1000)
        }, 1000);
    });

    //masonry
    var $container = $('.masonry');
    $container.imagesLoaded(function(){
        $container.masonry({
            itemSelector : '.item',
//            columnWidth: 20,
//            "gutter": 16,
            "isFitWidth": true,
            isAnimated: false
        });
    });






    $('ul.timeline').children('li').each(function(index) {
        $(this).addClass(index % 2 ? 'timeline-inverted' : 'regular');
        console.log(this);
        $('.regular').find('.item').css({
            float: 'right',
            textAlign: 'right'
        });

    });


    //shorten description
    $('p.desc').shorten();


//    //alerts
//    $("#alerter").animate({
//        'opacity':'1',
//        'top': "+=150px"
//    },500);

    $('#alerter').animate({'opacity': 1}, 500);
    setTimeout(function(){
        $('#alerter').animate({'opacity': 0}, 500);
    }, 1000)


});


