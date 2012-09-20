// Setup Video
var		video = document.querySelector('video'),
		time_dump = document.getElementById("elapsed_time"),
		glasses = new Image(),
		canvas = document.getElementById("output"),
		ctx = canvas.getContext("2d");
		glasses.src = "i/glasses.png";
		
var data = new Array();
		

function html5glasses() {
	// Start the clock 
	var elapsed_time = (new Date()).getTime();

	var timestamp = Math.round(video.currentTime*1000);
	// Draw the video to canvas
	//console.log(video.videoWidth + " " +  video.videoHeight + " " + canvas.width + " " + canvas.height);
	ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);
	

	// use the face detection library to find the face
	var comp = ccv.detect_objects({ "canvas" : (ccv.pre(canvas)),
									"cascade" : cascade,
									"interval" : 4,
									"min_neighbors" : 1 });
									

	// Stop the clock
	time_dump.innerHTML = "Process time : " + ((new Date()).getTime() - elapsed_time).toString() + "ms";

	// Draw glasses on everyone!
	for (var i = 0; i < comp.length; i++) {

		saveData(i,timestamp,comp[i].x/canvas.width,comp[i].y/canvas.height,comp[i].width/canvas.width,comp[i].height/canvas.height);
		ctx.drawImage(glasses, comp[i].x, comp[i].y,comp[i].width, comp[i].height);
	}
}

function saveData(objID, timestamp,x,y,xd,yd) {
		console.log(objID + " " + timestamp + " " + x + " " + y + " " + xd + " "+ yd);
		
		if (data[objID] == null){
			var newObject = {
				"Name" : "Neues Objekt"+(objID+1),
				"KeyFrames" : new Array()
			};
			data[objID] = newObject;
			console.log(data[objID]);
		} 
		var newTimestamp = {
			"Time" : timestamp,
			"Point" : [
				{"X":x,"Y":y},
				{"X":x+xd,"Y":y},
				{"X":x+xd,"Y":y+yd},
				{"X":x,"Y":y+yd}
			]
		};
		data[objID].KeyFrames.push(newTimestamp);
			
		
}
		
/* Events */ 

video.addEventListener('play', function() {
	video.playbackRate = 5;
	video.style.display = "none";
	canvas.style.display = "none";
	vidInterval = setInterval(html5glasses, 200); 
});

video.addEventListener('ended', function() {
	clearInterval(vidInterval);
	time_dump.innerHTML = "finished";
	console.log(data);
});