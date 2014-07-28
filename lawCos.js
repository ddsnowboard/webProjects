/* TODO: Make a visual representation of the triangle, perhaps that you can click and drag on to change the numbers in the boxes. EDIT: Done! */

//This function switches degrees to radians. The opposite is done manually because I'm lazy.

// I'M GETTING CLOSE, BUT IT STILL WON'T CHANGE THE UNITS OF THE ANGLE MEASURE WHEN I CLICK THE BUTTON.
// I'M GETTING THERE, THOUGH.
lastChanged = '';
moved = false;
var choice = 'degrees';
var scalar = 1;
var radians = function (x) {
	return x * (Math.PI / 180);
};
//This is the quadratic formula.
var quad = function (g, e, f) {
	return (-e + Math.sqrt(Math.pow(e, 2) - 4 * g * f)) / (2 * g);
};
var formatNum = function (n) {
	// Give it a number, and if it can, it'll make it an integer, otherwise, it gives it back to you.
	if (n.toFixed(2) % 1 == 0) {
		return parseInt(n, 10).toString();
	} else {
		return n.toFixed(2).toString();
	}
}

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
// When you give it the beginning x, beginning y, magnitude, and direction, it gives you where the text, should go.
// There ought to be one for lines below.
function textPosVec(x, y, m, d) {
	d = 90 - d;
	var endX = x + (m * Math.cos(d * (Math.PI / 180)));
	var endY = y + (m * Math.sin(d * (Math.PI / 180)));
	var midX = (x + endX) / 2;
	var midY = (y + endY) / 2;
	if (d <= 0) {
		return [midX + (10 * Math.sin(d * (Math.PI / 180))), midY - (10 * Math.cos(d * (Math.PI / 180)))];
	} else if (d > 0) {
		return [midX - (10 * Math.sin(d * (Math.PI / 180))), midY + (10 * Math.cos(d * (Math.PI / 180)))];
	}
}
function textPosLine(x1, y1, x2, y2) {
	var midX = (x1 + x2) / 2;
	var midY = (y1 + y2) / 2;
	var slope;
	if (x2 !== x1) {
		slope = (y2 - y1) / (x2 - x1);
	} else {
		slope = 'u';
	}
	if (slope == 'u' || Math.abs(slope) > 2) {
		return [midX - 10, midY];
	} else if (slope === 0 || Math.abs(slope) < .3) {
		return [midX, midY + 10];
	} else if (slope > 0) {
		return [midX - (10 * .3 * slope), midY + (10 * (1 / slope))];
	} else if (slope < 0) {
		return [midX + (10 * slope), midY + (10 * (1 / slope))];
	}
}
function distance(a, b) {
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}
function redrawText(a) {
	// a = {
	// h1x:
	// h1y:
	// h2x:
	// h2y:
	// h3x:
	// h3y:
	// }
	$("#triangle").removeLayerGroup("text");
	$("#triangle").drawLayers();

	// h1 to h2
	$("#triangle").drawText({
		fillStyle : "black",
		strokeStyle : "black",
		layer : true,
		name : "A",
		strokeWidth : 1,
		groups : ["text"],
		x : textPosLine(a.h1x, a.h1y, a.h2x, a.h2y)[0],
		y : textPosLine(a.h1x, a.h1y, a.h2x, a.h2y)[1],
		fontSize : '11pt',
		// text : (distance(a.h2x - a.h1x, a.h2y - a.h1y)/ (scalar)%1 == 0 ? (parseInt(distance(a.h2x - a.h1x, a.h2y - a.h1y) / (scalar)).toString(), 10).toString() : (distance(a.h2x - a.h1x, a.h2y - a.h1y) / (scalar)).toFixed(2).toString()),
		text : formatNum(distance(a.h2x - a.h1x, a.h2y - a.h1y) / (scalar)),
	});
	// h1 to h3
	$("#triangle").drawText({
		fillStyle : "black",
		strokeStyle : "black",
		layer : true,
		name : "B",
		strokeWidth : 1,
		groups : ["text"],
		x : textPosLine(a.h1x, a.h1y, a.h3x, a.h3y)[0],
		y : textPosLine(a.h1x, a.h1y, a.h3x, a.h3y)[1],
		fontSize : '11pt',
		text : formatNum(distance(a.h3x - a.h1x, a.h3y - a.h1y) / (scalar)),
	});

	// h2 to h3
	$("#triangle").drawText({
		fillStyle : "black",
		strokeStyle : "black",
		layer : true,
		name : "C",
		strokeWidth : 1,
		groups : ["text"],
		x : textPosLine(a.h3x, a.h3y, a.h2x, a.h2y)[0],
		y : textPosLine(a.h3x, a.h3y, a.h2x, a.h2y)[1],
		fontSize : '11pt',
		text : formatNum(distance(a.h2x - a.h3x, a.h2y - a.h3y) / (scalar)),
	});

	// Angle
	$("#triangle").drawText({
		fillStyle : "black",
		strokeStyle : "black",
		layer : true,
		name : 'c',
		strokeWidth : 1,
		groups : ["text"],
		x : a.h1x + 20,
		y : a.h1y - 20,
		fontSize : '11pt',
		text : choice === 'degrees' ? lawOfCosines(distance(a.h2x - a.h1x, a.h2y - a.h1y).toString(), distance(a.h3x - a.h1x, a.h3y - a.h1y).toString(), distance(a.h3x - a.h2x, a.h3y - a.h2y).toString(), '')[0].toFixed(2).toString() + "°" : parseRadians(parseInt(lawOfCosines(distance(a.h2x - a.h1x, a.h2y - a.h1y).toString(), distance(a.h3x - a.h1x, a.h3y - a.h1y).toString(), distance(a.h3x - a.h2x, a.h3y - a.h2y).toString(), '')[0], 10), 'out').toString(),
	});
}
function lawOfCosines(A, B, C, c) {
	//Find which one we're looking for. Whichever one is empty, that's the one we need to find. Turn all the others into int's
	// for math purposes.
	// Notice we return an array with quest as the [1] term, we use that later to put the answer in the right box.
	var quest;
	if (A === '') {
		quest = "A";
		lastChanged = "A";
	} else if (B === '') {
		quest = "B";
		lastChanged = "B";
	} else if (C === '') {
		quest = "C";
		lastChanged = "C";
	} else if (c === '') {
		quest = "c";
		lastChanged = 'c';
	} else {
		quest = lastChanged;
	}

	switch (quest) {
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
	var canvas = document.getElementById('triangle');
	var context = canvas.getContext("2d");
	$("#triangle").removeLayers();
	$("#triangle").drawLayers();
	if (!(A && B && C && c)) {
		return;
	}
	var origA = A;
	var origB = B;
	var origC = C;
	var printc;
	if (choice === 'radians') {
		c = parseRadians(c, 'in');
		printc = $("#smallc").val() + " rad";
	} else {
		c = parseFloat(c);
		printc = $("#smallc").val() + "°";
	}
	A = parseFloat(A);
	B = parseFloat(B);
	C = parseFloat(C);
	// Make it go nearer to the bottom, there's tons of dead space down there.
	scalar = 1;
	while (!(A > 400 || B > 400 || C > 400)) {
		A *= 1.1;
		B *= 1.1;
		C *= 1.1;
		scalar *= 1.1;
	}
	while (!(A < 500 && B < 500 && C < 500)) {
		A *= 0.9;
		B *= 0.9;
		C *= 0.9;
		scalar *= .9;
	}
	// Make sure to account for positive cosines. EDIT: Done
	// So, I'm trying to get it to label the lines with their length. The theory is that you get the middle of the line, that's the first part, before "/2"
	// and then add a bit so it's not on the line, that's the 10*the sine of the perpendicular line's angle. So that works. 2 things to do: make this code look less
	// failed-Ballmer-peak, and set it up so that the distance the number is from the angle is proportional to the angle such that very small angles push it out
	// more so it doesn't intersect with the lines. Which it should do automatically with lines, but it sometimes doesn't. Hmmm...
	context.font = "10pt Arial";
	var xOffset;
	var yOffset = 15 + (B * Math.sin(c * (Math.PI / 180)));
	(Math.cos(c * (Math.PI / 180)) >= 0) ? xOffset = 25 : xOffset = 25 - (B * Math.cos(c * (Math.PI / 180)));
	$("#triangle").drawVector({
		strokeStyle : 'black',
		layer : true,
		groups : ["baseTriangle"],
		strokeWidth : 1,
		x : Math.round(A + xOffset),
		y : Math.round(yOffset),
		a1 : 270,
		l1 : Math.round(A),
		a2 : Math.round(90 - c),
		l2 : Math.round(B),
		closed : true
	});
	$("#triangle").drawArc({
		fillStyle : "grey",
		layer : true,
		name : "h1",
		index : 1,
		x : xOffset,
		y : yOffset,
		radius : 15,
		bringToFront : true,
		draggable : true,
		dragstart : function () {
			$("#triangle").removeLayerGroup("baseTriangle")
			.drawLayers()
			.drawLine({
				strokeStyle : 'black',
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h2").x,
				y1 : $("#triangle").getLayer("h2").y,
				x2 : $("#triangle").getLayer("h3").x,
				y2 : $("#triangle").getLayer("h3").y,
				layer : true,
			})
			.drawLine({
				strokeStyle : "black",
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h1").x,
				y1 : $("#triangle").getLayer("h1").y,
				x2 : $("#triangle").getLayer("h2").x,
				y2 : $("#triangle").getLayer("h2").y
			})
			.drawLine({
				strokeStyle : "black",
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h1").x,
				y1 : $("#triangle").getLayer("h1").y,
				x2 : $("#triangle").getLayer("h3").x,
				y2 : $("#triangle").getLayer("h3").y
			});
		},
		drag : function () {
			moved = true;
			redrawText({
				h1x : $("#triangle").getLayer("h1").x,
				h1y : $("#triangle").getLayer("h1").y,
				h2x : $("#triangle").getLayer("h2").x,
				h2y : $("#triangle").getLayer("h2").y,
				h3x : $("#triangle").getLayer("h3").x,
				h3y : $("#triangle").getLayer("h3").y,
			});
			$("#triangle").drawLine({
				strokeStyle : "black",
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h1").x,
				y1 : $("#triangle").getLayer("h1").y,
				x2 : $("#triangle").getLayer("h2").x,
				y2 : $("#triangle").getLayer("h2").y
			})
			.drawLine({
				strokeStyle : "black",
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h1").x,
				y1 : $("#triangle").getLayer("h1").y,
				x2 : $("#triangle").getLayer("h3").x,
				y2 : $("#triangle").getLayer("h3").y
			});
		},
	});
	$("#triangle").drawArc({
		fillStyle : "grey",
		layer : true,
		name : 'h3',
		index : 1,
		bringToFront : true,
		x : (xOffset) + B * Math.cos(c * (Math.PI / 180)),
		y : yOffset - (B * Math.sin(c * (Math.PI / 180))),
		radius : 15,
		draggable : true,
		dragstart : function () {
			$("#triangle").removeLayerGroup("baseTriangle")
			.drawLayers()
			.drawLine({
				strokeStyle : 'black',
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h2").x,
				y1 : $("#triangle").getLayer("h2").y,
				x2 : $("#triangle").getLayer("h1").x,
				y2 : $("#triangle").getLayer("h1").y,
				layer : true,
			})
			.drawLine({
				strokeStyle : "black",
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h3").x,
				y1 : $("#triangle").getLayer("h3").y,
				x2 : $("#triangle").getLayer("h2").x,
				y2 : $("#triangle").getLayer("h2").y
			})
			.drawLine({
				strokeStyle : "black",
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h1").x,
				y1 : $("#triangle").getLayer("h1").y,
				x2 : $("#triangle").getLayer("h3").x,
				y2 : $("#triangle").getLayer("h3").y
			});
		},
		drag : function () {
			moved = true;
			redrawText({
				h1x : $("#triangle").getLayer("h1").x,
				h1y : $("#triangle").getLayer("h1").y,
				h2x : $("#triangle").getLayer("h2").x,
				h2y : $("#triangle").getLayer("h2").y,
				h3x : $("#triangle").getLayer("h3").x,
				h3y : $("#triangle").getLayer("h3").y,
			});
			$("#triangle").drawLine({
				strokeStyle : "black",
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h3").x,
				y1 : $("#triangle").getLayer("h3").y,
				x2 : $("#triangle").getLayer("h2").x,
				y2 : $("#triangle").getLayer("h2").y
			})
			.drawLine({
				strokeStyle : "black",
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h1").x,
				y1 : $("#triangle").getLayer("h1").y,
				x2 : $("#triangle").getLayer("h3").x,
				y2 : $("#triangle").getLayer("h3").y
			});
		},
	});
	$("#triangle").drawArc({
		fillStyle : "grey",
		layer : true,
		name : 'h2',
		index : 1,
		bringToFront : true,
		x : xOffset + A,
		y : yOffset,
		radius : 15,
		draggable : true,
		dragstart : function () {
			$("#triangle").removeLayerGroup("baseTriangle")
			.drawLayers()
			.drawLine({
				strokeStyle : 'black',
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h1").x,
				y1 : $("#triangle").getLayer("h1").y,
				x2 : $("#triangle").getLayer("h3").x,
				y2 : $("#triangle").getLayer("h3").y,
				layer : true,
			})
			.drawLine({
				strokeStyle : "black",
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h2").x,
				y1 : $("#triangle").getLayer("h2").y,
				x2 : $("#triangle").getLayer("h3").x,
				y2 : $("#triangle").getLayer("h3").y
			})
			.drawLine({
				strokeStyle : "black",
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h2").x,
				y1 : $("#triangle").getLayer("h2").y,
				x2 : $("#triangle").getLayer("h1").x,
				y2 : $("#triangle").getLayer("h1").y
			});
		},
		drag : function () {
			moved = true;
			redrawText({
				h1x : $("#triangle").getLayer("h1").x,
				h1y : $("#triangle").getLayer("h1").y,
				h2x : $("#triangle").getLayer("h2").x,
				h2y : $("#triangle").getLayer("h2").y,
				h3x : $("#triangle").getLayer("h3").x,
				h3y : $("#triangle").getLayer("h3").y,
			});
			$("#triangle").drawLine({
				strokeStyle : "black",
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h1").x,
				y1 : $("#triangle").getLayer("h1").y,
				x2 : $("#triangle").getLayer("h2").x,
				y2 : $("#triangle").getLayer("h2").y
			})
			.drawLine({
				strokeStyle : "black",
				strokeWidth : 1,
				index : 0,
				groups : ["baseTriangle"],
				x1 : $("#triangle").getLayer("h2").x,
				y1 : $("#triangle").getLayer("h2").y,
				x2 : $("#triangle").getLayer("h3").x,
				y2 : $("#triangle").getLayer("h3").y
			});
		},
	});
	$("#triangle").drawText({
		fillStyle : "black",
		strokeStyle : "black",
		layer : true,
		strokeWidth : 1,
		groups : ["text"],
		x : textPosVec(xOffset, yOffset, B, 90 + c)[0],
		y : textPosVec(xOffset, yOffset, B, 90 + c)[1],
		fontSize : '11pt',
		text : origB.toString(),
	});
	$("#triangle").drawText({
		fillStyle : "black",
		strokeStyle : "black",
		layer : true,
		strokeWidth : 1,
		groups : ["text"],
		x : textPosVec(xOffset, yOffset, A, 90)[0],
		y : textPosVec(xOffset, yOffset, A, 90)[1],
		fontSize : '11pt',
		text : origA.toString(),
	});
	$("#triangle").drawText({
		fillStyle : "black",
		strokeStyle : "black",
		layer : true,
		strokeWidth : 1,
		groups : ["text"],
		x : textPosLine(xOffset + A, yOffset, xOffset + (B * Math.cos(c * (Math.PI / 180))), yOffset - (B * (Math.sin(c * (Math.PI / 180)))))[0],
		y : textPosLine(xOffset + A, yOffset, xOffset + (B * Math.cos(c * (Math.PI / 180))), yOffset - (B * (Math.sin(c * (Math.PI / 180)))))[1],
		fontSize : '11pt',
		text : origC.toString(),
	});
	$("#triangle").drawText({
		fillStyle : "black",
		strokeStyle : "black",
		layer : true,
		strokeWidth : 1,
		groups : ["text"],
		x : xOffset + 20,
		y : yOffset - 20,
		fontSize : '11pt',
		text : printc
	});
}
$(document).ready(function () {
	// Which radio button you've chosen. Defaults to degrees.
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
		$("#triangle").removeLayers();
		$("#triangle").drawLayers();
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
		if (ans[1] === 'c') {
			//Make it radians if we need to.
			if ($('input:radio[name=degrees]:checked').val() === 'radians') {
				$('#smallc').val(parseRadians(ans[0], 'out'));
			} else {
				$('#smallc').val(ans[0]);
			}
		} else {
			$("#" + ans[1]).val(ans[0]);
		}
		drawTriangle($("#A").val(), $("#B").val(), $("#C").val(), $("#smallc").val());
	});
	$(".box").keydown(function (event) {
		//13 is enter, so if we press enter anywhere, it will submit. It even changes the look as if you clicked it, which I always liked.
		if (event.which === 13) {
			submit.mousedown();
		}
	});
	$(".box").keyup(function (event) {
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
		redrawText({
			h1x : $("#triangle").getLayer("h1").x,
			h1y : $("#triangle").getLayer("h1").y,
			h2x : $("#triangle").getLayer("h2").x,
			h2y : $("#triangle").getLayer("h2").y,
			h3x : $("#triangle").getLayer("h3").x,
			h3y : $("#triangle").getLayer("h3").y,
		});
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
		redrawText({
			h1x : $("#triangle").getLayer("h1").x,
			h1y : $("#triangle").getLayer("h1").y,
			h2x : $("#triangle").getLayer("h2").x,
			h2y : $("#triangle").getLayer("h2").y,
			h3x : $("#triangle").getLayer("h3").x,
			h3y : $("#triangle").getLayer("h3").y,
		});
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
	submit.mousedown();
	$("#triangle").mouseup(function () {
		$("#triangle").drawRect({
			fillStyle : 'black',
			x : 0,
			y : 0,
			width : 500,
			height : 500,
			fromCenter : false
		});
		$("#triangle").drawLine({
			groups : ["baseTriangle"],
			strokeStyle : "black",
			strokeWidth : 1,
			layer : true,
			x1 : $("#triangle").getLayer("h2").x,
			y1 : $("#triangle").getLayer("h2").y,
			x2 : $("#triangle").getLayer("h1").x,
			y2 : $("#triangle").getLayer("h1").y,
			x3 : $("#triangle").getLayer("h3").x,
			y3 : $("#triangle").getLayer("h3").y,
			closed : true,
			index : 1
		});
		$("#A").val($("#triangle").getLayer("A").text);
		$("#B").val($("#triangle").getLayer("B").text);
		$("#C").val($("#triangle").getLayer("C").text);
		$("#smallc").val($("#triangle").getLayer("c").text);
	});
});

// $("#triangle").draw({
// fn : function (ctx) {
// ctx.fillStyle = "black";
// ctx.strokeStyle = "black";
// var textX = Math.floor(((xOffset + xOffset + (B * Math.cos(c))) / 2) + 10 * Math.cos(Math.atan( - (((xOffset) - ((xOffset) + B * Math.cos(c))) / ((yOffset) - (yOffset - (B * Math.sin(c))))))));
// var textY = Math.floor((yOffset + yOffset - (B * Math.sin(c))) / 2 + 10 * Math.sin(Math.atan( - (((xOffset) - ((xOffset) + B * Math.cos(c))) / ((yOffset) - (yOffset - (B * Math.sin(c))))))));
// ctx.beginPath();
// ctx.moveTo(xOffset, yOffset);
// ctx.lineTo((xOffset) + B * Math.cos(c), yOffset - (B * Math.sin(c)));
// ctx.moveTo(xOffset, yOffset);
// ctx.lineTo(xOffset + A, yOffset);
// ctx.lineTo((xOffset) + B * Math.cos(c), yOffset - (B * Math.sin(c)));
// ctx.stroke();
// ctx.fillText(origB, textX, textY);
// textX = Math.floor(((xOffset + xOffset + A + 5)) / 2);
// textY = Math.floor(yOffset - 10);
// ctx.fillText(origA, textX, textY);
// textX = Math.floor(((xOffset + A + xOffset + (B * Math.cos(c))) / 2) - 20 * Math.cos(Math.atan( - (((xOffset + A + 5) - (xOffset + (B * Math.cos(c))))) / ((yOffset) - (yOffset - (B * Math.sin(c)))))));
// textY = Math.floor((yOffset + yOffset - (B * Math.sin(c))) / 2 - 20 * Math.sin(Math.atan( - (((xOffset) - ((xOffset) + B * Math.cos(c))) / ((yOffset) - (yOffset - (B * Math.sin(c))))))));
// ctx.fillText(origC, textX, textY);
// if (c < 0.7) {
// textX = (xOffset) + 50 * Math.cos(c / 2);
// textY = yOffset - 50 * Math.sin(c / 2);
// } else {
// textX = (xOffset) + 18 * Math.cos(c / 2);
// textY = yOffset - 18 * Math.sin(c / 2);
// }
// ctx.fillText(origc, textX, textY);
// }
// });
