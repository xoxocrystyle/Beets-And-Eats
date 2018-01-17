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
  scrollPage("event");
  resetInputs();
}

/***************************************************************************
 * resetInputs - gets city and state code from user input and returns information in object
 * @param: {undefined} none
 * @returns: object
 * @calls: inputCityCheck, getStateFromDropDown, getEventDate
 */
function resetInputs() {
  $(".city-name").val("");
  $(".state-code").val("");
  $(".event-year").val("");
  $(".event-month").val("");
  $(".event-day").val("");
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
  var month = $(".event-month").val();
  var day = $(".event-day").val();

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

  var startDay = new Date(year, month - 1, day, 0, 0, 0);
  startDay.toDateString();
  var utcStartDay = startDay.toUTCString();
  startDay = new Date(utcStartDay);

  var endDay = new Date(year, month - 1, day, 23, 59, 59);
  endDay.toDateString();
  var utcEndDay = endDay.toUTCString();
  endDay = new Date(utcEndDay);

  date.start = startDay.toISOString().slice(0, -5);
  date.start += "Z";
  date.end = endDay.toISOString().slice(0, -5);
  date.end += "Z";

  return date;
}

/***************************************************************************
 * handleConcertClick - when concert clicked, render map with markers
 * @param {object} event  The event object from the click
 * @returns:
 * @calls: ticketmasterAjaxCall, render map
 */
function handleConcertClick(eventObj) {
  let latLng = { lat: parseFloat(eventObj.latitude), lng: parseFloat(eventObj.longitude) };
  map = new google.maps.Map(document.getElementById("map"), {
    center: latLng,
    zoom: 15
  });
  let marker = new google.maps.Marker({
    position: latLng,
    map: map,
  });
  getYelpBreweries(latLng);
  getYelpRestaurants(latLng);
}

/***************************************************************************
 * renderShowsOnDOM - create DOM elements for each show in list, update the on-page list of shows
 * @param: {object} return information from ticketmaster Ajax call
 * @returns {undefined} none
 * @calls: none
 */

function renderShowsOnDOM(eventDetailsArray) {
  var row;

  for (var index = 0; index < eventDetailsArray.length; index++) {
    if (index % 2 === 0) {
      row = $("<div>").addClass("row");
      row.append(createShowDOMElement(eventDetailsArray[index]));
    } else {
      row.append(createShowDOMElement(eventDetailsArray[index]));
      $(".show-container").append(row);
    }
  }
}

function createShowDOMElement(eventDetails) {
  var listing = $("<div>", {
    class: "show-listing",
    on: {
      click: function() {
        handleConcertClick(eventDetails);
        scrollPage("map");
        let info = populateEventSideBar(eventDetails);
        $('.eventInfo').empty();
        $('.eventInfo').append(info);

      }
    }
  });
  var artistImage = $("<div>").addClass("col-lg-3 col-xs-4 artist");
  var image = $("<img>").attr("src", eventDetails.eventImage.url);
  var showInfo = $("<div>").addClass("show-info col-lg-3 col-xs-8");
  var showName = $("<p>")
    .text(eventDetails.eventName)
    .addClass("show-name");
  var showDetails = $("<p>").addClass("show-details hidden-xs hidden-sm");
  var ticketLink = $("<a>")
    .attr("src", eventDetails.ticketURL)
    .text("BUY TICKETS")
    .addClass("ticket-link hidden-xs hidden-sm");
  var mobileTicketLink = $("<a>")
    .attr("src", eventDetails.ticketURL)
    .text("BUY TICKETS")
    .addClass("ticket-link hidden-md hidden-lg");
  var showDate = `${eventDetails.eventDate.slice(5)}-${eventDetails.eventDate.slice(0, 4)}`;
  var showTime = parseInt(eventDetails.startTime.slice(0, 2));
  var showVenue = $("<p>")
    .text(`Venue: ${eventDetails.venueName}`)
    .addClass("show-venue hidden-xs hidden-sm");
  var mobileDetails = $("<p>").addClass("mobile-details hidden-md hidden-lg");

  if (showTime > 12) {
    var showHour = showTime - 12;
    showTime = `${showHour}:${eventDetails.startTime.slice(3, 5)} PM`;
  } else {
    showTime = `${eventDetails.startTime.slice(0, 5)} AM`;
  }

  showDetails.text(`Date & Time: ${showDate}, ${showTime}`);
  mobileDetails.text(`${eventDetails.venueName} - ${showDate}, ${showTime}`);

  artistImage.append(image);
  showInfo.append(mobileTicketLink, showName, mobileDetails, showDetails, showVenue, ticketLink);
  listing.append(artistImage, showInfo);

  return listing;
}

/***************************************************************************
 *function renderInitialMap
 * create map on initial page load
 * @param {none}
 * @return {none}
 */
function renderInitialMap() {
  var losAngeles = { lat: 33.9584404, lng: -118.3941214 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: losAngeles,
    zoom: 12
  });
}

/***************************************************************************
 * function createMarkers
 // * create render mark to page
 * @param {array} array of locations
 * @param {string} color color for markers
 */
function createMarkers(array, color) {
  for (var location = 0; location < array.length; location++) {
    var place = array[location];
    renderMarker(place, color);
  }
}

/***************************************************************************
 *function renderMarker
 * create marker and render to page and add click listenr
 * @param{object} object of location information
 * @param{string} url of marker color
 * @returns [string] content stringified
 */

function renderMarker(place, color) {
  var latLong = { lat: place.latitude, lng: place.longitude };
  let marker = new google.maps.Marker({
    position: latLong,
    map: map,
    icon: color
  });
  // var content = createContent(place);

  var infowindow = new google.maps.InfoWindow({
    content: getContentString(place)
  });

  marker.addListener("click", function() {
    infowindow.open(map, marker);
    let info = populateFoodSideBar(place);
    $('.foodInfo').empty();
    $('.foodInfo').append(info);
  });
}

/***************************************************************************
 *function getContentString
 * create information for marker window
 * @param{object} object of location information
 * @returns [string] content stringified
 */
function getContentString(place){
  if(place.closed === false) {
    place.closed = 'Open';
  } else {
    place.closed = 'Closed';
  }
  var contentString =
    "<h3>" +
    place.name +
    "</h4><h4>" +
    place.phoneNumber +
    "</h4><h4>" +
    place.closed;
    return contentString;
}

/***************************************************************************
 *function populateSideBar
 * populate side bar with location information
 * @param{object} object of location information
 * @returns [object] createddom element
 */
function populateFoodSideBar(place){
  let container = $('<div>');
  let name = $('<h4>',{
    'text': place.name
  });
  let number = $('<p>', {
    'text': place.name
  });
  let address = $('<p>', {
    'text': place.address
  });
  let rating = $('<p>', {
    'text': place.rating
  });
  let yelp = $('<a>', {
    'href': place.url,
    'text': 'website'
  });
  let distance = $('<p>', {
      'text': place.distance
  });
  container.append(name, address, number, rating, yelp);
  return container;
}

/***************************************************************************
 *function populateEventSideBar
 * populate side bar with event information
 * @param{object} object of event information
 * @returns [object] createddom element
 */
function populateEventSideBar(eventLocation){
  let container = $('<div>');
  let image = $('<img>', {
    'src': eventLocation.eventImage.url,
    'class': 'eventImage'
  })
  let eventName = $('<h4>',{
    'text': eventLocation.eventName
  })
  let venueName = $('<h4>',{
    'text': eventLocation.venueName
  })
  let time = $('<p>', {
    'text': eventLocation.startTime
  })
  let tickets = $('<a>', {
    'href': eventLocation.ticketURL,
    'text': 'Buy Tickets'
  })
  container.append(image, eventName, venueName, time, tickets);
  return container;
}


/***************************************************************************
 *function getYelpRestaurants
 * get restaurants based on zip code
 * @param{object}
 * @returns [{object}]
 */
function getYelpRestaurants(latLng) {
  let yelpArrayOfRestaurants = [];
  let ajaxConfig = {
    dataType: "json",
    url: "http://danielpaschal.com/yelpproxy.php",
    method: "GET",
    data: {
      latitude: latLng.lat,
      longitude: latLng.lng,
      term: "food",
      radius: 40000,
      api_key:
        "VFceJml03WRISuHBxTrIgwqvexzRGDKstoC48q7UrkABGVECg3W0k_EILnHPuHOpSoxrsX07TkDH3Sl9HtkHQH8AwZEmj6qatqtCYS0OS9Ul_A02RStw_TY7TpteWnYx"
    },
    success: function(data) {
        console.log(data);
        for (let arrayIndex = 0; arrayIndex < data.businesses.length; arrayIndex++) {
            let newObj = createYelpObj(data, arrayIndex);
            yelpArrayOfRestaurants.push(newObj);
        }
      createMarkers(yelpArrayOfRestaurants, "http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
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
function getYelpBreweries(latLng) {
  let yelpArrayOfBreweries = [];
  let ajaxConfig = {
    dataType: "json",
    url: "http://danielpaschal.com/yelpproxy.php",
    method: "GET",
    data: {
      latitude: latLng.lat,
      longitude: latLng.lng,
      term: "bar",
      radius: 40000,
      api_key:
        "VFceJml03WRISuHBxTrIgwqvexzRGDKstoC48q7UrkABGVECg3W0k_EILnHPuHOpSoxrsX07TkDH3Sl9HtkHQH8AwZEmj6qatqtCYS0OS9Ul_A02RStw_TY7TpteWnYx"
    },
    success: function(data) {
      console.log(data);
      for (let arrayIndex = 0; arrayIndex < data.businesses.length; arrayIndex++) {
        let newObj = createYelpObj(data, arrayIndex);
        yelpArrayOfBreweries.push(newObj);
      }
      createMarkers(yelpArrayOfBreweries, "images/yellow-dot.png");
    },
    error: function() {
      console.error("The server returned no information.");
    }
  };
  $.ajax(ajaxConfig);
}

/***************************************************************************
 * function createYelpObj
 * create an object for each iteration of the yelp ajax call
 * @param{object, arrayIndex} event object and current Index
 * @return{object} per location
 */
function createYelpObj(data, arrayIndex) {
    let newObj = {};
    newObj.name = data.businesses[arrayIndex].name;
    newObj.address = data.businesses[arrayIndex].location.display_address.join("\n");
    newObj.closed = data.businesses[arrayIndex].is_closed;
    newObj.rating = data.businesses[arrayIndex].rating;
    newObj.url = data.businesses[arrayIndex].url;
    newObj.image = data.businesses[arrayIndex].image_url;
    newObj.distance = (data.businesses[arrayIndex].distance * 0.00062137);
    newObj.phoneNumber = data.businesses[arrayIndex].display_phone;
    newObj.latitude = data.businesses[arrayIndex].coordinates.latitude;
    newObj.longitude = data.businesses[arrayIndex].coordinates.longitude;
    return newObj;
}

/***************************************************************************
 *function getTicketMasterConcerts
 * get concerts and venue info based on zip code
 * @param{string} - zip code, date
 * @returns [{object}]
 */
function getTicketMasterConcerts(obj) {
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
    url:
      "https://app.ticketmaster.com/discovery/v2/events.json?&apikey=2uJN7TQdB59TfTrrXsnGAJgrtKLrCdTi",
    success: function(response) {
      var data = [];
      $(".show-container").empty();
      var allEventsObj = response._embedded.events;
      for (var tmData_i = 0; tmData_i < allEventsObj.length; tmData_i++) {
        if (!allEventsObj[tmData_i]._embedded.venues[0].location) {
          continue;
        }
        var eventObj = createEventObject(allEventsObj, tmData_i);
        renderShowsOnDOM(eventObj);
        data.push(eventObj);
      }
      renderShowsOnDOM(data);
    }
  });
}

/***************************************************************************
 * function createEventObject
 * create object with information from shows that will be used later in the app
 * @param{array of object} total info received
 * @return{object} per location
 */
function createEventObject(event, index) {
  var object = {};
  object.eventName = event[index].name;
  object.startTime = event[index].dates.start.localTime;
  object.latitude = event[index]._embedded.venues[0].location.latitude;
  object.longitude = event[index]._embedded.venues[0].location.longitude;
  object.zipCode = event[index]._embedded.venues[0].postalCode;
  object.venueName = event[index]._embedded.venues[0].name;
  object.ticketURL = event[index].url;
  object.venueUrl = event[index]._embedded.venues[0].url;
  object.eventImage = event[index].images[0];
  object.eventDate = event[index].dates.start.localDate;
  object.note = event[index].pleaseNote;
  return object;
}

function scrollPage(element) {
  switch (element) {
    case "event":
      $("html, body").animate(
        {
          scrollTop: $("#event-page").offset().top - 60
        },
        1500
      );
      break;
    case "map":
      $("html, body").animate(
        {
          scrollTop: $("#map").offset().top - 60
        },
        2000
      );
      break;
  }
}