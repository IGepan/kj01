define([
  'jquery',
  'nicescroll'
], function ($, nicescroll) {
  return {
    data: {
      jquery: $
    },
    mounted: function () {
      //			$(".leftbar .links strong").click(function() {
      //				$(this).parents(".links").toggleClass("active");
      //				setTimeout(function() {
      //					$(".leftbar").getNiceScroll().resize();
      //				}, 500);
      //			});

      // $(document).on("scroll", function() {
      // 	var lt = "";
      // 	var bt = $(document).scrollTop();
      // 	lt = $(".leftbox").position().top;
      // 	if(bt >= lt) {
      // 		$(".leftbar").css({
      // 			"position": "fixed",
      // 			"top": "0",
      // 			"paddingBottom": "105px"
      // 		});
      // 	} else {
      // 		$(".leftbar").css({
      // 			"position": "relative",
      // 			"top": "auto"
      // 		});
      // 	}
      // });
    }
  }
})
