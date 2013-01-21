var stage;
var isMouseDown;
var currentShape;
var oldMidX, oldMidY, oldX, oldY;
var txt;

function init() {
	if (window.top != window) {
		document.getElementById("header").style.display = "none";
	}
	
	$("#colorPicker").change(setColor);
	$("#drawThickness").change(setThickness);
	
	$("#colorPicker").val("#FF0000");
	$("#drawThickness").val(curThickness);
	
	socket.on('updateDraw', function(message) {
		drawUpdate(message.midPoint, message.lastPoint, message.lastMidPoint, message.drawColor, message.drawThickness);
	});

    stage = new createjs.Stage("myCanvas");
    
    txt = new createjs.Text("Click and Drag to Draw", "36px Arial", "#777777");
    stage.autoClear = true;
    stage.onMouseDown = handleMouseDown;
    stage.onMouseUp = handleMouseUp;

	createjs.Touch.enable(stage);

	var s = new createjs.Shape();
    currentShape = s;

    stage.addChild(s);
    stage.addChild(txt);
    
	createjs.Ticker.addListener(window);

	txt.x = (stage.canvas.width - txt.getMeasuredWidth()) / 2;
	txt.y = (stage.canvas.height - txt.getMeasuredHeight()) / 2;

    stage.update();
}

function stop() {
	createjs.Ticker.removeListener(window);
}

function tick() {
    if (isMouseDown) {
        var pt 				= new createjs.Point(stage.mouseX, stage.mouseY);
        var midPoint 		= new createjs.Point(oldX + pt.x>>1, oldY+pt.y>>1);
        var lastPoint 		= new createjs.Point(oldX, oldY);
        var lastMidPoint 	= new createjs.Point(oldMidX, oldMidY);

		drawUpdate(midPoint, lastPoint, lastMidPoint, curColor, curThickness);
		
	  	var message = {
			midPoint: midPoint,
			lastPoint: lastPoint,
			lastMidPoint: lastMidPoint,
			drawColor: curColor,
			drawThickness: curThickness
	    };
	
		// tell the server to execute 'sendchat' and send along one parameter
		socket.emit('sendDraw', message);
		
	    oldX = pt.x;
	    oldY = pt.y;
	
	    oldMidX = midPoint.x;
	    oldMidY = midPoint.y;
    }
}

function drawUpdate(midPoint, lastPoint, lastMidPoint, color, thickness) {
	stage.removeChild(txt);

    var g = currentShape.graphics;
    g.setStrokeStyle(thickness, 'round', 'round');
    g.beginStroke(color);

    currentShape.graphics.moveTo(midPoint.x, midPoint.y);
    currentShape.graphics.curveTo(lastPoint.x, lastPoint.y, lastMidPoint.x, lastMidPoint.y);

    stage.update();
}

function handleMouseDown() {
    isMouseDown = true;
    
    stage.removeChild(txt);
    
    oldX = stage.mouseX;
    oldY = stage.mouseY;
    oldMidX = stage.mouseX;
    oldMidY = stage.mouseY;
}

function handleMouseUp() {
    isMouseDown = false;
}

var curColor = createjs.Graphics.getRGB(Math.random()*255 | 0 ,Math.random()*255 | 0, Math.random()*255 | 0, 1);
var curThickness = 2;

function setColor() {
	var color = $("#colorPicker").val();
	curColor = color;
}

function setThickness() {
	var color = $("#drawThickness").val();
	curThickness = color;
}

//function setColor(cR, cG, cB, alpha) {
//	this.curColor = createjs.Graphics.getRGB(cR, cG, cB, alpha);
//}