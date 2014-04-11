jQuery.fn.extend({
	imagePreview: function() {
		var xOffset = 10,yOffset = 30;
		var imgpreview;
		var info = "%u6B63%u5728%u52A0%u8F7D%u9884%u89C8%u56FE...";
		var title;
		
		$(this).hover(function(e) {

			title = $(this).attr("title");
			$(this).attr("title", "");
			var _title = (title != undefined && title != "") ? "<br />" + title : "";
			imgpreview = $("<p id='imgpreview'><img src='" + $(this).attr("ref") + "' alt='" + unescape(info) + "' />" + _title + "</p>");
			$("body").append(imgpreview);
			imgpreview.css("top", top(e) + "px").css("left", (e.pageX + yOffset) + "px").fadeIn("fast");
			
		},
		function() {
			$(this).attr("title", title);
			imgpreview.remove();
			
		});
		$(this).mousemove(function(e) {
			$("#imgpreview").css("top", top(e) + "px").css("left", (e.pageX + yOffset) + "px")
		})
		function top(e){
			var Y = e.pageY - xOffset;
			if(($(window).height()-e.pageY) < $("#imgpreview").height()){
				Y -= $("#imgpreview").height();
			}
			return Y;
		}
	}
});