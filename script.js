// Made with help from Ticketmaster API

let markers = [];
var run = 0;

// calls get location when web page is ready or when submit is pressed
$(function () {
    getLocation();
    $("#submit").click(getLocation);
});

function getLocation()
{
    // checks to see how many times getlocation has been called
    run += 1;
    // calls show position function
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    // displays error if location isn't accessible
    else
    {
        var x = document.getElementById("location");
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position)
{
    console.log(position);
    var latlon = position.coords.latitude + "," + position.coords.longitude;

    // accesses ticketmaster API
    $.ajax({
        type:"GET",
        url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey=5QGCEXAsJowiCI4n1uAwMlCGAcSNAEmG&latlong="+latlon,
        async:true,
        dataType: "json",
        // calls the show event and initialize map function if successful
        success: function(json) {
            console.log(json);
            showEvents(json);
            initMap(position, json);
        },

        error: function(xhr, status, err) {
            console.log(err);
               }
    });
}
// displays verious error messages in different cases
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}

// displays events for table
function showEvents(json)
{
    // empties the part of HTML that may have previously displayed a no events message
    $("#check").empty();
    var userdate = document.getElementsByName("date")[0].value;
    var check = 0;
    //empties any previous table entries
    $("#myTable > tbody").empty();
    // iterates over all events given
    for(var i=0; i<json.page.size; i++) {
        // if it matches date user provided, adds it as a table entry
        if (userdate === json._embedded.events[i].dates.start.localDate)
        {
            //links each entry to its url
            $("#myTable tbody").append("<tr><td><a href=" + json._embedded.events[i].url+ ">"+json._embedded.events[i].name +
            "</a>" + "</td>"+ "<td>"+json._embedded.events[i].dates.start.localDate +"</td></tr>");
            check += 1;
        }
    }
    // if there are no matches, and get location has been run at least twice (submit button required), returns no event message
    if (check === 0 && run > 1)
    {
        $("#check").append("<p>Sorry, there are no events for this date!</p>");
    }

}

// sets position of map based on current position
function initMap(position, json)
{
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
    center: {lat: position.coords.latitude, lng: position.coords.longitude},
    zoom: 12
    });

    // iterates over each event provided
    for(var i=0; i<json.page.size; i++)
    {
        var userdate = document.getElementsByName("date")[0].value;
        //if the date of event matches the one user provides, marker is added
        if (userdate === json._embedded.events[i].dates.start.localDate)
        {
            addMarker(map, json._embedded.events[i], json);
        }
    }
}

function addMarker(map, event, json)
{
    // adds marker for location of venue
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
        map: map,
        label: event.startDateTime
        });
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    console.log(marker);
    // if marker is clicked, showInfo function is called
    var events = event._embedded;
    google.maps.event.addListener(marker, 'click', function() {
        showInfo(marker, events, json);
    });
    markers.push(marker);
}

// opens popup box of events
function showInfo(marker, content, json)
{
    // gets position of marker
    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();
    var markerlatlon = lat + "," + lng;
    var userdate = document.getElementsByName("date")[0].value;
    // Start div
    let div = "<div id='info'>";

    for (var i=0; i<json.page.size; i++)
    {
        var eventlatlon = json._embedded.events[i]._embedded.venues[0].location.latitude + "," + json._embedded.events[i]._embedded.venues[0].location.longitude;
        // if event location and marker location are same, and user date and event date are same,
        // event name and link is added to pop up window
        if (markerlatlon === eventlatlon)
        {
            if (userdate === json._embedded.events[i].dates.start.localDate)
            {
                div += "<p><a href=" + json._embedded.events[i].url+ ">"+json._embedded.events[i].name + "</a></p>";
            }
        }
    }

    // End div
    div += "</div>";
    let info = new google.maps.InfoWindow();

    // Set info window's content
    info.setContent(div);

    // Open info window (if not already open)
    info.open(map, marker);
}
