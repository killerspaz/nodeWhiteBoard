/*
 * Set up Routes for Drawing
 */
exports.setupRoutes = function(app) {
	app.get('/', 					index);
	app.get('/drawing/:drawId', 	loadDrawing);
}

/*
 * Index page for Movies
 */
var index = function(req, res){
	res.sendfile('public/html/draw.index.html');
};

var loadDrawing = function(req, res){
	res.send("Load drawing: " + req.params.drawId);
};

/*
 * Do Search for ...
var movieGet = function(req, res){
	var itemName = req.params.itemName;

	res.send(
		{
			id: 1,
			itemName: itemName
		}
	);
};
 */