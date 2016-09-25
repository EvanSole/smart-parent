// handle sidebar link click
$('.page-sidebar-menu').on('click', 'li > a.nav-toggle, li > a > span.nav-toggle', function (e) {
    console.log(" ---handleSidebarMenu--- "); 
    var that = $(this).closest('.nav-item').children('.nav-link');

    var hasSubMenu = that.next().hasClass('sub-menu');

    var parent =that.parent().parent();
    var the = that;
    var menu = $('.page-sidebar-menu');
    var sub = that.next();

    var autoScroll = menu.data("auto-scroll");
    var slideSpeed = parseInt(menu.data("slide-speed"));
    var keepExpand = menu.data("keep-expanded");
    
    if (!keepExpand) {
        parent.children('li.open').children('a').children('.arrow').removeClass('open');
        parent.children('li.open').children('.sub-menu:not(.always-open)').slideUp(slideSpeed);
        parent.children('li.open').removeClass('open');
    }

    var slideOffeset = -200;

    if (sub.is(":visible")) {
        $('.arrow', the).removeClass("open");
        the.parent().removeClass("open");
        sub.slideUp(slideSpeed, function () {
            if (autoScroll === true && $('body').hasClass('page-sidebar-closed') === false) {
                if ($('body').hasClass('page-sidebar-fixed')) {
                    menu.slimScroll({
                        'scrollTo': (the.position()).top
                    });
                } else {
                    App.scrollTo(the, slideOffeset);
                }
            }
        });
    } else if (hasSubMenu) {
        $('.arrow', the).addClass("open");
        the.parent().addClass("open");
        sub.slideDown(slideSpeed, function () {
            if (autoScroll === true && $('body').hasClass('page-sidebar-closed') === false) {
                if ($('body').hasClass('page-sidebar-fixed')) {
                    menu.slimScroll({
                        'scrollTo': (the.position()).top
                    });
                } else {
                    App.scrollTo(the, slideOffeset);
                }
            }
        });
    }

    e.preventDefault();
});