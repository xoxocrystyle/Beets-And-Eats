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

/***************************************************************************
 * function Map
 * @constructor - create map object with lat and long
 * @param {integer} zipcode of venue location
 * @return {object} map
 */
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
 * @param{object} - zip code, date
 * @returns [{object}]
 */
