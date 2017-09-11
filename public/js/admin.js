function addAudioIsAlbum(){
	var name = $('#musicname')[0].files[0]
	var album = $("#audioAlbuums").val();

	console.log(name);
	console.log(album);
	$.post('/addalbum', {name: name.name, album: album}, function(data){
		console.log(data);
	})
}


$("#sendAudio").click(function(){
	addAudioIsAlbum();
});

$("#addalbum").click(function(){
	var name = $('#albumname').val();
	$.post('/addnewalbum', {name: name}, function(data){
		console.log(data);
	})
});

$(".btndelete").click(function(){
	var index = $('.btndelete').index(this);
	var name = $('.newsname:eq('+index+')').html();
	$.post('/deletenews', {name: name}, function(data){
		if(data === "good"){
			alert("Новость удалена");
			$(".news-c-block:eq("+index+")").remove();
		}
	})
});

$(".btn-album-delete").click(function(){
	var index = $(".btn-album-delete").index(this);
	var name = $('.album-name:eq('+index+')').html();

	$.post('/deletealbums', {name: name}, function(data){
		if(data === "good"){
			alert("Альбом удален!");
			$(".album-block:eq("+index+")").remove();
		}
	})

});

$(".btn-audio-delete").click(function(){
	var index = $(".btn-audio-delete").index(this);
	var name = $('.audio-name:eq('+index+')').html();

	$.post('/deleteaudio', {name: name}, function(data){
		if(data === "good"){
			alert("Трек удален!");
			$(".audio-block:eq("+index+")").remove();
		}
	})

});

$("#exitaccaunt").click(function(){
	document.location.href = "/";
})


