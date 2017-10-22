/* Generate the board */

var blue = "hsl(210, 100%, 60%)";
var lightblue = "hsl(210, 100%, 90%)";

var columns = 5;
var rows = 8;

var board = [];
createBoard();

function createBoard(){
	var x = 0;
	for (i = 0; i<columns; i++) {
		x = Math.floor(Math.random()*(rows+1));
		board.push(x);
		var column = document.createElement("div");
		column.className="column";
		for (j=0;j<x;j++) {
			var drip = document.createElement("div");
			drip.className = "drip";
			column.appendChild(drip);
		}
		document.getElementById("board").appendChild(column);
	}
}

/* Decide whose goes first */


document.getElementById("first").onclick = function () {
	document.getElementById("question").remove();
	yourturn();
}

document.getElementById("second").onclick = function () {
	document.getElementById("question").remove();
	notyourturn();
}

/* Your turn */

function yourturn() {
	addEventListeners();	
}

function addEventListeners() {
	document.querySelector("#board").addEventListener("mouseover", highlight);
	// this is so you can prepare your move while the computer is playing - not perfect though.
	document.querySelector("#board").addEventListener("mousemove", highlight); 
	document.querySelector("#board").addEventListener("mouseout", unhighlight);
	document.querySelector("#board").addEventListener("click", remove);	
}

function highlight(e) {
	var x = e.target;
	if (e.target.parentElement !== e.currentTarget) {
        x.style.backgroundColor= lightblue;
        while (x.nextElementSibling) {
        	x=x.nextElementSibling;
        	x.style.backgroundColor= lightblue;
        }
    }
    e.stopPropagation();
}
 
function unhighlight(e) {
	var x = e.target;
	if (e.target.parentElement !== e.currentTarget) {
        x.style.backgroundColor= blue;
        while (x.nextElementSibling) {
        	x=x.nextElementSibling;
        	x.style.backgroundColor= blue;
        }
    }
    e.stopPropagation();
}
 
function remove(e) {
	var x = e.target;
	var p = x.parentElement;
    if (e.target.parentElement !== e.currentTarget) {
    	// Finds column number k
    	var k=0;
    	while(p = p.previousElementSibling) {k++;};
    	// removes elements and changes board column k.
    	do {
    		if (x.style.display != "none") {
				x.style.display = "none";
				board[k] -= 1;
			}
        }
    	while (x = x.nextElementSibling);
    }
    e.stopPropagation();
    if (e.target.parentElement !== e.currentTarget) {
    	notyourturn();
    }
}


/* Not your turn */

function notyourturn() {
	removeEventListeners();
	var y = optimalMove(board);
	var col = y[0];
	var newval = y[1];
	setTimeout(highlightAt(col,newval),1000);
	setTimeout(removeAt(col,newval),2000);
	setTimeout(yourturn,2500);

}

function removeEventListeners() {
	document.querySelector("#board").removeEventListener("mouseover", highlight);
	document.querySelector("#board").removeEventListener("mousemove", highlight); 
	document.querySelector("#board").removeEventListener("mouseout", unhighlight);
	document.querySelector("#board").removeEventListener("click", remove);	
}

function optimalMove(board) {
	
	var row = [];
	var binaryboard = [];
	var rowsum = 0;
	var rowsums = [];
	var remainder = board;
	var remaindersum = sum(remainder);
	var n=0;
	var h=0;
	var col = 0;
	var newvalbin = [];
	var newval =0 ;

	while (remaindersum != 0) {
		row = remainder.map(function (x) {return x % 2;});
		binaryboard.push(row);
		rowsum = sum(row) % 2;
		if (rowsum == 1) {
			h = n;
		}
		rowsums.push(rowsum);
		remainder = dif(remainder,row);
		remaindersum = sum(remainder);
		n += 1;
	}
	
	if (sum(rowsums) == 0) {
		while (board[col] == 0) {
			col +=1;
		}
		newval = board[col] - 1;
	} else {
		while (binaryboard[h][col] == 0) {
			col += 1;
		}
		for(i=0; i<n; i++) {
			newvalbin.push((binaryboard[i][col] + rowsums[i])%2);
		}
		for (i=n-1; i>=0; i=i-1) {
			newval = 2 * newval + newvalbin[i];
		}
	}

	return [col, newval];
}


function sum(array) {
	return array.reduce(function(a,b) {return a+b;})
}


function dif(a,b) {
	var out = [];
	for(i=0; i<columns; i++) {
		out.push((a[i]-b[i])/2);
	}
	return out;
}

function highlightAt(col,newval) {
	return function() {
		var x = document.getElementById("board");
		x = x.firstElementChild;
		for (i=0;i<col;i++) {
			x=x.nextElementSibling;
		}
		x=x.firstElementChild;
		for (i=0;i<newval;i++) {
			x=x.nextElementSibling;
		}
		do {
			x.style.backgroundColor = lightblue;
		}
		while (x = x.nextElementSibling);
	}
}

function removeAt(col,newval) {
	return function() {
		var x = document.getElementById("board");
		x = x.firstElementChild;
		for (i=0;i<col;i++) {
			x=x.nextElementSibling;
		}
		x=x.firstElementChild;
		for (i=0;i<newval;i++) {
			x=x.nextElementSibling;
		}
		do {
			x.style.display = "none";
		}
		while (x = x.nextElementSibling);
		board[col]=newval;
	}
}




	