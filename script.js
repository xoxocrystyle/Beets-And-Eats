$(document).ready(initializeApp);
var map;
var markers;
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
    return $(".city-name").val();
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
  var nextDay = "0" + (parseInt($(".event-day").val()) + 1);

  if ($(".event-month").val().length === 1) {
    month = `0${$(".event-month").val()}`;
  } else {
    month = $(".event-month").val();
  }

  if ($(".event-day").val().length === 1) {
    day = `0${$(".event-day").val()}`;
  } else {
    day = $(".event-day").val();
  }

  debugger;

  date.start = `${year}-${month}-${day}T00:00:00Z`;
  date.end = `${year}-${month}-${nextDay}T12:00:00Z`;

  return date;
}

/***************************************************************************
 * renderShowsOnDOM - create DOM elements for each show in list, update the on-page list of shows
 * @param: {object} return information from ticketmaster Ajax call
 * @returns {undefined} none
 * @calls: none
 */

// var test = {
//   eventDate: "2018-01-23",
//   eventImage: { url: "https://s1.ticketm.net/dam/a/441/6c483401-d57c-41b7-aee7-bb94e5b58441_29091_ARTIST_PAGE_3_2.jpg" },
//   eventName: "Los Angeles Lakers vs. Boston Celtics",
//   generalInfo:
//     "No Bottles, Cans, Or Coolers. No Smoking In Arena. No Cameras Or Recording Devices At Concerts! Cameras w/No Flash Allowed For Sporting Events Only!",
//   latitude: "34.043003",
//   longitude: "-118.267253",
//   startTime: "19:30:00",
//   ticketUrl: "http://www.ticketmaster.com/staples-center-tickets-los-angeles/venue/360457",
//   venueName: "STAPLES Center",
//   zipCode: "90015"
// };

function renderShowsOnDOM(eventDetails) {
  var row = $("<div>").addClass("show-listing row");
  var showImg = $("<img>")
    .addClass("col-lg-2 hidden-")
    .attr("src", eventDetails.eventImage.url);
  var showContent = $("<div>").addClass("col-lg-8");
  var showName = $("<h3>")
    .addClass("show-name")
    .text(eventDetails.eventName);
  var showDetails = $("<p>").addClass("show-details");
  var showDate = `${eventDetails.eventDate.slice(5)}-${eventDetails.eventDate.slice(0, 4)}`;
  var showTime = parseInt(eventDetails.startTime.slice(0, 2));
  var showVenue = eventDetails.venueName;

  if (showTime > 12) {
    var showHour = showTime - 12;
    showTime = `${showHour}:${eventDetails.startTime.slice(3, 5)} PM`;
  } else {
    showTime = `${eventDetails.startDate.slice(0, 5)} AM`;
  }

  showDetails.text(`${showVenue} - ${showDate}, ${showTime}`);

  $(showContent).append(showName, showDetails);
  $(row).append(showImg, showContent);
  $(".show-container").append(row);
}

/***************************************************************************
 *function renderInitialMap
 * create map on initial page load
 * @param {none}
 * @return {none}
 */

function renderInitialMap() {
  var losAngeles = {lat: 33.9584404, lng: -118.3941214};

  map = new google.maps.Map(document.getElementById('map'), {
          center: losAngeles,
          zoom: 12
        })
}

/***************************************************************************
 *function createMap
 * create new map
 * @param {object} information
 * @return {none}
 */
function createMap(){
  map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 33.9596, lng: -118.3287},
          zoom: 15
        })
  getYelpBreweries();
  getYelpRestaurants();
}

/***************************************************************************
 * function createMarkers
 * create render mark to page
 * @param {array} array of locations
 * @param {string} color color for markers
 */

 function createMarkers(array, color){
   for(var location = 0; location<array.length; location++){
     var place = array[location];
     var latLong = {lat: place.latitude, lng: place.longitude};
     let marker = new google.maps.Marker({
       position: latLong,
       map: map,
       // label: this.locationInfo,
       icon: color
     });
     // var content = createContent(place);
     var contentString = '<h3>' + place.name + '</h3><h4>' + place.address+ '</h4><h4>' + place.phoneNumber + '</h4><h4>' + place.rating + '</h4><h4>Open:' + place.closed +'</h4><a href=' + place.url + ' target=\'_blank\'>Website:</a>'
     var infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
   }

 }

 function createContent(object){
   var windowInfo = $('<h1>').text(object.name);
   return windowInfo;
 }

/***************************************************************************
 *function getYelpRestaurants
 * get restaurants based on zip code
 * @param{object}
 * @returns [{object}]
 */
function getYelpRestaurants() {
  let yelpArrayOfRestaurants = [];
  let ajaxConfig = {
    dataType: "json",
    url: "http://danielpaschal.com/yelpproxy.php",
    method: "GET",
    data: {
      location: 90305,
      term: "food",
      radius: 40000,
      api_key: "VFceJml03WRISuHBxTrIgwqvexzRGDKstoC48q7UrkABGVECg3W0k_EILnHPuHOpSoxrsX07TkDH3Sl9HtkHQH8AwZEmj6qatqtCYS0OS9Ul_A02RStw_TY7TpteWnYx"
    },
    success: function(data) {
      for (let arrayIndex = 0; arrayIndex < data.businesses.length; arrayIndex++) {
        let newObj = {};
        newObj.name = data.businesses[arrayIndex].name;
        newObj.address = data.businesses[arrayIndex].location.display_address.join("\n");
        newObj.closed = data.businesses[arrayIndex].is_closed;
        newObj.rating = data.businesses[arrayIndex].rating;
        newObj.url = data.businesses[arrayIndex].url;
        newObj.phoneNumber = data.businesses[arrayIndex].display_phone;
        newObj.latitude = data.businesses[arrayIndex].coordinates.latitude;
        newObj.longitude = data.businesses[arrayIndex].coordinates.longitude;
        yelpArrayOfRestaurants.push(newObj);
      }
      createMarkers(yelpArrayOfRestaurants, 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
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

function getYelpBreweries() {
  let yelpArrayOfBreweries = [];
    let ajaxConfig = {
        dataType: "json",
        url: "http://danielpaschal.com/yelpproxy.php",
        method: "GET",
        data: {
            location: 90305,
            term: "bar",
            radius: 40000,
            api_key: 'VFceJml03WRISuHBxTrIgwqvexzRGDKstoC48q7UrkABGVECg3W0k_EILnHPuHOpSoxrsX07TkDH3Sl9HtkHQH8AwZEmj6qatqtCYS0OS9Ul_A02RStw_TY7TpteWnYx'
        },
        success: function(data) {
            for (let arrayIndex = 0; arrayIndex < data.businesses.length; arrayIndex++) {
                let newObj = {};
                newObj.name = data.businesses[arrayIndex].name;
                newObj.address = data.businesses[arrayIndex].location.display_address.join('\n');
                newObj.closed = data.businesses[arrayIndex].is_closed;
                newObj.rating = data.businesses[arrayIndex].rating;
                newObj.url = data.businesses[arrayIndex].url;
                newObj.phoneNumber = data.businesses[arrayIndex].display_phone;
                newObj.latitude = data.businesses[arrayIndex].coordinates.latitude;
                newObj.longitude = data.businesses[arrayIndex].coordinates.longitude;
                yelpArrayOfBreweries.push(newObj);
            }
            createMarkers(yelpArrayOfBreweries, 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
        },
        error: function() {
            console.error("The server returned no information.");
        }
    };
    $.ajax(ajaxConfig);
}

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
  console.log(obj);
  var data_object = {
    api_key: "2uJN7TQdB59TfTrrXsnGAJgrtKLrCdTi",
    city: obj.city,
    stateCode: obj.state,
    startDateTime: obj.date.start,
    endDateTime: obj.date.end,
    radius: 20
  };
  $.ajax({
    data: data_object,
    dataType: "json",
    method: "get",
    url: "https://app.ticketmaster.com/discovery/v2/events.json?&apikey=2uJN7TQdB59TfTrrXsnGAJgrtKLrCdTi",
    success: function(response) {
      console.log(response);
      var data = [];
      var allEventsObj = response._embedded.events;
      for (var tmData_i = 0; tmData_i < allEventsObj.length; tmData_i++) {
        var eventObj = createEventObject(allEventsObj[tmData_i]);
        renderShowsOnDOM(eventObj);
        data.push(eventObj);
      }

      //   $(".show-listing").on("click", handleConcertClick);
    }
  });
}

function createEventObject(event) {
  var object = {};
  object.eventName = event.name;
  object.startTime = event.dates.start.localTime;
  object.latitude = event._embedded.venues[0].location.latitude;
  object.longitude = event._embedded.venues[0].location.longitude;
  object.zipCode = event._embedded.venues[0].postalCode;
  object.venueName = event._embedded.venues[0].name;
  object.generalInfo = event._embedded.venues[0].generalInfo.generalRule;
  object.ticketUrl = event._embedded.venues[0].url;
  object.eventImage = event.images[0];
  object.eventDate = event.dates.start.localDate;
  return object;
}
