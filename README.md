# spatialaddressbook

Your address book on a map! This web app lets a user visualise the locations of their addressbook contacts.

## Technologies

- NodeJS
- Express web framework
- [Pug](https://pugjs.org/ "Pug") templating engine
- MongoDB database (with [mongoose object modelling](https://mongoosejs.com/ "mongoose object modelling"))
- [Leaflet](https://leafletjs.com/ "Leaflet") mapping library


## Installation

### Prerequesites

You need to connect to a database called *test* that contains a MongoDB collection *addresscollection*, with some sample data documents. These follow the [GeoJSON](https://geojson.org/ "GeoJSON") standard and as a minimum, need to contain the following properties:
- firstname
- lastname
- category
- contact_details

Please refer to the JsonSchema variable in */routes/index.js* for more details on the document structure.

### How to run

In your terminal, clone the repo and install npm dependencies:

~~~
  ... $ git clone git@github.com:globalavocado/spatialaddressbook.git
  ... $ cd spatialaddressbook
  ... $ npm install
~~~

open another terminal tab to start MongoDB in any directory:

~~~
  ... $ mongod
~~~

return to your first tab and start the node server:

~~~
  ... $ npm start
~~~

then open a browser at http://localhost:3000


## Project status

#### done

- retrieve address points from the database and display on map
- layer switcher to filter address points by category (colleague or friend)
- hover over an address point to show first name of the addressbook contact as tooltip
- click anywhere on the map to return map coordinates in the console
- click on an address point for address point properties
- add address points to the database through the web page

#### to do
- add address points by clicking on the map
- edit address points that are in the database
- delete address points from the database
- use ES6
