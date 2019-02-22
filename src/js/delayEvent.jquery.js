(function($) {
    $.fn.onDelay = function(event, action, delay = 100) {
        let scrollTimer;
	    this.each(function() {
	        $(this).on(event, function() {
	            clearTimeout(scrollTimer);
	            scrollTimer = setTimeout(action, delay);
	        });
	    });
        return this;
    };
})(jQuery);