var express = require('express');
var router = express.Router();

// Mongoose import
var mongoose = require('mongoose');


// suppress depracation error
mongoose.set('useFindAndModify', false);

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true }, function (error) {
	if (error) {
		console.log(error);
		}
	});

// Mongoose Schema definition: an object that defines the structure of documents, enables definition of types and validators
var Schema = mongoose.Schema;

var pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number, Number],
    required: true
  }
});

var JsonSchema = new Schema({	
		geometry: {
			type: pointSchema,
			required: true
		},
		properties:{
			category: String,
			contact_details: String,
			status: String
		},
		type: Schema.Types.Mixed
	});

// Mongoose Model definition: object giving access to a named collection, allowing query & using schema to validate documents to be saved
var Location = mongoose.model('Just-a-Name', JsonSchema, 'addresscollection');

/* GET json data. */
// first look for category, which will become the name of the layer
router.get('/mapjson/:category', function (req, res) {
// then confirm that layer name exists
	if (req.params.category) {
// append the findOne function to JSON model 'Location'
// QUERY: find only the category (this goes into the route), project only contact_details
		Location.findOne({'properties.category': req.params.category },{}, function (err, addresspoints) {
			res.json(addresspoints);
			// this will appear in the terminal, not the browser:
			// console.log('addresspoints', addresspoints)
			});
		}
	});

/* GET layers json data. */
// build a handler to get all layer names
router.get('/maplayers', function (req, res) {
// we use find rather than findOne because we are not restricting it to just one record, we only want the category field returned, we are also suppressing _id
// QUERY: find everything, project only categories
// docs object: all categories in multiple
	Location.find({},{_id: 0, 'properties.category': 1}, function (err, addresspoints) {
		res.json(addresspoints);
	});
});

/* GET Map page. */
// set up a page to display, based on request for '/'. Send addresspoints json object and lat/long variables to the index.pug template
// use these to iterate through & generate html based on the layers, also center the map at the coordinates specified below
router.get('/', function(req,res) {
	var db = req.db;
	Location.find({},{}, function(e, addresspoints){
		categories = []

		function collectCategory(point) {		
			//push category from every point into the categories array
			categories.push(point.properties.category);
		};
		addresspoints.forEach(collectCategory);
		var uniqueCategories = unique(categories); 
		res.render('index', {
			"addresspoints" : addresspoints,
			lat : 45.42,
			lng : 10.39,
			// also pass unique categories to index.pug
			categories : uniqueCategories,
			});
		});
	});


// iterates through each document, creates key-value pair but 
// makes sure it only takes category once

function unique(list){
	var uniques = {};
	list.forEach(function(item){
		uniques[item] = true;
	});
	return Object.keys(uniques);
};

module.exports = router;
