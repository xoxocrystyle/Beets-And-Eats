/***************************************************************************
 * initializeApp - add click handler to search button, render landing page
 * @params {undefined}
 * @returns  {undefined}
 */
/***************************************************************************
 * getLocation - gets city and state code from user input and returns information in object
 * @param: {undefined} none
 * @returns: object
 * @calls: inputCityCheck, getStateFromDropDown
 */
/***************************************************************************
 * inputCityCheck - gets string entered by user, checks that it is a US city
 * @param: {undefined} none
 * @returns: string
 * @calls: none
 */
/***************************************************************************
 * getStateFromDropDown - pulls state code from selected drop down menu item
 * @param: {undefined} none
 * @returns: string
 * @calls: none
 */
/***************************************************************************
 * handleSearchButtonClick - when “search” button is clicked, call ticketmaster ajax call  
 * @param {object} event  The event object from the click
 * @returns: number
 * @calls: ticketmasterAjaxCall
 */
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

function getYelpRestaurants() {
    let yelpArrayOfRestaurants = [];
    let restaurantData;
    let ajaxConfig = {
        dataType: 'json',
        url: 'https://api.yelp.com/v3/businesses/search?location=92617&term=\'restaurants\'&radius=40000',
        Method: 'GET',
        Authorization: 'Bearer pURiuoXhZlcO2BTtM2Rzs12nrUjIU9r-SBSKNv_Ma0C9vHSvmCnQRzq_nRyR59-XLCzVd3GlGzGUVSZANd1xOnY0JPvKrQiz94R4_1MdpKQC_yj8YUUB0U2nyl1dWnYx',
        data: {
            location: 90305,
            term: 'food',
            radius: 40000
        },
        success: function(data) {
            console.log(data);
            for(let arrayIndex = 0; arrayIndex < data.businesses.length; arrayIndex++) {
                let newObj = {};
                newObj.name =  data.businesses[arrayIndex].name;
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
            console.error('The server returned no information.')
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
