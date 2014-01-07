/**
 * Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 1.4.7
 */
(function(d){function h(b){return"object"==typeof b?b:{top:b,left:b}}var n=d.scrollTo=function(b,c,a){return d(window).scrollTo(b,c,a)};n.defaults={axis:"xy",duration:1.3<=parseFloat(d.fn.jquery)?0:1,limit:!0};n.window=function(b){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){if(this.nodeName&&-1==d.inArray(this.nodeName.toLowerCase(),["iframe","#document","html","body"]))return this;var b=(this.contentWindow||this).document||this.ownerDocument||this;return/webkit/i.test(navigator.userAgent)|| "BackCompat"==b.compatMode?b.body:b.documentElement})};d.fn.scrollTo=function(b,c,a){"object"==typeof c&&(a=c,c=0);"function"==typeof a&&(a={onAfter:a});"max"==b&&(b=9E9);a=d.extend({},n.defaults,a);c=c||a.duration;a.queue=a.queue&&1<a.axis.length;a.queue&&(c/=2);a.offset=h(a.offset);a.over=h(a.over);return this._scrollable().each(function(){function q(b){k.animate(e,c,a.easing,b&&function(){b.call(this,g,a)})}if(null!=b){var l=this,k=d(l),g=b,p,e={},s=k.is("html,body");switch(typeof g){case "number":case "string":if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(g)){g= h(g);break}g=d(g,this);if(!g.length)return;case "object":if(g.is||g.style)p=(g=d(g)).offset()}d.each(a.axis.split(""),function(b,d){var c="x"==d?"Left":"Top",m=c.toLowerCase(),f="scroll"+c,h=l[f],r=n.max(l,d);p?(e[f]=p[m]+(s?0:h-k.offset()[m]),a.margin&&(e[f]-=parseInt(g.css("margin"+c))||0,e[f]-=parseInt(g.css("border"+c+"Width"))||0),e[f]+=a.offset[m]||0,a.over[m]&&(e[f]+=g["x"==d?"width":"height"]()*a.over[m])):(c=g[m],e[f]=c.slice&&"%"==c.slice(-1)?parseFloat(c)/100*r:c);a.limit&&/^\d+$/.test(e[f])&& (e[f]=0>=e[f]?0:Math.min(e[f],r));!b&&a.queue&&(h!=e[f]&&q(a.onAfterFirst),delete e[f])});q(a.onAfter)}}).end()};n.max=function(b,c){var a="x"==c?"Width":"Height",h="scroll"+a;if(!d(b).is("html,body"))return b[h]-d(b)[a.toLowerCase()]();var a="client"+a,l=b.ownerDocument.documentElement,k=b.ownerDocument.body;return Math.max(l[h],k[h])-Math.min(l[a],k[a])}})(jQuery);