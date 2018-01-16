/***************************************************************************
 * initializeApp - add click handler to search button, render landing page
 * @params {undefined}
 * @returns  {undefined}
 */

function initializeApp() {
  $(".submit-button").on("click", handleSearchButtonClick);
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
*function renderMap
 * create new map instance and render to page
 * @param {integer} zipcode of venue location
* @param {string} event location lat and long
 * @return {none}
 * call createMarkers, call Map constructor,
 */

 function renderMap(venueObject) {
   var restaurantsNearby = getYelpRestaurants(venueObject.zipcode);
   var barsNearby = getYelpBreweries(venueObject.zipcode);
   map = new Map(venueObject, restaurantsNearby, barsNearby); //create new instance of map for venue location
   map.renderMap(); //render map to page
   //get array of objects from yelp
   map.createBarMarkers()
   map.createRestaurantMarkers()

}

var exampleObject = {latitude: "33.6412", longitude: "-117.9188" }
var santabarbara = {latitude: "34.420830", longitude: "-119.698189" }


/***************************************************************************
 * function Map
 * @constructor - create map object with lat and long
 * @param {integer} zipcode of venue location
* @return {object} map

 */

 class Map{
   constructor(venueObject, restaurants, bars){
     this.latitude = parseFloat(venueObject.latitude);
     this.longitude = parseFloat(venueObject.longitude);
     this.bars = bars;
     this.restaurants = restaurants;
     // this.markerLocation = [];
    };
    renderMap(){
      var map = new google.maps.Map(document.getElementById('map'), {
       center: {lat: this.latitude, lng: this.longitude},
       zoom: 15
     })
      return map;
   }
   createMarkers(){
     //
   }
 }

/***************************************************************************
* function updateMap
* when user zooms in and out, it will repopulate map with markers
 * @param {integer}
* @return {object} map
 */

/***************************************************************************
 * function renderMarkers
 * create render mark to page
 * @param {string}
 * @param {string} info about the event
 */

/***************************************************************************
* function newMarker
*constructor
 * create Makers and Labels
 * @param {string} location
 * @param {string} event venue information
 * @return {object} marker
 */

/***************************************************************************
*function getYelpRestaurants
* get restaurants based on zip code
* @param{object}
* @returns [{object}]
*/

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

function getTicketMasterConcerts (obj) {
    var data_object = {
        api_key: '2uJN7TQdB59TfTrrXsnGAJgrtKLrCdTi',
        // city: obj.city, state: obj.state, date: { start: st, end: obj.date.end }        } 
    };
    $.ajax({
        data: data_object,
        dataType: 'json',
        method: 'get',
        url: 'https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=2uJN7TQdB59TfTrrXsnGAJgrtKLrCdTi,
        success: function(response) {
            console.log(response)
        }
    })
}
