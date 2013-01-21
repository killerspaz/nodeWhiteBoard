/*
 * Sets up application's routing functions.
 */

var index   = require('./index');

exports.route = function(app){
  	index.setupRoutes(app);
};