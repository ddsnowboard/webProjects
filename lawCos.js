/* TODO: Make a visual representation of the triangle, perhaps that you can click and drag on to change the numbers in the boxes. EDIT: Done! */

//This function switches degrees to radians. The opposite
//is done manually because I'm lazy.
lastChanged = '';
var radians = function (x) {
	return x * (Math.PI / 180);
};
//This is the quadratic formula.
var quad = function (g, e, f) {
	return (-e + Math.sqrt(Math.pow(e, 2) - 4 * g * f)) / (2 * g);
};
//This function either takes a radian input and puts it in degrees to pass to lawOfCosines(), when the "direction"
//parameter is "in", or takes a degree measurement and
//puts it in fractional, easy to read radians measure
//with pi, for reading by humans, if the "direction" parameter is "out"
function parseRadians(x, direction) {
	//This is how far we are willing to deviate from the exact radian measure when kicking out a fraction. 0.01 seems to work ok.
	var tolerance = 0.01;
	if (!(x && direction)) {
		return;
	}
	if (direction === 'out') {
		x = radians(x);
		//For every fraction of form 1/x, where 1<x<9, inclusive, divide the radian measure by that to see if it's a round number,
		//meaning that's the correct fraction to show it.
		for (var i = 1; i <= 10; i++) {
			if (Math.abs(x / (Math.PI / i)) % 1 < tolerance) {
				//This prevents "1/1π"
				if (i === 1) {
					return ((x / Math.PI).toFixed().toString() + 'π');
				} else {
					return ((x / (Math.PI / i)).toFixed().toString() + '/' + i.toString() + 'π');
				}
			}
		}
		//If it's not a round number, just give straight raidans.
		return x;
	} else if (direction === 'in') {
		if (x === 'π') {
			return 180;
		}
		// Search returns -1 if the terms is absent, so if this is not -1, we know there was a pi.
		var pi = x.search('π');
		var newX = '';

		//This makes a new array that is the given string (x) sans π's. We remember if the original string had one with the variable pi,
		//and multiply at the end. These two for loops could be consolidated into one, really. EDIT: Done!
		for (var j = 0; j < x.length; j++) {
			if (x[j] !== 'π') {
				newX = newX + x[j];
			}
		}
		var slash = newX.search('/');
		//If they used a "π/x" notation, without a coefficient on π, then this puts a one as a placeholder, since the coefficient was
		//technically one in the first place.
		if (slash === 0) {
			newX = '1' + newX;
			slash = 1;
		}
		var num;
		// If there's no slash, that's the number, just make it a int and go.
		if (slash === -1) {
			num = parseInt(newX, 10);
		}
		if (slash !== -1) {
			//Divide numbers before slash by numbers after slash.
			num = parseInt(newX.substring(0, slash), 10) / parseInt(newX.substring(slash + 1), 10);
		}
		//search() returns -1 if it can't find anything, so this only runs if there is a pi in the given. Same as above.
		if (pi !== -1) {
			num = num * Math.PI;
		}
		//Switch to degrees and return
		return num * (180 / Math.PI);
	}
}
function lawOfCosines(A, B, C, c) {
	//Find which one we're looking for. Whichever one is empty, that's the one we need to find. Turn all the others into int's
	// for math purposes.
	// Notice we return an array with quest as the [1] term, we use that later to put the answer in the right box.
	var quest;
	if (A === '') {
		quest = "A";
		lastChanged = "A";
	}
	else if (B === '') {
		quest = "B";
		lastChanged = "B";
	}
	else if (C === '') {
		quest = "C";
		lastChanged = "C";
	}
	else if (c === '') {
		quest = "c";
		lastChanged = 'c';
	}
	else {
		quest = lastChanged;
	}
	
	switch (quest){
		case "A":
		B = parseFloat(B);
		C = parseFloat(C);
		c = parseFloat(c);
		A = 0.0;
		return [Math.round(100 * (quad(1, -1 * (2 * B * Math.cos(radians(c))), Math.pow(B, 2) - Math.pow(C, 2)))) / 100, quest];
		case "B":
		A = parseFloat(A);
		C = parseFloat(C);
		c = parseFloat(c);
		B = 0.0;
		return [Math.round(100 * (quad(1, -1 * (2 * A * Math.cos(radians(c))), Math.pow(A, 2) - Math.pow(C, 2)))) / 100, quest];
		case "C":
		A = parseFloat(A);
		B = parseFloat(B);
		c = parseFloat(c);
		C = 0.0;
		return [Math.round(100 * (Math.sqrt((Math.pow(A, 2) + Math.pow(B, 2)) - (2 * A * B * Math.cos(radians(c)))))) / 100, quest];
		case 'c':
		A = parseFloat(A);
		B = parseFloat(B);
		C = parseFloat(C);
		c = 0.0;
		return [Math.round(100 * (Math.acos((Math.pow(C, 2) - ((Math.pow(A, 2) + Math.pow(B, 2)))) / (-2 * A * B))) * (180 / Math.PI)) / 100, quest];
	}
}
function drawTriangle(A, B, C, c) {
	// Pretty pictures!
	// https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial/Drawing_shapes
	var canvas = document.getElementById('triangle');
	var context = canvas.getContext("2d");
	context.clearRect(0,0,canvas.width, canvas.height);
	if (!(A && B && C && c)) {
		return;
	}
	var origA = A;
	var origB = B;
	var origC = C; 
	var origc = c;
	($('input:radio[name=degrees]:checked').val() === 'radians') ? origc+=" rad" : origc+="°";
	if ($('input:radio[name=degrees]:checked').val() === 'radians') {
		c=parseRadians(c, 'in')*(Math.PI/180);
	} else {
		c=parseFloat(c)*(Math.PI/180);
	}
	A = parseFloat(A);
	B = parseFloat(B);
	C = parseFloat(C);
	while (!(A>450 || B>450 || C>450)) {
		A*=1.1;
		B*=1.1;
		C*=1.1;
	}
	while (!(A<500 && B<500 && C<500)) {
		A*=0.9;
		B*=0.9;
		C*=0.9;
	}
	// Make sure to account for positive cosines. EDIT: Done
	// So, I'm trying to get it to label the lines with their length. The theory is that you get the middle of the line, that's the first part, before "/2" 
	// and then add a bit so it's not on the line, that's the 10*the sine of the perpendicular line's angle. So that works. 2 things to do: make this code look less
	// failed-Ballmer-peak, and set it up so that the distance the number is from the angle is perportional to the angle such that very small angles push it out 
	// more so it doesn't intersect with the lines. Which it should do automatically with lines, but it sometimes doesn't. Hmmm...
	// Also, print the proper unit with the angle measurement. 
	context.font = "10pt Arial";
	var xOffset;
	var yOffset = 5+(B*Math.sin(c));
	(Math.cos(c)>=0) ? xOffset = 0 : xOffset = -(B*Math.cos(c));
	var textX = Math.floor(((xOffset+5+xOffset+5+(B*Math.cos(c)))/2)+10*Math.cos(Math.atan(-(((xOffset+5)-((xOffset+5)+B*Math.cos(c)))/((yOffset)-(yOffset-(B*Math.sin(c))))))));
	var textY = Math.floor((yOffset+yOffset-(B*Math.sin(c)))/2+10*Math.sin(Math.atan(-(((xOffset+5)-((xOffset+5)+B*Math.cos(c)))/((yOffset)-(yOffset-(B*Math.sin(c))))))));
	context.fillText(origB, textX, textY);
	textX = Math.floor(((xOffset+5+xOffset+A+5))/2);
	textY = Math.floor(yOffset-10);
	context.fillText(origA, textX, textY);
	textX = Math.floor(((xOffset+A+5+xOffset+5+(B*Math.cos(c)))/2)-20*Math.cos(Math.atan(-(((xOffset+A+5)-(xOffset+5+(B*Math.cos(c)))))/((yOffset)-(yOffset-(B*Math.sin(c)))))));
	textY = Math.floor((yOffset+yOffset-(B*Math.sin(c)))/2-20*Math.sin(Math.atan(-(((xOffset+5)-((xOffset+5)+B*Math.cos(c)))/((yOffset)-(yOffset-(B*Math.sin(c))))))));xOffset+5
	context.fillText(origC, textX, textY);
	console.log(c);
	console.log(c<0.523);
	if (c<0.7) {
		textX = (xOffset+5)+50*Math.cos(c/2);
		textY = yOffset-50*Math.sin(c/2);
	}
	else {
		textX = (xOffset+5)+18*Math.cos(c/2);
		textY = yOffset-18*Math.sin(c/2);
	}
	context.fillText(origc, textX, textY);
	context.beginPath();
	context.moveTo(xOffset+5,yOffset);
	context.lineTo((xOffset+5)+B*Math.cos(c),yOffset-(B*Math.sin(c)));
	context.moveTo(xOffset+5,yOffset);
	context.lineTo(xOffset+A+5,yOffset);
	context.lineTo((xOffset+5)+B*Math.cos(c),yOffset-(B*Math.sin(c)));
	context.stroke();
	$("#triangle").drawArc({
		fillStyle: "grey",
		x: xOffset+5, y: yOffset,
		radius: 15
	});
}
$(document).ready(function () {
	// Which radio button you've chosen. Defaults to degrees.
	var choice = 'degrees';
	// This is used by two functions, so I declare it out here. It is where the cursor is in the box, when we need it.
	var spot = 0;
	var submit = $("#submit");
	var clear = $('#clear');
	var pi = $('#pi');
	
	pi.mousedown(function () {
		if ($("#smallc").is(":focus")) {
			spot = $("#smallc").caret();
			//Inserts pi at cursor in smallc, if
			//applicable.
			$("#smallc").val($("#smallc").val().substr(0, $("#smallc").caret()) + 'π' + $("#smallc").val().substr($("#smallc").caret()));
		} else {
			$("#smallc").val($("#smallc").val() + 'π');
		}
	});
	pi.mouseup(function () {
		$("#smallc").focus();
		$("#smallc").caret(spot + 1);
	});
	
	clear.mousedown(function () {
		$("#A").val('');
		$("#B").val('');
		$("#C").val('');
		$("#smallc").val('');
		var canvas = document.getElementById('triangle');
		canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height);
	});
	submit.mousedown(function () {
		var smallc = $("#smallc").val();
		//If we're in radians mode and smallc is filled, change to degrees with parseRadians.
		if ($('input:radio[name=degrees]:checked').val() === 'radians' && smallc.length !== 0) {
			smallc = parseRadians(smallc, 'in');
		}
		var ans = lawOfCosines($("#A").val(), $("#B").val(), $("#C").val(), smallc);
		//This is where we use the other part of the result array.
		// ans[1] will be A, B, C, or c, and this way is less repititious than the switch I had before. 
		if (ans[1]==='c') {
			//Make it radians if we need to.
			if ($('input:radio[name=degrees]:checked').val() === 'radians') {
				$('#smallc').val(parseRadians(ans[0], 'out'));
			} else {
				$('#smallc').val(ans[0]);
			}
		}
		else {
			$("#"+ans[1]).val(ans[0]);
		}
		drawTriangle($("#A").val(), $("#B").val(), $("#C").val(), $("#smallc").val());
	});
	$(".box").keydown(function(event) {
		//13 is enter, so if we press enter anywhere, it will submit. It even changes the look as if you clicked it, which I always liked.
		if (event.which === 13) {
			submit.mousedown();
		}
	});
	$(".box").keyup(function(event) {
		if (event.which === 13) {
			submit.removeClass('down');
		}
	});
	$('#degrees').click(function () {
		$("#pi").css('visibility', 'hidden');
		//If we were in radians and we switch, and there was something in smallc, switch it to degrees.
		if (choice === 'radians') {
			if ($("#smallc").val() !== '') {
				$('#smallc').val(Math.round(100 * parseRadians($('#smallc').val(), 'in')) / 100);
			}
		}
		choice = 'degrees';
	});
	$("#radians").click(function () {
		$("#pi").css("visibility", "visible");
		//Same as above.
		if (choice === 'degrees') {
			if ($("#smallc").val() !== '') {
				$('#smallc').val(parseRadians($('#smallc').val(), 'out'));
			}
		}
		choice = 'radians';
	});
	//If you type p, it changes to π automatically.
	$("#smallc").keyup(function (event) {
		if (event.which === 80) {
			var text = $("#smallc").val();
			var spot = $("#smallc").caret();
			$("#smallc").val(text.replace('p', 'π'));
			//Puts cursor back where it was before.
			$("#smallc").caret(spot);
		}
	});
});