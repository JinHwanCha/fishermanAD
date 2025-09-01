$(function(){
	$(".intro .s1").delay(1000).animate({opacity:0.9}, 500, "swing"
				, function(){
	$(".intro .s2").delay(1000).animate({opacity:0.85}, 500, "swing"
				, function(){
	$(".intro .s3").delay(1000).animate({opacity:0.9}, 500, "swing"
				, function(){
	$(".intro .s4").delay(1000).animate({opacity:0.9}, 500, "swing"
				, function(){
			});
			});
	});
	});

	$(".nav li").on("click",function(){
		$(".nav li").removeClass("on");
		$("article").removeClass("on");
		$("article h2").removeClass("on");
		$("span").animate().stop().css({opacity:'0'});

	});


	$(".nav li:nth-child(1)").on("click",function(){
		$(this).addClass("on");
		$(".intro").addClass("on");
		$("header").css({background:'crimson'});
		$(".intro .s1").delay(500).animate({opacity:0.9}, 500, "swing"
			, function(){
		$(".intro .s2").delay(500).animate({opacity:0.85}, 500, "swing"
			, function(){
		$(".intro .s3").delay(1000).animate({opacity:0.9}, 500, "swing"
			, function(){
		$(".intro .s4").delay(1000).animate({opacity:0.9}, 500, "swing"
			, function(){
			});
			});
		});
		});
		
		});

		

	$(".nav li:nth-child(2)").on("click",function(){
		$(this).addClass("on");
		$(".direction").addClass("on");
		$("header").css({background:'slategray'});
		$(".direction .s1").delay(500).animate({opacity:0.9}, 500, "swing"
			, function(){
		$(".direction .s2").delay(500).animate({opacity:0.85}, 500, "swing"
			, function(){
		$(".direction .s3").delay(1000).animate({opacity:0.9}, 500, "swing"
			, function(){
		$(".direction .s4").delay(1000).animate({opacity:0.9}, 500, "swing"
			, function(){
			});
			});
		});
		});
		
		});

	$(".nav li:nth-child(3)").on("click",function(){
		$(this).addClass("on");
		$(".time").addClass("on");
		$("header").css({background:'silver'});
		$(".time .s1").delay(500).animate({opacity:0.9}, 500, "swing"
			, function(){
		$(".time .s2").delay(500).animate({opacity:0.85}, 500, "swing"
			, function(){
		$(".time .s3").delay(1000).animate({opacity:0.9}, 500, "swing"
			, function(){
		$(".time .s4").delay(1000).animate({opacity:0.9}, 500, "swing"
			, function(){
			});
			});
		});
		});
		
		});

	$(".menu li").on("click",function(){
		$("span").animate().stop();
		$("span").css({opacity:'0'});
	});



	$(".menu li:nth-child(2)").on("click",function(){
		$(this).siblings().removeClass("on");
		$(this).toggleClass("on");
		$(".work,.contact").removeClass("on");
		$("article h2").removeClass("on");
		$(".mystory").toggleClass("on");
	});

	$(".menu li:nth-child(3)").on("click",function(){
		$(this).siblings().removeClass("on");
		$(this).toggleClass("on");
		$(".mystory,.contact").removeClass("on");
		$("article h2").removeClass("on");
		$(".work").toggleClass("on");
	});

	$(".menu li:nth-child(4)").on("click",function(){
		$(this).siblings().removeClass("on");
		$(this).toggleClass("on");
		$(".mystory,.work").removeClass("on");
		$("article h2").removeClass("on");
		$(".contact").toggleClass("on");
	});



});