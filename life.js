/* I had a problem where the dynamically added parts of the DOM weren't being changed when clicked, but I fixed it with the comment below.  */
/* Ok, so I fixed it with .on(). You have to use the construction detailed here http://stackoverflow.com/a/9814409 and you can't use () on the function part,
I learned that the hard way. */
/* TODO: Make a button that runs the simulation without just holding space. Maybe have something to change the speed too. EDIT: Done!
 * Make it so that the cursor doesn't change when you drag to flip.
 * Could you set the height and width in CSS instead of making jQuery do it in populate() so there's a single place I can change it?
 * You might be doubling up on id's, should you fix that?
 * Could we make #control fixed to the side or something? Or maybe make it so we can drag it around? EDIT: Done!
 * What if we make an array that has the coords of live cells and only check them and their neighbors to make the program more efficient?*/

$(document).ready(function () {
	//Width and height, in cells. Defaults to 10 and 10.
	width = 10;
	height = 10;
	interval = null;
	running = false;
	//An array that corresponds to the cells on the page. 1 is alive, 0 is dead.
	gridArray = [];
	liveCells = [];
	//Whether mouse is down. Used for dragging to flip cells.
	mousedown = false;
	//Make all the starting cells.
	populate(height, width);
	//When you press space, the simulation runs one generation, and it runs many if you hold it.
	$(document).keydown(function (event) {
		if (event.which === 32) {
			generation();
		}
	});
	$("#control").draggable();
	$("#clear").mousedown(function () {
		populate(height, width);
		if (running) {
		clearInterval(interval);
			running = false;
		}
		liveCells = [];
	});
	$(document).mouseup(function () {
		mousedown = false;
	});
	$(document).mousedown(function () {
		mousedown = true;
	});
	$("#play").mousedown(function () {
		if (!running) {
			interval = setInterval(generation, 1000 / parseInt($("#speed").val(), 10));
			running = true;
		}
	});
	$("#pause").mousedown(function () {
		if (running) {
			clearInterval(interval);
			running = false;
		}
	});
	$("#speed").keyup(function() {
		if (running) {
			clearInterval(interval);
			if (!($("#speed").val() === '0' || $("#speed").val() === '')) {
				interval = setInterval(generation, 1000/parseInt($("#speed").val(),10));
			}
		}
	});
	/* 	These lines are to click/drag to flip cells. .on() is different from .mousedown() etc. because it updates live as the DOM changes.
	See second comment.  */
	$("table").on('mousedown', ".dead", flipDead)
	.on("mousedown", ".alive", flipAlive)
	.on("mouseenter", ".dead", enterDead);
	// This repopulates the grid every time you lift off a key (i.e. type something) in one of the text boxes that change the
	// dimenstions.
	$(".box").keyup(function () {
		if ($("#height").val() < 40 && $("#width").val() < 50) {
			$("#complaint").empty();
			height = $("#height").val();
			width = $("#width").val();
			populate(height, width);
		} else {
			$("#complaint").html("That value is too big!");
		}
	});
});

// This takes gridArray and makes the cells match it, the opposite of the last line in flipAlive() and flipDead().
function arrayToHtml() {
	for (var i = 0; i < gridArray.length; i++) {
		for (var j = 0; j < gridArray[i].length; j++) {
			// If it's 1, set it to .alive, if it's 0, set it to .dead. The notation to get the box I want is $(ancestor descendent) notation,
			// as shown here. https://api.jquery.com/descendant-selector/. See populate() for how I have the x's and y's denoted in the HTML.
			if (gridArray[i][j] === 1) {
				$("#" + String(i) + "y #" + String(j) + "x").attr("class", "alive");
			} else if (gridArray[i][j] === 0) {
				$("#" + String(i) + "y #" + String(j) + "x").attr("class", "dead");
			}
		}
	}
}
// Run one generation of the grid. Just run this over and over to do many generations.
function generation() {
	//An array such that numberArray[y][x] is the number of live neighbors gridArray[y][x] has.
	var numberArray = [];
	var neighbors;
	for (var i = 0; i < height; i++) {
		numberArray.push([]);
		for (var j = 0; j < width; j++) {
			numberArray[i][j] = 0;
		}
	}
	var cells = getNeighbors(liveCells);
	for (var p = 0; p < cells.length; p++) {
		neighbors = 0;
		// Possible x's and possible y's. 3 * 3 = 9, minus i,j, the cell itself, gives you its 8 possible neighbors.
		yPoss = [cells[p][0] - 1, cells[p][0], cells[p][0] + 1];
		xPoss = [cells[p][1] - 1, cells[p][1], cells[p][1] + 1];
		// Iterate through xPoss and yPoss.
		for (var y = 0; y < 3; y++) {
			for (var x = 0; x < 3; x++) {
				// Make sure it's not (i,j), the cell itself.
				if (!(x === 1 && y === 1)) {
					// Surrounded in try catch so it doesn't throw a fit if it goes off the edge. This one doesn't wrap around the sides.
					try {
						if (gridArray[yPoss[y]][xPoss[x]] === 1) {
							neighbors++;
						}
					} catch (err) {}
				}
			}
		}
		// Set numberArray spot that corresponds to gridArray spot to the amount of neighbors.
		numberArray[cells[p][0]][cells[p][1]] = neighbors;
		// console.log(cells[p][1], cells[p][0], "has ", neighbors, "neighbors");
	}
		// Look at every cell and see if it should be alive or dead.
		for (var i = 0; i < numberArray.length; i++) {
			for (var j = 0; j < numberArray[i].length; j++) {
				if (numberArray[i][j] === 3) {
					gridArray[i][j] = 1;
					if (liveCells.myIndexOf([i, j]) == -1) {
						liveCells.push([i, j]);
					}
				} else if (numberArray[i][j] < 2) {
					gridArray[i][j] = 0;
					if (liveCells.myIndexOf([i, j]) != -1) {
						liveCells.splice(liveCells.myIndexOf([i, j]), 1);
					}
				} else if (numberArray[i][j] > 3) {
					gridArray[i][j] = 0;
					if (liveCells.myIndexOf([j, i]) != -1) {
						liveCells.splice(liveCells.myIndexOf([i, j]), 1);
					}
				}
			}
		}
		// We've set up gridArray to be the next generation, now we just need to show the user, which is what arrayToHtml() does.
		arrayToHtml();
		if ([].concat.apply([], gridArray).indexOf(1) === -1) {
			$("#pause").mousedown()
			.mouseup();
		}
	}
	Array.prototype.myIndexOf = function (arg) {
		for (var i = 0; i < this.length; i++) {
			if (this[i][0] === arg[0] && this[i][1] === arg[1]) {
				return i;
			}
		}
		return -1;
	};
	function getNeighbors(liveCells) {
		var output = [];
		for (var i = 0; i < liveCells.length; i++) {
			output.push(liveCells[i]);
			output.push([liveCells[i][0] + 1, liveCells[i][1]]);
			output.push([liveCells[i][0] + 1, liveCells[i][1] + 1]);
			output.push([liveCells[i][0] + 1, liveCells[i][1] - 1]);
			output.push([liveCells[i][0] - 1, liveCells[i][1]]);
			output.push([liveCells[i][0] - 1, liveCells[i][1] + 1]);
			output.push([liveCells[i][0] - 1, liveCells[i][1] - 1]);
			output.push([liveCells[i][0], liveCells[i][1] + 1]);
			output.push([liveCells[i][0], liveCells[i][1] - 1]);
		}
		output = eliminateDuplicates(output);
		var done = false;
		while (!done) {
			done = true;
			for (var i = 0; i < output.length; i++) {
				if (output[i][1] >= height || output[i][1] < 0 || output[i][0] >= width || output[i][0] < 0) {
					output.splice(i, 1);
					done = false;
				}
			}
		}
		return output;
	}

	// Populate an empty grid of specified height and width, in cells.
	function populate(height, width) {
		// Empty everything first.
		$("tbody").empty();
		gridArray = [];
		for (var i = 0; i < height; i++) {
			// The table rows are id'd as the number y they are, where top is 0. They are followed by y to differentiate them from x, or else
			// problems occur, and the y is at the end so parseInt() doesn't screw up, it just kicks it off and goes.
			$("tbody").append('<tr id="' + String(i) + 'y" style="height:35px;">');
			gridArray.push([]);
			for (j = 0; j < width; j++) {
				// The table data are labeled the same, but with x. It's possible that I'm doubling up on id's, which is probably wrong, but
				// that's a problem for another day. It works, that's my main concern.
				$("#" + String(i) + 'y').append('<td class="dead" id="' + String(j) + 'x" style="width:35px;"></td>');
				// Get the last y in the array and add a dead cell, the one we just made to it. In python you can just use "-1", but it's not that
				// simple here. Alas...
				gridArray[gridArray.length - 1].push(0);
			}
			// Close the row we opened at the beginning.
			$("tbody").append("</tr>");
		}
	}
	// Flip a dead cell to alive. Also updates gridArray and liveCells accordingly.
	function flipDead() {
		$(this).toggleClass("dead");
		$(this).toggleClass("alive");
		// Here is why I have the y and x values in the id's as #y/#x, so I can just parseInt() and it does it
		// automatically without any substring stuff or anything.
		gridArray[parseInt($(this).parent().attr('id'), 10)][parseInt($(this).attr('id'), 10)] = 1;
		liveCells.push([parseInt($(this).parent().attr('id'), 10), parseInt($(this).attr('id'), 10)]);
	}
	// Same thing as flipDead() but the opposite.
	function flipAlive() {
		$(this).toggleClass("alive");
		$(this).toggleClass("dead");
		gridArray[parseInt($(this).parent().attr('id'), 10)][parseInt($(this).attr('id'), 10)] = 0;
		if (liveCells.myIndexOf([parseInt($(this).parent().attr("id"), 10), parseInt($(this).attr('id'), 10)]) !== -1) {
			liveCells.splice(liveCells.myIndexOf([parseInt($(this).parent().attr("id"), 10), parseInt($(this).attr('id'), 10)]), 1);
		}
		// console.log(liveCells);
	}
	// Runs when the mouse enters a dead cell. If the mouse is down, it flips it. Running mousedown() seems inefficient, but it was the easiest
	// way to keep the cell as the context. I used to have one for live cells, but I didn't like that very much, so I took it out. I could have it where
	// it goes both ways, but it will only flip one way in a single mouse hold, and to flip the other way, you have to let go and click again. Maybe I'll
	// do that later.
	function enterDead() {
		if (mousedown === true) {
			$(this).mousedown();
		}
	}
	// This was just for debugging, I stole this off the internet to print the array to the console in an easy-to-read way.
	function debugArrayPrint(arr) {
		var output = '';
		for (var j = 0; j < arr.length; j++) {
			for (var p = 0; p < arr[j].length; p++) {
				output += String(arr[j][p]);
			}
			output += "\n";
		}
		console.log(output);
	}

	// I didn't make this, I stole it from http://dreaminginjavascript.wordpress.com/2008/08/22/eliminating-duplicates/
	function eliminateDuplicates(arr) {
		var i,
		len = arr.length,
		out = [],
		obj = {};
		for (i = 0; i < len; i++) {
			obj[arr[i]] = 0;
		}
		for (i in obj) {
			out.push(i.split(','));
		}
		out = out.map(function (e) {
				return [parseInt(e[0], 10), parseInt(e[1], 10)];
			});
		return out;
	}

	// This stuff is just for educational purposes, stuff that didn't work an an explanation of what I did.


	/* 		I have no idea why these won't work. I've tried .on(), .delegate(), I've tried it with simpler setups to try to get it, I have no ideas. Maybe
	a youtube video on it will shed some light.
	EDIT: I figured it out. Jquery took out .delegate() and and I don't actually know why the one with .on() doesn't work... Hmm. */

	/* 	$("tr").delegate("td", "mousedown", console.log("working"));
	$("tr").delegate(".alive", "mousedown", console.log("working"));
	$("tr").delegate(".dead", "mousedown", console.log("working"));
	$("tr").delegate(".dead", "mouseenter", console.log("working"));
	$("tr").delegate(".alive", "mouseenter", console.log("working")); */
	/* 	$(".alive").on("mousedown", console.log("working"));
	$(".dead").on("mousedown", function () {
	if (mousedown) {
	$(this).toggleClass("alive");
	$(this).toggleClass("dead");
	}
	});
	$(".dead").on("mouseenter", console.log("working"));
	$(".alive").on("mouseenter", console.log("working")); */

	// This should still work until you use the text boxes to change things. Cf. Very top comment.
	/* 		$(".dead").mousedown(function () {
	$(this).toggleClass("dead");
	$(this).toggleClass("alive");
	});
	$(".alive").mousedown(function () {
	$(this).toggleClass("alive");
	$(this).toggleClass("dead");
	});
	$(".alive").mouseenter(function () {
	if (mousedown) {
	$(this).toggleClass("alive");
	$(this).toggleClass("dead");
	}
	});
	$(".dead").mouseenter(function () {
	if (mousedown) {
	$(this).toggleClass("dead");
	$(this).toggleClass("alive");
	}
	}); */
