var express = require('express');
var router = express.Router();

// Mongoose import
var mongoose = require('mongoose');

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true }, function (error) {
	if (error) {
		console.log(error);
		}
	});

// Mongoose Schema definition: an object that defines the structure of documents, enables definition of types and validators
var Schema = mongoose.Schema;
var JsonSchema = new Schema({
	category: String,
	type: Schema.Types.Mixed
	});

// Mongoose Model definition: object giving access to a named collection, allowing query & using schema to validate documents to be saved
var Json = mongoose.model('Just-a-Name', JsonSchema, 'layer-test');

/* GET json data. */
// first look for layer name (this is one of the top-level properties)
router.get('/mapjson/:category', function (req, res) {
// then confirm that layer name exists
	if (req.params.category) {
// append the findOne function to Json model
		Json.findOne({ category: req.params.category },{}, function (err, docs) {
			res.json(docs);
			});
		}
	});

/* GET layers json data. */
// build a handler to get all layer names
router.get('/maplayers', function (req, res) {
// we use find rather than findOne because we are not restricting it to just one record and we only want the name field returned
	Json.find({},{'category': 1}, function (err, docs) {
		res.json(docs);
	});
});

/* GET Map page. */
// set up a page to display, based on request for '/'. Send addresspoint json object and lat/long variables to the index.pug template
// use these to iterate through & generate html based on the layers, also center the map at the coordinates specified below
router.get('/', function(req,res) {
	var db = req.db;
	Json.find({},{}, function(e,docs){
		res.render('index', {
			"addresspoint" : docs,
			lat : 45.42,
			lng : 10.39
			});
		});
	});

module.exports = router;
