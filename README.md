# spatialaddressbook

Your address book on a map! This web app lets a user visualise the locations of their addressbook contacts.

## Technologies

- NodeJS
- Express web framework
- Pug templating engine
- MongoDB database (with [mongoose object modelling][https://mongoosejs.com/])
- [Leaflet][https://leafletjs.com/] mapping library


## Installation

### Prerequesites

You need to have a MongoDB database in place with some sample data document. These follow the [GeoJSON standard][https://geojson.org/] and as a minimum, need to contain the following properties: 
- firstname 
- lastname 
- category
- contact_details


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

- retrieve address points from the database and display them on the map
- layer switcher to filter address points by category (colleague or friend)
- hovering over an address point displays the first name of the addressbook contact as a tooltip
- clicking anywhere on the map returns the coordinates in the console
- clicking on an address point writes all attached properties to the console

#### to do
- a ReactJS frontend to display retrieved properties onto the page rather than console logging them
- ability to add address points to the database through the web page
- ability to edit address points that are in the database
- ability to delete address points from the database via the web page
