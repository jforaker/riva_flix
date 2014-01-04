/**
 * =====================================================
 *  jQTubeUtil - jQuery YouTube Search Utility
 * =====================================================
 *  Version: 0.9.0 (11th September 2010)
 *  Author: Nirvana Tikku (ntikku@gmail.com)
 *
 *  Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 *  Documentation:
 *    http://www.tikku.com/jquery-jQTubeUtil-util
 * =====================================================
 *
 *  The jQTubeUtil Utility is a wrapper for the YouTube
 *  GDATA API and is built ontop of jQuery. The search
 *  utility provides the following functionality -
 *
 *  BASIC SEARCH:
 * #####################################################
 *
 *  jQTubeUtil.search("some keywords", function(response){})
 *
 *  jQTubeUtil.search({
 *      q: "some keywords",
 *      time: jQTubeUtil.getTimes()[pick one],
 *      orderby: jQTubeUtil.getOrders()[pick one],
 *      max-results: #
 *  },function(response){});
 *
 *  FEED SEARCH:
 * #####################################################
 *
 *  jQTubeUtil.mostViewed(function(response){});
 *
 *  jQTubeUtil.mostRecent(function(response){});
 *
 *  jQTubeUtil.mostPopular(function(response){});
 *
 *  jQTubeUtil.topRated(function(response){});
 *
 *  jQTubeUtil.topFavs(function(response){});
 *
 *  jQTubeUtil.related(videoID,function(response){});
 *
 *
 *   SUGGESTION SEARCH:
 * #####################################################
 *
 *  jQTubeUtil.suggest("keywords", function(response){});
 *
 *  SEARCH RESPONSE OBJECT:
 * #####################################################
 *
 *  Response = {
 *       version: String,
 *       searchURL: String,
 *       videos: Array, // of YouTubeVideo's (see below)
 *   <! if search/feed, then the following attrs are present !>
 *       startIndex: String,
 *       itemsPerPage: String,
 *       totalResults: String
 *   <!  end search/feed feed attrs present !>
 *  }
 *
 *  FRIENDLY VIDEO OBJECT:
 * #####################################################
 *
 *  YouTubeVideo = { 
 *      videoId: String,
 *      title: String,
 *      updated: String || undefined,
 *      thumbs: Array || undefined,
 *      duration: Number || undefined, (seconds)
 *      favCount: Number || undefined,
 *      viewCount: String || undefined,
 *      category: String || undefined,
 *      categoryLabel: String || undefined,
 *      description: String || undefined,
 *      keywords: String || undefined (comma sep words),
 *      unavailAttributes: Array
 *  }
 *
 */

;jQTubeUtil = (function($){ /* singleton */

    var f = function(){};
    var p = f.prototype;

    // Constants, Private Scope
    var MaxResults = 10,
        StartPoint = 1,
    // URLs
        BaseURL = "http://gdata.youtube.com",
        FeedsURL = BaseURL + "/feeds/api",
        VideoURL = FeedsURL + "/videos/",
        SearchURL = FeedsURL + "/videos",
        StandardFeedsURL = FeedsURL + "/standardfeeds",
        MostViewed = StandardFeedsURL + "/most_viewed",
        MostPopular = StandardFeedsURL + "/most_popular",
        MostRecent = StandardFeedsURL + "/most_recent",
        TopRated = StandardFeedsURL + "/top_rated",
        TopFavs = StandardFeedsURL + "/top_favorites",
        RecentlyFeatured = StandardFeedsURL + "/recently_featured",
        SuggestURL = "http://suggestqueries.google.com/complete/search",
        // Settings
        Times = ["today","this_week","this_month","all_time"],
        OrderBy = ["relevance", "published", "viewCount", "rating"],
        Categories = ["Film","Autos","Music","Animals","Sports","Travel","Shortmov","Videoblog","Games","Comedy","People","News","Entertainment","Education","Howto","Nonprofit","Tech"];

    // Settings _required_ for search
    var SearchDefaults = {
        "q": "",
        "orderby": OrderBy[2],
        "time": Times[3],
        "max-results": MaxResults
    };

    // The Feed URL structure _requires_ these
    var CoreDefaults = {
        "key": "", //"", /** NEEDS TO BE SET **/
        "format": 5, // embeddable
        "alt": "json",
        "callback": "?"
    };

    // The Autocomplete utility _requires_ these
    var SuggestDefaults = {
        hl: "en",
        ds: "yt",
        client: "youtube",
        hjson: "t",
        cp: 1
    };

    /**
     * Initialize the jQTubeUtil utility
     */
    p.init = function(options){
        if(!options.key) throw "jQTubeUtil requires a key!";
        CoreDefaults.key = options.key;
        if(options.orderby)
            SearchDefaults.orderby = options.orderby;
        if(options.time)
            SearchDefaults.time = options.time;
        if(options.maxResults)
            SearchDefaults["max-results"] = MaxResults = options.maxResults;
        if(options.lang)
            SuggestDefaults.hl = options.lang;
    };

    /** public method to get available time filter options */
    p.getTimes = function(){return Times;};

    /** public method to get available order filter options */
    p.getOrders = function(){return OrderBy;};

    /** public method to get available category filter options */
    p.getCategories = function(){return Categories;};

    /**
     * Autocomplete utility returns array of suggestions
     * @param input - string
     * @param callback - function
     */
    p.suggest = function(input, callback){
        var opts = {q: encodeURIComponent(input)};
        var url = _buildURL(VideoURL,
            $.extend({}, SuggestDefaults, opts)
        );
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url,
            success: function(xhr){
                var suggestions = [], res = {};
                for(entry in xhr[1]){
                    suggestions.push(xhr[1][entry][0]);
                }
                res.suggestions = suggestions;
                res.searchURL = url;
                if(typeof(callback) == "function"){
                    callback(res);
                    return;
                }
            }
        });
    };

    /**
     * This function is the public method
     * provided to the user to perform a
     * keyword based search
     * @param input
     * @param cb
     */
    p.search = function(input, cb, category){
        if ( typeof(input) == "string" )
            input = { "q" : encodeURIComponent(input) };
        if (null != category)
            category = {"category" : category};
        else
            category = {};
        return _search($.extend({}, SearchDefaults, input,category), cb);
    };

    /** Get a particular video via VideoID */
    p.video = function(vid, cb){
        return _request(VideoURL+vid+"?alt=json", cb);
    };

    /** Get related videos for a VideoID; ex. http://gdata.youtube.com/feeds/api/videos/ZTUVgYoeN_b/related?v=2 */
    p.related = function(vid, cb){
        return _request(VideoURL+vid+"/related?alt=json", cb);
    };

    /** Most Viewed Feed */
    p.mostViewed = function(incoming, callback){
        return _getFeedRequest(MostViewed, getOptions(incoming, true), callback);
    };

    /** Most Recent Feed */
    p.mostRecent = function(incoming, callback){
        return _getFeedRequest(MostRecent, getOptions(incoming, false), callback);
    };

    /** Most Popular Feed */
    p.mostPopular = function(incoming, callback){
        return _getFeedRequest(MostPopular, getOptions(incoming, true), callback);
    };

    /** Top Rated Feed */
    p.topRated = function(incoming, callback){
        return _getFeedRequest(TopRated, getOptions(incoming, true), callback);
    };

    /** Top Favorited Feed */
    p.topFavs = function(incoming, callback){
        return _getFeedRequest(TopFavs, getOptions(incoming, true), callback);
    };

    /**
     * Get a feeds request by specifying the URL
     * the options and the callback
     */
    function _getFeedRequest(baseURL, options, callback){
        var reqUrlParams = {
            "max-results": options.max || MaxResults,
            "start-index": options.start || StartPoint
        };
        if(options.time) reqUrlParams.time = options.time;
        var url = _buildURL(baseURL, reqUrlParams);
        return _request(url, options.callback || callback);
    };

    /**
     * Method to get the options for a standard
     * feed that is then utilized in the URL
     * building process
     */
    function getOptions(arg, hasTime){
        switch(typeof(arg)){
            case "function":
                return {
                    callback: arg,
                    time: undefined
                };
            case "object":
                var ret = {
                    max: arg.max,
                    start: arg['start-index']
                };
                if(hasTime) ret.time = arg.time;
                return ret;
            default: return {}; break;
        }
    };

    /**
     * This function builds the URL and makes
     * the search request
     * @param options
     * @param callback
     */
    function _search(options, callback){
        var URL = _buildURL(SearchURL, options);
        return _request(URL, callback);
    };

    /**
     * This method makes the actual JSON request
     * and builds the results that are returned to
     * the callback
     */
    function _request(url, callback){
        var res = {};
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url,
            success: function(xhr){
                if((typeof(xhr) == "undefined")
                    ||(xhr == null)) return;
                var videos = [];
                if(xhr.feed){
                    var feed = xhr.feed;
                    var entries = xhr.feed.entry;
                    for(entry in entries)
                        videos.push(new YouTubeVideo(entries[entry]));
                    res.startIndex = feed.openSearch$startIndex.$t;
                    res.itemsPerPage = feed.openSearch$itemsPerPage.$t;
                    res.totalResults = feed.openSearch$totalResults.$t;
                } else {
                    videos.push(new YouTubeVideo(xhr.entry));
                }
                res.version = xhr.version;
                res.searchURL = url;
                res.videos = videos;
                if(typeof(callback) == "function") {
                    callback(res); // pass the response obj
                    return;
                }

            },
            error: function(e){
                throw Exception("couldn't fetch YouTube request : "+url+" : "+e);
            }
        });
        return res;
    };

    /**
     * This method builds the url utilizing a JSON
     * object as the request param names and values
     */
    function _buildURL(root, options){
        var ret = "?", k, v, first=true;
        var opts = $.extend({}, options, CoreDefaults);
        for(o in opts){
            k = o;	v = opts[o];
            ret += (first?"":"&")+k+"="+v;
            first=false;
        }
        return root + ret;
    };

    /**
     * Represents the object that transposes the
     * YouTube video entry from the JSON response
     * into a usable object
     */
    var YouTubeVideo = function(entry){
        var unavail = [];
        var id = entry.id.$t;
        var start = id.lastIndexOf('/')+1;
        var end = id.length;
        // set values
        this.videoId = id.substring(start, end);
        this.entry = entry; // give access to the entry itself
        this.title = entry.title.$t;
        try{ this.updated = entry.updated.$t; }catch(e){ unavail.push("updated"); }
        try{ this.thumbs = entry.media$group.media$thumbnail; }catch(e){ unavail.push("thumbs"); }
        try{ this.duration = entry.media$group.yt$duration.seconds; }catch(e){ unavail.push("duration"); }
        try{ this.favCount = entry.yt$statistics.favoriteCount; }catch(e){ unavail.push("favCount"); }
        try{ this.rating = entry.gd$rating; }catch(e){ alert(e); unavail.push("rating"); }
        try{ this.viewCount = entry.yt$statistics.viewCount; }catch(e){ unavail.push("viewCount"); }
        try{ this.category = entry.media$group.media$category[0].$t; }catch(e){ unavail.push("category"); }
        try{ this.categoryLabel = entry.media$group.media$category[0].label; }catch(e){ unavail.push("categoryLabel"); }
        try{ this.description = entry.media$group.media$description.$t; }catch(e){ unavail.push("description"); }
        try{ this.keywords = entry.media$group.media$keywords.$t; }catch(e){ unavail.push("keywords"); }
        this.unavailAttributes = unavail; // so that the user can tell if a value isnt available
    };

    return new f();

})(jQuery);




/*! jQuery TubePlayer - v1.1.6 - 2013-06-04
 * https://github.com/nirvanatikku/jQuery-TubePlayer-Plugin
 * Copyright (c) 2013 Nirvana Tikku; Licensed MIT */
(function(e){"use strict";function t(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=0|16*Math.random(),a="x"==e?t:8|3&t;return a.toString(16)})}var a=".tubeplayer",r="jquery-youtube-tubeplayer",n="opts"+a,o={inited:!1,ytplayers:{},inits:[],iframeScriptInited:!1,State:{UNSTARTED:-1,ENDED:0,PLAYING:1,PAUSED:2,BUFFERING:3,CUED:5},Error:{BAD_INIT:0,INVALID_PARAM:2,NOT_FOUND:100,NOT_EMBEDDABLE:101,CANT_PLAY:150}};e.tubeplayer={events:{},TubePlayer:o},e.tubeplayer.defaults={afterReady:function(){},stateChange:function(t){var a=this.onPlayer;return function(r){var n=e("#"+t).parent();switch("object"==typeof r&&(r=r.data),r){case o.State.UNSTARTED:return a.unstarted[t].call(n);case o.State.ENDED:return a.ended[t].call(n);case o.State.PLAYING:return a.playing[t].call(n);case o.State.PAUSED:return a.paused[t].call(n);case o.State.BUFFERING:return a.buffering[t].call(n);case o.State.CUED:return a.cued[t].call(n);default:return null}}},onError:function(t){var a=this.onErr;return function(r){var n=e("#"+t).parent();switch("object"==typeof r&&(r=r.data),r){case o.Error.BAD_INIT:case o.Error.INVALID_PARAM:return a.invalidParameter[t].call(n);case o.Error.NOT_FOUND:return a.notFound[t].call(n);case o.Error.NOT_EMBEDDABLE:case o.Error.CANT_PLAY:return a.notEmbeddable[t].call(n);default:return a.defaultError[t].call(n)}}},qualityChange:function(t){var a=this;return function(r){var n=e("#"+t).parent();return"object"==typeof r&&(r=r.data),a.onQualityChange[t].call(n,r)}},onQualityChange:{},onPlayer:{unstarted:{},ended:{},playing:{},paused:{},buffering:{},cued:{}},onErr:{defaultError:{},notFound:{},notEmbeddable:{},invalidParameter:{}}};var l={width:425,height:355,allowFullScreen:"true",initialVideo:"DkoeNLuMbcI",start:0,preferredQuality:"auto",showControls:!0,showRelated:!1,playsinline:!1,annotations:!0,autoPlay:!1,autoHide:!0,loop:0,theme:"dark",color:"red",showinfo:!1,modestbranding:!0,protocol:"http",wmode:"transparent",swfobjectURL:"ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js",loadSWFObject:!1,allowScriptAccess:"always",playerID:"tubeplayer-player-container",iframed:!0,onPlay:function(){},onPause:function(){},onStop:function(){},onSeek:function(){},onMute:function(){},onUnMute:function(){},onPlayerUnstarted:function(){},onPlayerEnded:function(){},onPlayerPlaying:function(){},onPlayerPaused:function(){},onPlayerBuffering:function(){},onPlayerCued:function(){},onQualityChange:function(){},onError:function(){},onErrorNotFound:function(){},onErrorNotEmbeddable:function(){},onErrorInvalidParameter:function(){}};e.fn.tubeplayer=function(t,r){var n=e(this),l=typeof t;return 0===arguments.length||"object"===l?n.each(function(){o.init(e(this),t)}):"string"===l?n.triggerHandler(t+a,r!==void 0?r:null):void 0};var i=function(e){return function(t,a){var r=o.getPkg(t);if(r.ytplayer){var n=e(t,a,r);return n===void 0&&(n=r.$player),n}return r.$player}};e.tubeplayer.getPlayers=function(){return o.ytplayers},o.init=function(i,d){if(i.hasClass(r))return i;var y=e.extend({},l,d);y.playerID+="-"+t(),i.addClass(r).data(n,y);for(var s in u)i.bind(s+a,i,u[s]);return o.initDefaults(e.tubeplayer.defaults,y),e("<div></div>").attr("id",y.playerID).appendTo(i),o.initPlayer(i,y),i},o.getPkg=function(e){var t=e.data,a=t.data(n),r=o.ytplayers[a.playerID];return{$player:t,opts:a,ytplayer:r}},o.iframeReady=function(t){return o.inits.push(function(){new YT.Player(t.playerID,{videoId:t.initialVideo,width:t.width,height:t.height,playerVars:{autoplay:t.autoPlay?1:0,autohide:t.autoHide?1:0,controls:t.showControls?1:0,loop:t.loop?1:0,playlist:t.loop?t.initialVideo:"",rel:t.showRelated?1:0,fs:t.allowFullScreen?1:0,wmode:t.wmode,showinfo:t.showinfo?1:0,modestbranding:t.modestbranding?1:0,iv_load_policy:t.annotations?1:3,start:t.start,theme:t.theme,color:t.color,playsinline:t.playsinline},events:{onReady:function(a){o.ytplayers[t.playerID]=a.target;var n=e(a.target.getIframe()).parents("."+r);e.tubeplayer.defaults.afterReady(n)},onPlaybackQualityChange:e.tubeplayer.defaults.qualityChange(t.playerID),onStateChange:e.tubeplayer.defaults.stateChange(t.playerID),onError:e.tubeplayer.defaults.onError(t.playerID)}})}),o.inits.length>=1&&!o.inited?function(){for(var e=0;o.inits.length>e;e++)o.inits[e]();o.inited=!0}:(o.inited&&o.inits.pop()(),window.onYouTubePlayerAPIReady)},o.initDefaults=function(e,t){var a=t.playerID,r=e.onPlayer;r.unstarted[a]=t.onPlayerUnstarted,r.ended[a]=t.onPlayerEnded,r.playing[a]=t.onPlayerPlaying,r.paused[a]=t.onPlayerPaused,r.buffering[a]=t.onPlayerBuffering,r.cued[a]=t.onPlayerCued,e.onQualityChange[a]=t.onQualityChange;var n=e.onErr;n.defaultError[a]=t.onError,n.notFound[a]=t.onErrorNotFound,n.notEmbeddable[a]=t.onErrorNotEmbeddable,n.invalidParameter[a]=t.onErrorInvalidParameter},o.initPlayer=function(e,t){t.iframed?o.initIframePlayer(e,t):o.initFlashPlayer(e,t)},o.initIframePlayer=function(e,t){if(!o.iframeScriptInited){var a=document.createElement("script");a.src=t.protocol+"://www.youtube.com/iframe_api";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r),o.iframeScriptInited=!0}window.onYouTubePlayerAPIReady=o.iframeReady(t)},o.initFlashPlayer=function(t,a){a.loadSWFObject?(a.swfobjectURL=a.swfobjectURL.replace("http://",""),a.swfobjectURL=a.swfobjectURL.replace("https://",""),a.swfobjectURL=a.protocol+"://"+a.swfobjectURL,e.getScript(a.swfobjectURL,o.init_flash_player(a))):o.init_flash_player(a)()},o.init_flash_player=function(t){return function(){if(!window.swfobject)return alert("YouTube Player couldn't be initialized. Please include swfobject."),void 0;var a=["//www.youtube.com/v/"];a.push(t.initialVideo),a.push("?&enablejsapi=1&version=3"),a.push("&playerapiid="+t.playerID),a.push("&rel="+(t.showRelated?1:0)),a.push("&autoplay="+(t.autoPlay?1:0)),a.push("&autohide="+(t.autoHide?1:0)),a.push("&loop="+(t.loop?1:0)),a.push("&playlist="+(t.loop?t.initialVideo:"")),a.push("&controls="+(t.showControls?1:0)),a.push("&showinfo="+(t.showinfo?1:0)),a.push("&modestbranding="+(t.modestbranding?1:0)),a.push("&iv_load_policy="+(t.annotations?1:3)),a.push("&start="+t.start),a.push("&theme="+t.theme),a.push("&color="+t.color),a.push("&playsinline="+t.playsinline),a.push("&fs="+(t.allowFullScreen?1:0)),window.swfobject.embedSWF(a.join(""),t.playerID,t.width,t.height,"8",null,null,{allowScriptAccess:t.allowScriptAccess,wmode:t.wmode,allowFullScreen:t.allowFullScreen},{id:t.playerID}),window.onYouTubePlayerReady=function(t){var a=document.getElementById(t),n=t.replace(/-/g,""),l=e.tubeplayer.defaults;e.tubeplayer.events[n]={stateChange:l.stateChange(t),error:l.onError(t),qualityChange:l.qualityChange(t)},a.addEventListener("onStateChange","$.tubeplayer.events."+n+".stateChange"),a.addEventListener("onError","$.tubeplayer.events."+n+".error"),a.addEventListener("onPlaybackQualityChange","$.tubeplayer.events."+n+".qualityChange"),o.ytplayers[t]=a;var i=e(a).parents("."+r);e.tubeplayer.defaults.afterReady(i)}}},o.getVideoIDFromURL=function(e){e=e||"";var t=e.indexOf("?"),a=e.substring(t,e.length),r=a.indexOf("v=");if(r>-1){var n=a.indexOf("&",r);return-1===n&&(n=a.length),a.substring(r+"v=".length,n)}return""};var u={opts:i(function(e,t,a){return a.opts}),cue:i(function(e,t,a){a.ytplayer.cueVideoById(t,0,a.opts.preferredQuality)}),play:i(function(e,t,a){"object"==typeof t?a.ytplayer.loadVideoById(t.id,t.time,a.opts.preferredQuality):t!==void 0?a.ytplayer.loadVideoById(t,0,a.opts.preferredQuality):a.ytplayer.playVideo(),a.opts.onPlay(t)}),pause:i(function(e,t,a){a.ytplayer.pauseVideo(),a.opts.onPause(a)}),stop:i(function(e,t,a){a.ytplayer.stopVideo(),a.opts.onStop(a)}),seek:i(function(e,t,a){if(/:/.test(t)){var r=t.split(":").reverse();t=0;for(var n=0;r.length>n;n++)t+=Math.pow(60,n)*(0|r[n])}a.ytplayer.seekTo(t,!0),a.opts.onSeek(t)}),mute:i(function(e,t,a){a.$player.attr("data-prev-mute-volume",a.ytplayer.getVolume()),a.ytplayer.mute(),a.opts.onMute(a)}),unmute:i(function(e,t,a){a.ytplayer.unMute(),a.ytplayer.setVolume(a.$player.attr("data-prev-mute-volume")||50),a.opts.onUnMute()}),isMuted:i(function(e,t,a){return a.ytplayer.isMuted()}),volume:i(function(e,t,a){return void 0===t?a.ytplayer.getVolume()||0:(a.ytplayer.setVolume(t),a.$player.attr("data-prev-mute-volume",a.ytplayer.getVolume()),void 0)}),quality:i(function(e,t,a){return void 0===t?a.ytplayer.getPlaybackQuality():(a.ytplayer.setPlaybackQuality(t),void 0)}),playbackRate:i(function(e,t,a){return void 0===t?a.ytplayer.getPlaybackRate():(a.ytplayer.setPlaybackRate(t),void 0)}),data:i(function(e,t,a){var r={},n=a.ytplayer;return r.videoLoadedFraction=n.getVideoLoadedFraction(),r.bytesLoaded=n.getVideoBytesLoaded(),r.bytesTotal=n.getVideoBytesTotal(),r.startBytes=n.getVideoStartBytes(),r.state=n.getPlayerState(),r.currentTime=n.getCurrentTime(),r.duration=n.getDuration(),r.videoURL=n.getVideoUrl(),r.videoEmbedCode=n.getVideoEmbedCode(),r.videoID=o.getVideoIDFromURL(r.videoURL),r.availableQualityLevels=n.getAvailableQualityLevels(),r.availablePlaybackRates=n.getAvailablePlaybackRates(),r}),videoId:i(function(e,t,a){return o.getVideoIDFromURL(a.ytplayer.getVideoUrl())}),size:i(function(t,a,r){a!==void 0&&a.width&&a.height&&(r.ytplayer.setSize(a.width,a.height),e(r.ytplayer).css(a))}),destroy:i(function(t,l,i){i.$player.removeClass(r).data(n,null).unbind(a).html(""),delete o.ytplayers[i.opts.playerID];var u=e.tubeplayer.defaults,d=["unstarted","ended","playing","paused","buffering","cued"];return e.each(d,function(e,t){delete u.onPlayer[t][i.opts.playerID]}),d=["defaultError","notFound","notEmbeddable","invalidParameter"],e.each(d,function(e,t){delete u.onErr[t][i.opts.playerID]}),delete u.onQualityChange[i.opts.playerID],delete e.tubeplayer.events[i.opts.playerID],"destroy"in i.ytplayer&&i.ytplayer.destroy(),e(i.ytplayer).remove(),null}),player:i(function(e,t,a){return a.ytplayer})}})(jQuery);