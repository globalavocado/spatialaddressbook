var express = require('express');
var router = express.Router();

// Mongoose import
var mongoose = require('mongoose');


// suppress deprecation error
mongoose.set('useFindAndModify', false);

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost/test', { 
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	function (error) {
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
}, {
    _id : false
});

var JsonSchema = new Schema({	
		geometry: {
			type: pointSchema,
			required: true
		},
		properties:{
			firstname: String,
			lastname: String,
			category: String,
			contact_details: String,
			location: String,
			status: String
		},
		type: Schema.Types.Mixed
    },
    { versionKey: false });

// Mongoose Model definition: object giving access to a named collection, allowing query & using schema to validate documents to be saved
var Location = mongoose.model('Location', JsonSchema, 'addresscollection_italian');

/* GET json data. */
// first look for category, which will become the name of the layer
router.get('/mapjson/:category', function (req, res) {
// then confirm that layer name exists
	if (req.params.category) {
// append the findOne function to JSON model 'Location'
// QUERY: find only the category (this goes into the route), project everything
		Location.find({'properties.category': req.params.category},{}, function (err, addresspoints) {
			res.json(addresspoints);
			});
		}
	});

/* GET layers json data. */
// build a handler to get all layer names
router.get('/maplayers', function (req, res) {
// we use find rather than findOne because we are not restricting it to just one record, we only want the category field returned, we are also suppressing _id
// QUERY: find everything, project only categories
// docs object: all categories in multiple
	Location.find({},{}, function (err, addresspoints) {
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

/* POST the form. */
router.post("/submitted", function(req, res) {

/* a new Location instance */
var submittedFirstname = req.body.firstname;
var submittedLastname = req.body.lastname;
var submittedContactdetails = req.body.contact_details;
var submittedCategory = req.body.category;
var submittedLat = req.body.lat;
var submittedLng = req.body.lng;

var submittedLocation = new Location({
    type : "Feature",
    geometry : {
        type : "Point",
        "coordinates" : [ submittedLng, submittedLat ]},
    "properties": {
     "firstname": submittedFirstname,
     "lastname": submittedLastname,
     "contact_details": submittedContactdetails,
     "category": submittedCategory
        }
    });

// add this new location to the database
submittedLocation.save(function (err, addresspoints) {
      if (err) return console.error(err);
    });

    // send everything to the submission page
    res.render('submitted', {
        "firstname": submittedFirstname,
        "lastname": submittedLastname,
        "category": submittedCategory,
        "contactdetails": submittedContactdetails,
        "coordinates": (submittedLat + ' , ' + submittedLng)
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
