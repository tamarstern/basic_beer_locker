// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var beerController = require('./controllers/beer');

var config = require('config');
//db options
let options = { 
                server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
              }; 

//db connection      
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /beers
router.route('/beers')
  .post(beerController.postBeers)
  .get(beerController.getBeers);

// Create endpoint handlers for /beers/:beer_id
router.route('/beers/:beer_id')
  .get(beerController.getBeer)
  .put(beerController.putBeer)
  .delete(beerController.deleteBeer);

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(3000);

module.exports = app; 