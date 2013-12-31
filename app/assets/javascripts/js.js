/*global Sly */


jQuery(function ($) {

    var $dvd = $('#current');
    var $frame = $dvd.find('.frame'); window.frr = $frame;
    var sly = new Sly($frame, {
        horizontal: 1,
        itemNav: 'forceCentered',
        activateMiddle: 1,
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 10,
        scrollBar: $dvd.find('.scrollbar'),

        // Scrolling
        scrollSource: null, // Element for catching the mouse wheel scrolling. Default is FRAME.
        scrollBy:     0,

        pagesBar: $dvd.find('.pages'),
        activatePageOn: 'click',
        speed: 300,
        moveBy: 600,
        elasticBounds: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,

        // Buttons
        forward: $dvd.find('.forward'),
        backward: $dvd.find('.backward'),
        prev: $dvd.find('.prev'),
        next: $dvd.find('.next'),
        prevPage: $dvd.find('.prevPage'),
        nextPage: $dvd.find('.nextPage')
    }).init();

    // Method calling buttons
    $dvd.on('click', 'button[data-action]', function () {
        var action = $(this).data('action');

        switch (action) {
            case 'add':
                sly.add('<li>' + sly.items.length + '</li>');
                break;
            case 'remove':
                sly.remove(-1);
                break;
            default:
                sly[action]();
        }
    });
});

/*global Sly */


jQuery(function ($) {

    var $new = $('#new');
    var $newframe = $new.find('.frame'); window.nfrr = $newframe;
    var newsly = new Sly($newframe, {
        horizontal: 1,
        itemNav: 'forceCentered',
        activateMiddle: 1,
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 10,
        scrollBar: $new.find('.scrollbar'),
// Scrolling
        scrollSource: null, // Element for catching the mouse wheel scrolling. Default is FRAME.
        scrollBy:     0,           pagesBar: $new.find('.pages'),
        activatePageOn: 'click',
        speed: 300,
        moveBy: 600,
        elasticBounds: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,

        // Buttons
        forward: $new.find('.forward'),
        backward: $new.find('.backward'),
        prev: $new.find('.prev'),
        next: $new.find('.next'),
        prevPage: $new.find('.prevPage'),
        nextPage: $new.find('.nextPage')
    }).init();

    // Method calling buttons
    $new.on('click', 'button[data-action]', function () {
        var action = $(this).data('action');

        switch (action) {
            case 'add':
                newsly.add('<li>' + newsly.items.length + '</li>');
                break;
            case 'remove':
                newsly.remove(-1);
                break;
            default:
                newsly[action]();
        }
    });
});



jQuery(function ($) {

    var $upcoming = $('#upcoming');
    var $newframe = $upcoming.find('.frame'); window.nfrr = $newframe;
    var newsly = new Sly($newframe, {
        horizontal: 1,
        itemNav: 'forceCentered',
        activateMiddle: 1,
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 10,
        scrollBar: $upcoming.find('.scrollbar'),
// Scrolling
        scrollSource: null, // Element for catching the mouse wheel scrolling. Default is FRAME.
        scrollBy:     0,
        pagesBar: $upcoming.find('.pages'),
        activatePageOn: 'click',
        speed: 300,
        moveBy: 600,
        elasticBounds: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,

        // Buttons
        forward: $upcoming.find('.forward'),
        backward: $upcoming.find('.backward'),
        prev: $upcoming.find('.prev'),
        next: $upcoming.find('.next'),
        prevPage: $upcoming.find('.prevPage'),
        nextPage: $upcoming.find('.nextPage')
    }).init();

    // Method calling buttons
    $upcoming.on('click', 'button[data-action]', function () {
        var action = $(this).data('action');

        switch (action) {
            case 'add':
                newsly.add('<li>' + newsly.items.length + '</li>');
                break;
            case 'remove':
                newsly.remove(-1);
                break;
            default:
                newsly[action]();
        }
    });
});