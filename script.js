$(document).ready(initializeApp);
var map;
/***************************************************************************
 * initializeApp - add click handler to search button, render landing page
 * @params {undefined}
 * @returns  {undefined}
 */

function initializeApp() {
  $(".submit-button").on("click", handleSearchButtonClick);
  renderInitialMap();
}

/***************************************************************************
 * handleSearchButtonClick - when “search” button is clicked, call ticketmaster ajax call
 * @param {object} event  The event object from the click
 * @returns: number
 * @calls: ticketmasterAjaxCall
 */
function handleSearchButtonClick() {
  getTicketMasterConcerts(getEventInfo());
}

/***************************************************************************
 * getEventInfo - gets city and state code from user input and returns information in object
 * @param: {undefined} none
 * @returns: object
 * @calls: inputCityCheck, getStateFromDropDown, getEventDate
 */
function getEventInfo() {
  var event = {};
  event.city = getCity();
  event.state = getState();
  event.date = getEventDate();
  return event;
}

/***************************************************************************
 * getCity - gets string entered by user, checks that it is a US city
 * @param: {undefined} none
 * @returns: string
 * @calls: none
 */

function getCity() {
  if ($(".city-name").val() === "") {
    console.log("Please input a city.");
  } else {
    return $(".city").val();
  }
}

/***************************************************************************
 * getState - pulls state code from selected drop down menu item
 * @param: {undefined} none
 * @returns: string
 * @calls: none
 */

function getState() {
  return $(".state-code").val();
}

/***************************************************************************
 * getEventDate - pulls date of event from input field & adds end date
 * @param: {undefined} none
 * @returns: object
 * @calls: none
 */

function getEventDate() {
  var date = {};
  var year = $(".event-year").val();
  var month;
  var day;

  if ($(".event-month").val().length === 1) {
    month = `0${$(".event-month").val()}`;
  } else {
    month = $(".event-month").val();
  }

  if ($(".event-date").val().length === 1) {
    day = `0${$(".event-day").val()}`;
  } else {
    day = $(".event-day").val();
  }

  date.start = `${year}-${month}-${day}T00:00:00Z`;
  date.end = `${year}-${month}-${day}T23:59:59Z`;

  return date;
}

/***************************************************************************
 * handleConcertClick - when concert clicked, render map with markers
 * @param {object} event  The event object from the click
 * @returns:
 * @calls: ticketmasterAjaxCall, render map
 */

/***************************************************************************
 * renderShowsOnDOM - create DOM elements for each show in list, update the on-page list of shows
 * @param: {object} return information from ticketmaster Ajax call
 * @returns {undefined} none
 * @calls: none
 */

 /***************************************************************************
  *function renderInitialMapa
  * create map on initial page load
  * @param {none}
  * @return {none}
  */

  function renderInitialMap(){
    var USA = {
      latitude: "39.011902",
      longitude: "-98.48424649999998"
    }
    map = new Map(USA, 4);
    map.renderMap();
  }

/***************************************************************************
 *function renderMap
 * create new map instance and render to page
 * @param {integer} zipcode of venue location
 * @param {string} event location lat and long
 * @return {none}
 * call createMarkers, call Map constructor,
 */

function renderMap(venueObject) {
  // var restaurantsNearby = getYelpRestaurants(venueObject.zipcode);
  // var barsNearby = getYelpBreweries(venueObject.zipcode);
  // map = new Map(venueObject, restaurantsNearby, barsNearby); //create new instance of map for venue location
  map = new Map(venueObject, 15); //TEST

  map.renderMap(); //render map to page
  map.renderAllMarkers();
  //get array of objects from yelp
  // map.createBarMarkers();
  // map.createRestaurantMarkers();
}

var exampleObject = { latitude: "33.6412", longitude: "-117.9188" };
var santabarbara = { latitude: "34.420830", longitude: "-119.698189", venueName: 'The Observatory' };

/***************************************************************************
 * function Map
 * @constructor - create map object with lat and long
 * @param {integer} zipcode of venue location
* @return {object} map

 */

class Map {
  constructor(venueObject,  zoom, restaurants, bars,) {
    this.latitude = parseFloat(venueObject.latitude);
    this.longitude = parseFloat(venueObject.longitude);
    this.bars = bars;
    this.restaurants = restaurants;
    this.markers = [];
    this.venueInfo = venueObject;
    this.zoom = zoom;
    // this.markerLocation = [];
  }
  renderMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: this.zoom
    });
    this.venueInfo.latLong = {lat: this.latitude, lng: this.longitude };
    var marker = new Marker(this.venueInfo, map, "http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
    this.markers.push(marker);
    return map;
  }
  renderAllMarkers() {
    //loop through list of markers
    this.markers.forEach(function(marker){
      marker.renderMarker(); //render marker to map
    })
  }
}

/***************************************************************************
 * function updateMap
 * when user zooms in and out, it will repopulate map with markers
 * @param {integer}
 * @return {object} map
 */

/***************************************************************************
 * function renderMarker
 * create render mark to page
 * @param {string}
 * @param {string} info about the event
 */

/***************************************************************************
 * function newMarker
 *constructor
 * create Makers and Labels
 * @param {string} venueInfo
 * @param {object} map
 * @return {object} marker
 */
 class Marker{
   constructor(venueInfo, map, markerColor){
     console.log(venueInfo)
     this.latLong = venueInfo.latLong;
     this.venueName = venueInfo.venueName;
     this.markerColor = markerColor;
     this.map = map;
   }
   renderMarker(){
     let marker = new google.maps.Marker({
        position:  this.latLong,
        map: this.map,
        label: this.venueName,
        icon:  this.markerColor
      })
      return marker;
    }
 }

/***************************************************************************
 *function getYelpRestaurants
 * get restaurants based on zip code
 * @param{object}
 * @returns [{object}]
 */
function getYelpRestaurants() {
  let yelpArrayOfRestaurants = [];
  let restaurantData;
  let ajaxConfig = {
    dataType: "json",
    url:
      "https://api.yelp.com/v3/businesses/search?location=92617&term='restaurants'&radius=40000",
    Method: "GET",
    Authorization:
      "Bearer pURiuoXhZlcO2BTtM2Rzs12nrUjIU9r-SBSKNv_Ma0C9vHSvmCnQRzq_nRyR59-XLCzVd3GlGzGUVSZANd1xOnY0JPvKrQiz94R4_1MdpKQC_yj8YUUB0U2nyl1dWnYx",
    data: {
      location: 90305,
      term: "food",
      radius: 40000
    },
    success: function(data) {
      console.log(data);
      for (
        let arrayIndex = 0;
        arrayIndex < data.businesses.length;
        arrayIndex++
      ) {
        let newObj = {};
        newObj.name = data.businesses[arrayIndex].name;
        newObj.address = data.businesses[arrayIndex].location.display_address;
        newObj.closed = data.businesses[arrayIndex].is_closed;
        newObj.rating = data.businesses[arrayIndex].rating;
        newObj.url = data.businesses[arrayIndex].url;
        newObj.phoneNumber = data.businesses[arrayIndex].display_phone;
        newObj.latitude = data.businesses[arrayIndex].latitude;
        newObj.longittude = data.businesses[arrayIndex].longitude;
        yelpArrayOfRestaurants.push(newObj);
      }
    },
    error: function() {
      console.error("The server returned no information.");
    }
  };
  $.ajax(ajaxConfig);
}

/***************************************************************************
 *function getYelpBreweries
 * get breweries based on zip code
 * @param{object}
 * @returns [{object}]
 */

/***************************************************************************
 * function splitYelpInfo
 * split apart each object received from yelp’s DB
 * @param{array of object} total info received
 * @return{object} per location
 */

/***************************************************************************
 *function getTicketMasterConcerts
 * get concerts and venue info based on zip code
 * @param{string} - zip code, date
 * @returns [{object}]
 */
function getTicketMasterConcerts(obj) {
  var data_object = {
    api_key: "2uJN7TQdB59TfTrrXsnGAJgrtKLrCdTi"
    // city: obj.city, state: obj.state, date: { start: st, end: obj.date.end }        }
  };
  $.ajax({
    data: data_object,
    dataType: "json",
    method: "get",
    url:
      "https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=2uJN7TQdB59TfTrrXsnGAJgrtKLrCdTi",
    success: function(response) {
      console.log(response);
    }
  });
}
