$(document).ready(initializeApp);
let map;
let markers;
let infoWindow;
/***************************************************************************
 * initializeApp - add click handler to search button, render landing page
 * @params {undefined}
 * @returns  {undefined}
 */
function initializeApp() {
	$(".submit-button").on("click", handleSearchButtonClick);
	$(".start_button").on("click", handleStartButtonClick);
	$(".event-month").on("click", removeDefaultSearch);
	$(".event-day").on("click", removeDefaultSearch);
	$(".event-year").on("click", removeDefaultSearch);
	defaultDate();
}

/***************************************************************************
 * renderInitialMap - creates Google map on initial page load
 * @param {none}
 * @return {none}
 */
function renderInitialMap() {
	let usa = { lat: 33.9584404, lng: -118.3941214 };
	map = new google.maps.Map(document.getElementById("map"), {
		center: usa,
		zoom: 3
	});
	infoWindow = new google.maps.InfoWindow();
}

/***************************************************************************
 * defaultDate - adds current day as default in date search fields
 * @param {none}
 * @return {none}
 */
function defaultDate() {
	var currentDay = new Date();
	var month = currentDay.getMonth() + 1;
	var day = currentDay.getDate();
	var year = currentDay.getFullYear();

	$(".event-month").val(month);
	$(".event-day").val(day);
	$(".event-year").val(year);
}

/***************************************************************************
 * removeDefaultSearch - removes default value in input on click
 * @param event.target
 * @return {none}
 */
function removeDefaultSearch() {
	$(this).val("");
}

/***************************************************************************
 * handleStartButtonClick - when start button is clicked, scroll down to search section
 * @param {object} event  The event object from the click
 * @returns: none
 * @calls: scrollPage
 */
function handleStartButtonClick() {
	scrollPage("#search-page");
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
	let event = {};
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
	return $(".city-name").val();
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
	let date = {};
	let year = $(".event-year").val();
	let month = $(".event-month").val();
	let day = $(".event-day").val();

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

	let startDay = new Date(year, month - 1, day, 0, 0, 0);
	startDay.toDateString();
	let utcStartDay = startDay.toUTCString();
	startDay = new Date(utcStartDay);

	let endDay = new Date(year, month - 1, day, 23, 59, 59);
	endDay.toDateString();
	let utcEndDay = endDay.toUTCString();
	endDay = new Date(utcEndDay);

	date.start = startDay.toISOString().slice(0, -5);
	date.start += "Z";
	date.end = endDay.toISOString().slice(0, -5);
	date.end += "Z";

	return date;
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
	$(".error-message")
		.empty()
		.removeClass("bg-danger");
}

/***************************************************************************
 * getTicketMasterConcerts - gets concerts and venue info based on zip code
 * @param{string} - zip code, date
 * @returns [{object}]
 */
function getTicketMasterConcerts(obj) {
	let data_object = {
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
		success: function (response) {
			if (!response._embedded) {
				searchErrorAlert();
				return;
			}
			scrollPage("#event-page");
			setTimeout(resetInputs, 1500);
			let data = [];
			$(".show-container").empty();
			let allEventsObj = response._embedded.events;
			for (let tmData_i = 0; tmData_i < allEventsObj.length; tmData_i++) {
				if (!allEventsObj[tmData_i]._embedded.venues[0].location) {
					continue;
				}
				let eventObj = createEventObject(allEventsObj, tmData_i);
				data.push(eventObj);
			}
			renderShowsOnDOM(data);
		}
	});
}

/***************************************************************************
 * getYelpData - get restaurants or bars based on latitude and longitude
 * @param{object} - {latLng}
 * @param{string} - type of location
 * @param{string} - color of marker
 * @calls: createMarkers
 */
function getYelpData(latLng, type, color) {
	let arrayOfPlaces = [];
	let ajaxConfig = {
		dataType: "json",
		url: "http://danielpaschal.com/yelpproxy.php",
		method: "GET",
		data: {
			latitude: latLng.lat,
			longitude: latLng.lng,
			term: type,
			radius: 40000,
			api_key:
				"VFceJml03WRISuHBxTrIgwqvexzRGDKstoC48q7UrkABGVECg3W0k_EILnHPuHOpSoxrsX07TkDH3Sl9HtkHQH8AwZEmj6qatqtCYS0OS9Ul_A02RStw_TY7TpteWnYx"
		},
		success: function (data) {
			for (let arrayIndex = 0; arrayIndex < data.businesses.length; arrayIndex++) {
				let newObj = createYelpObj(data, arrayIndex);
				arrayOfPlaces.push(newObj);
			}
			createMarkers(arrayOfPlaces, color);
		},
		error: function () {
			console.error("The server returned no information.");
		}
	};
	$.ajax(ajaxConfig);
}

/***************************************************************************
 * handleConcertClick - when concert clicked, render map with markers
 * @param {object} event  The event object from the click
 * @returns:
 * @calls: ticketmasterAjaxCall, render map
 */
function handleConcertClick(eventObj) {
	let latLng = {
		lat: parseFloat(eventObj.latitude),
		lng: parseFloat(eventObj.longitude)
	};
	map = new google.maps.Map(document.getElementById("map"), {
		center: latLng,
		zoom: 16
	});
	let marker = new google.maps.Marker({
		position: latLng,
		map: map
	});

	marker.addListener("click", function () {
		openVenueWindow(eventObj, marker);
	});

	$(".foodInfo  .sectionInfo").remove();
	getYelpData(latLng, "bar", "images/yellow-dot.png");
	getYelpData(latLng, "food", "images/blue-dot.png");
}
/***************************************************************************
 * openVenueWindow - opens marker window for venue marker
 * @param: {object} - place
 * @param: {object} - marker
 * @returns {undefined} none
 */

function openVenueWindow(place, marker) {
	infoWindow.close();
	infoWindow = new google.maps.InfoWindow({
		content: "<h4>" + place.venueName + "</h4>"
	});
	infoWindow.open(map, marker);
}

/***************************************************************************
 * renderShowsOnDOM - appends show DOM elements to DOM
 * @param: {object} return information from ticketmaster Ajax call
 * @returns {undefined} none
 * @calls: createShowDOMElement
 */

function renderShowsOnDOM(eventDetailsArray) {
	let row;
	let title = $("<div>", {
		class: "show_tag_line"
	});
	let titleText = $("<span>").text("Choose Your Event");
	title.append(titleText);
	$(".show-container").append(title);

	for (let index = 0; index < eventDetailsArray.length; index++) {
		if (index % 2 === 0) {
			row = $("<div>").addClass("row");
			row.append(createShowDOMElement(eventDetailsArray[index]));
		} else {
			row.append(createShowDOMElement(eventDetailsArray[index]));
			$(".show-container").append(row);
		}
	}
}
/***************************************************************************
 * createShowDOMElement - create DOM elements for each show in list, update the on-page list of shows
 * @param: {object} return information from ticketmaster Ajax call
 * @returns {undefined} DOM element
 */

function createShowDOMElement(eventDetails) {
	let listing = $("<div>", {
		class: "show-listing col-lg-6 col-md-6 col-xs-12 col-sm-12",
		on: {
			click: function () {
				handleConcertClick(eventDetails);
				scrollPage("#map");
				let info = populateEventSideBar(eventDetails);
				$(".eventInfo .sectionInfo").remove();
				$(".eventInfo").append(info);
			}
		}
	});
	let listingRow = $("<div>").addClass("listing row");
	let artistImage = $("<div>").addClass("artist col-lg-6 col-md-6 col-xs-6 col-sm-6");
	let imageDiv = $("<div>").addClass("image-div");
	let image = $("<img>")
		.attr("src", eventDetails.eventImage.url)
		.addClass("show-image");
	let showInfo = $("<div>").addClass("show-info col-lg-6 col-md-6 col-xs-6 col-sm-6");
	let showName = $("<p>")
		.text(eventDetails.eventName)
		.addClass("show-name");
	let showDetails = $("<p>").addClass("show-details hidden-xs hidden-sm");
	let showDate = `${eventDetails.eventDate.slice(5)}-${eventDetails.eventDate.slice(0, 4)}`;
	let showTime = parseInt(eventDetails.startTime.slice(0, 2));
	let showVenue = $("<p>")
		.text(`Venue: ${eventDetails.venueName}`)
		.addClass("show-venue hidden-xs hidden-sm");
	let mobileDetails = $("<p>").addClass("mobile-details hidden-md hidden-lg");

	if (showTime > 12) {
		let showHour = showTime - 12;
		showTime = `${showHour}:${eventDetails.startTime.slice(3, 5)} PM`;
	} else {
		showTime = `${eventDetails.startTime.slice(0, 5)} AM`;
	}

	showDetails.text(`Date & Time: ${showDate}, ${showTime}`);
	mobileDetails.text(`${eventDetails.venueName} - ${showDate}, ${showTime}`);

	imageDiv.append(image);
	artistImage.append(imageDiv);
	showInfo.append(showName, mobileDetails, showDetails, showVenue);
	listingRow.append(artistImage, showInfo);
	listing.append(listingRow);

	return listing;
}

/***************************************************************************
 * createMarkers - create render mark to page
 * @param {array} array of locations
 * @param {string} color color for markers
 * @call: renderMarker
 */
function createMarkers(array, color) {
	for (let location = 0; location < array.length; location++) {
		let place = array[location];
		renderMarker(place, color);
	}
}

/***************************************************************************
 * renderMarker - create marker and render to page and add click listener
 * @param{object} object of location information
 * @param{string} url of marker color
 * @returns [string] content stringified
 */

function renderMarker(place, color) {
	let latLong = { lat: place.latitude, lng: place.longitude };
	let marker = new google.maps.Marker({
		position: latLong,
		map: map,
		icon: color
	});

	marker.addListener("click", function () {
		openWindow(place, marker);
	});
}
/***************************************************************************
 * openWindow - closes existing marker window and opens a new marker window with new information
 * @param{object} object of location information
 * @param{string} marker
 */

function openWindow(place, marker) {
	infoWindow.close();
	infoWindow = new google.maps.InfoWindow({
		content: getContentString(place)
	});

	infoWindow.open(map, marker);
	$(".foodInfo > .sectionInfo").remove(); //empty the existing info
	let info = populateFoodSideBar(place);
	$(".foodInfo").append(info);
}

/***************************************************************************
 * getContentString - create information for marker window
 * @param{object} object of location information
 * @returns [string] content stringified
 */
function getContentString(place) {
	var eventLocation = $("span.eventLocation").text();
	if (place.closed === false) {
		place.closed = "Open";
	} else {
		place.closed = "Closed";
	}
	let contentString = `<a href=${place.url} target="_blank">
			<h4>${place.name}</h4>
		</a>
		<p>${place.phoneNumber}</p>
		<p>${place.distance.toFixed(2)} miles away from ${eventLocation}</p>
		<p>${place.price}</p>`;

	return contentString;
}

/***************************************************************************
 * populateSideBar - populate side bar with location information
 * @param{object} object of location information
 * @returns [object] createddom element
 */

function populateFoodSideBar(place) {
	let container = $("<div>").addClass("sectionInfo");
	let image = $("<div>", {
		class: "foodImage",
		css: {
			"background-image": 'url("' + place.image + '")'
		}
	});
	let name = $("<h3>", {
		text: place.name,
		class: "map-food-name"
	});
	let number = $("<p>", {
		text: place.phoneNumber
	});
	let address = $("<p>", {
		text: place.address
	});
	let rating = $("<p>", {
		text: "Rating: " + place.rating
	});
	let price = $("<p>", {
		text: "Price: " + place.price
	});
	let distance = $("<p>", {
		text: place.distance.toFixed(2) + " miles away from venue"
	});
	let yelp = $("<a>", {
		href: place.url,
		text: "WEBSITE",
		target: "_blank",
		css: {
			"display": "block",
			"text-align": "center",
			"font-size": "18px"
		}
	});
	container.append(image, name, yelp, distance, address, number, rating, price);
	return container;
}

/***************************************************************************
 * populateEventSideBar - populate side bar with event information
 * @param{object} object of event information
 * @returns [object] createddom element
 */
function populateEventSideBar(eventLocation) {
	let container = $("<div>").addClass("sectionInfo");
	let image = $("<div>", {
		class: "eventImage",
		css: {
			"background-image": 'url("' + eventLocation.eventImage.url + '")'
		}
	});
	let eventName = $("<h3>", {
		text: eventLocation.eventName,
		class: "map-event-name"
	});
	let venueName = $("<p>", {
		html: "Venue: " + `<span class="eventLocation">${eventLocation.venueName}</span>`
	});
	let time = $("<p>", {
		text: "Event Time: " + eventLocation.startTime
	});
	let tickets = $("<a>", {
		href: eventLocation.ticketURL,
		text: "BUY TICKETS",
		target: "_blank"
	});
	container.append(image, eventName, venueName, time, tickets);
	return container;
}

/***************************************************************************
 * createYelpObj - creates an object for each iteration of the yelp ajax call
 * @param{object, arrayIndex} event object and current Index
 * @return{object} per location
 */
function createYelpObj(data, arrayIndex) {
	let newObj = {};
	newObj.name = data.businesses[arrayIndex].name;
	newObj.address = data.businesses[arrayIndex].location.display_address.join("\n");
	newObj.closed = data.businesses[arrayIndex].is_closed;
	newObj.price = data.businesses[arrayIndex].price;
	newObj.rating = data.businesses[arrayIndex].rating;
	newObj.url = data.businesses[arrayIndex].url;
	newObj.image = data.businesses[arrayIndex].image_url;
	newObj.distance = data.businesses[arrayIndex].distance * 0.00062137;
	newObj.phoneNumber = data.businesses[arrayIndex].display_phone;
	newObj.latitude = data.businesses[arrayIndex].coordinates.latitude;
	newObj.longitude = data.businesses[arrayIndex].coordinates.longitude;
	return newObj;
}

/***************************************************************************
 * createEventObject - creates object with information from shows that will be used later in the app
 * @param{array of object} total info received
 * @return{object} per location
 */
function createEventObject(event, index) {
	let object = {};
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

/***************************************************************************
 * searchErrorAlert - notifies user search returned no results
 * @param none
 * @return none
 */
function searchErrorAlert() {
	$(".error-message")
		.text("No search results found. Please check the spelling of your city and/or specified date.")
		.addClass("bg-danger");
}

/***************************************************************************
 * scrollPage - scrolls to section of page on button click
 * @param{string} page section
 * @return{none}
 */
function scrollPage(element) {
	$("html, body").animate(
		{
			scrollTop: $(element).offset().top - 60
		},
		850
	);
}

/***************************************************************************
 * Listens for window scroll and collpase menu
 */
$(window).on("scroll", function () {
	$(".navbar-collapse.collapse").removeClass("in");
	$(".navbar-collapse.collapse").attr("aria-expanded", false);
	return false;
});

/***************************************************************************
 * anonymous function - navigation bar changes color on scroll
 * @param {undefined} none
 * @returns: {undefined}
 * @calls: none
 */
$(function () {
	$(document).scroll(function () {
		let $nav = $(".navbar-default");
		$nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
	});
});
