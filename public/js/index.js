var sc = 1;
var Loc = location.href;

window.onload = function(){
	var w = $(document).width();
 	var form = (parseInt(w) / 6.5);
	$('.head-menu-btn:eq(2)').css({'margin-right': form+'px'});
	$('.head-menu-btn:eq(3)').css({'margin-left': form+'px'});
	size();
	
	$.post(Loc + "instagram", function (data){
		console.log(data);
	});
	
}

/*gallery*/
function galdata (){
	var imgclass = document.getElementsByClassName('gal-img-block')[0];
	var img = imgclass.getElementsByTagName('img')[0];
	var a = (img.src).substr(0, (img.src).length - 4)
	var b = a.slice(-1);
	return b;
}

setInterval(function() { 
	var imgarr = 4; //менять значение по количевству изображений
	if (parseInt(galdata()) < (parseInt(imgarr) - 1)) {
		$( ".nav-point:eq("+(parseInt(galdata())) +")" ).removeClass( "check" );
		document.getElementsByClassName('nav-point')[(parseInt(galdata())+1)].className += ' check';
		$('.gal-img-block img').attr("src",'image/gallery/'+(parseInt(galdata())+1)+'.jpg');
	}
	else{
		$( ".nav-point:eq(3)" ).removeClass( "check" );
		document.getElementsByClassName('nav-point')[0].className += ' check';
		$('.gal-img-block img').attr("src",'image/gallery/'+'0'+'.jpg');
	}
}, 8000);

function next(ind){
	index = $(".nav-point").index(ind);
	$( ".nav-point:eq("+ (parseInt(galdata())) +")" ).removeClass( "check" );
	document.getElementsByClassName('nav-point')[parseInt(index)].className += ' check';
	$('.gal-img-block img').attr("src",'image/gallery/'+index+'.jpg');
}

function prew(){
	if((parseInt(galdata())) === 0){
		var ind = 3
	}else{
		var ind = (parseInt(galdata())-1);
	}
	$( ".nav-point:eq("+ (parseInt(galdata())) +")" ).removeClass( "check" );
	document.getElementsByClassName('nav-point')[parseInt(ind)].className += ' check';
	$('.gal-img-block img').attr("src",'image/gallery/'+ind+'.jpg');
}

function to(){
	if((parseInt(galdata())) === 3){ //менять значение по количевству изображений
		var ind = 0
	}else{
		var ind = (parseInt(galdata())+1);
	}
	$( ".nav-point:eq("+ (parseInt(galdata())) +")" ).removeClass( "check" );
	document.getElementsByClassName('nav-point')[parseInt(ind)].className += ' check';
	$('.gal-img-block img').attr("src",'image/gallery/'+ind+'.jpg');
}


$(document).ready(function () {	
    $('#open-mob-menu').click(function () {
        $('#navigation').fadeToggle(100);
        switch (sc){
        	case 1: $("body").css("overflow-y","hidden"); sc += 1;  break
        	case 2: $("body").css("overflow-y","scroll"); sc = 1; break
        } 
    });

    $("#point-mini-menu").on("click","a", function (event) {
		event.preventDefault();
		var id  = $(this).attr('href'),
			top = $(id).offset().top;
		$('body,html').animate({scrollTop: top}, 500);
		$("body").css("overflow-y","scroll");
		sc = 1;
		$("#navigation").hide(100);
	});

	$("#scroll-menu-block").on("click","a", function (event) {
		event.preventDefault();
		var id  = $(this).attr('href'),
			top = $(id).offset().top;
		$('body,html').animate({scrollTop: top}, 500);
	});	

	$("#head-last-menu").on("click","a", function (event) {
		event.preventDefault();
		var id  = $(this).attr('href'),
			top = $(id).offset().top;
		$('body,html').animate({scrollTop: top}, 500);
	});	
});


function size (){
 	var scrolled = window.pageYOffset || document.documentElement.scrollTop; //получаем координаты скролла
 	var w = $(window).width();
 	var h = $(window).height();

	var form = (parseInt(w) / 6.5);
	var widthtvideo = (w / 1.3);
	var heightvideo = (widthtvideo / 1.5);

	$('.block-video').width(widthtvideo);
	$('.block-video').height(heightvideo);	
	$('.block-video').css({'max-width': '600px','max-height':'400px'});
	
	 	$('.head-menu-btn:eq(2)').css({'margin-right': form+'px'});
		$('.head-menu-btn:eq(3)').css({'margin-left': form+'px'});

 	if(parseInt(w) < 768 || parseInt(scrolled) < 1000){
 		$('#block-by-scroll-menu').hide();
 	}else{
 		$('#block-by-scroll-menu').show();
 	} 
 	
 	$("#navigation").width(w);


		$('#back-photo').css({'width': w+'px'});
		$('#back-photo').css({'height': h+'px'});

	var news = $('#news-block').width();
	$('#news-block').css({'margin-left': ((w-news)/2)+'px'});
	$('#about-content').css({'margin-left': ((w-news)/2)+'px'});
	$('#mms-dio').css({'margin-left': ((w-news)/2)+'px'});
	$('#follow-block').css({'margin-left': ((w-news)/2)+'px'});
	//$('#video-content').css({'margin-left': ((w-news)/2)+'px'});



	var mmsdio = $('#mms-dio').width();
	if(parseInt(w) > 768){
		$('.play-r-block').css({'width': (mmsdio - 420) +'px'});
	}else{
		$('.play-r-block').css({'width': '100%'});
	}


	$('#preload').css({'display': 'none'});


	var wows = $(".insta-content").width();

	var snill = (wows / 3) - 3;
	$(".insta-content img").attr("width", snill);
	var twovideo;
	if(heightvideo > 550 || $("#video").height < 700){
		twovideo = heightvideo;
		console.log("меньше" + twovideo);
		$("#video").height($(".title-h").height() + $(".ab-title").height() + twovideo);
		$(".block-video:eq(1)").css({"top": $(".title-h").height() + $(".ab-title").height() + 90});
	}else{		
		twovideo = heightvideo + 120;
		console.log("больше" + twovideo);
		$("#video").height($(".title-h").height() + $(".ab-title").height() + twovideo);
		$(".block-video:eq(1)").css({"top": $(".title-h").height() + $(".ab-title").height() + 90});
	}

	
}

$(window).resize(function(){
 	size();
});
 
 window.onscroll = function() {
 	var scrolled = window.pageYOffset || document.documentElement.scrollTop; //получаем координаты скролла
	var w = $(document).width();
	var h = $(window).height();

		if (parseInt(w) < 768 || parseInt(scrolled) < 1000) {
				$('#block-by-scroll-menu').hide();
		}else{
				$('#block-by-scroll-menu').show();
		}


}
function newspos(res){
	var scroll =  $('#news-scr-content').scrollLeft();
	var blocksize = $('.news-c').width();

	switch (res.id){
		case 'news-to': $('#news-scr-content').scrollLeft(scroll + blocksize + 10); break
		case 'news-prew': $('#news-scr-content').scrollLeft(scroll - blocksize - 10); break
	}
}



//обработчики событий
$('#playAudio').click(function(){
	switch (ObjPlayer.pp){
		case 0: $("#playAudio").css("background-image","url(image/play.png)"); ObjPlayer.pp = 1; break
		case 1: $("#playAudio").css("background-image","url(image/pause.png)"); ObjPlayer.pp = 0; break
	} 

	if (ObjPlayer.playing === false) {
		if(ObjPlayer.currenttrack){
			playaudio(ObjPlayer.currenttrack);
		}else{
			playaudio(ObjPlayer.trackList[0],0);
		}    
	}else{
		switch (ObjPlayer.pp){
			case 0: audioparams(4); break
			case 1: audioparams(3); break
		} 	
	}
});

$('#stop').click(function(){
	stopaudio();
	ObjPlayer.pp = 1;	
	$("#playAudio").css("background-image","url(image/play.png)"); 
});

$('#next').click(function(){
	next_prewAudio(0);
});

$('#prew').click(function(){
	next_prewAudio(1);
});


$('.tabs').dblclick(function(){
	var index = $('.tabs').index(this);
	ObjPlayer.currenttrack = $('.trackname:eq('+index+')').html();
	//$('.plays:eq('+index+')').attr('checked', true);	
	playaudio(ObjPlayer.currenttrack, index, 1);
		ObjPlayer.pp = 0;	
	$("#playAudio").css("background-image","url(image/pause.png)"); 

	info(ObjPlayer.currenttrack);

})

$('.tabs').click(function(){
	var index = $('.tabs').index(this);
	$('.plays:eq('+index+')').attr('checked', true);
	ObjPlayer.currenttrack = $('.trackname:eq('+index+')').html();
});


$(".open-a-panel").toggle(
	function(e){		
		$(".open-a-panel").text(">>");
		$(".auth-content").show(100);
	}, 
	function(e){
		$(".open-a-panel").text("<<");
		$(".auth-content").hide(100);
});	

function info(name){
	$.post('/audioinformation', {name: name}, function(data){

		$("#audio-names").html("Track name: " + JSON.parse(data)[0].musicname);
		$("#audio-album").html("Albums name: " + JSON.parse(data)[0].name);
		$("#audio-date").html("Realease date: " + JSON.parse(data)[0].dates);

	})
}


// $(".title-h").click(function(){
// var index = $(".title-h").index(this);
// 	switch(index){
// 		case 0: document.location.href = "http://facebook.com";break
// 		case 1: document.location.href = "http://google.com";break
// 	}
// })