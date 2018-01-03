// Made with help from Ticketmaster API

let markers = [];
// calls get location when web page is ready or when submit is pressed
$(function () {
    getLocation();
    $("#submit").click(getLocation);
});

function getLocation()
{
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
    var x = document.getElementById("location");
    console.log(position);
    var latlon = position.coords.latitude + "," + position.coords.longitude;

    // accesses ticketmaster API
    $.ajax({
        type:"GET",
        url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey=5QGCEXAsJowiCI4n1uAwMlCGAcSNAEmG&latlong="+latlon,
        async:true,
        dataType: "json",
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
function showError(error)
{
    switch(error.code)
    {
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
    console.log("num", json._embedded.events.length)

    // iterates over list of events and adds to table
    for(var i=0; i<json._embedded.events.length; i++)
    {
        $('#myTable').append("<tr><td><a href=" + json._embedded.events[i].url+ ">"+json._embedded.events[i].name +
        "</a>" + "</td>"+ "<td>"+json._embedded.events[i].dates.start.localDate +"</td></tr>");
    }
}


function initMap(position, json)
{
    var mapDiv = document.getElementById('map');

    var map = new google.maps.Map(mapDiv, {
        center: {lat: position.coords.latitude, lng: position.coords.longitude},
        zoom: 12
    });

    for(var i=0; i<json.page.size; i++)
    {
        addMarker(map, json._embedded.events[i], json);
    }
}

// sets position of map based on current position
function addMarker(map, event, json)
{
    var marker = new google.maps.Marker ({
        position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
        map: map,
        label: event.startDateTime
    });

    // sets marker icon fore each event
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    console.log(marker);
    var events = event._embedded;

    // listens for click and then calls showInfo
    google.maps.event.addListener(marker, 'click', function() {
        showInfo(marker, events, json);
    });

    markers.push(marker);

}

// opens popup box of events
function showInfo(marker, events, json)
{
    // gets position of marker
    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();
    var markerlatlon = lat + "," + lng;
    var exists = 0;

    // Start div
    let div = "<div id='info'>";
    for (var i=0; i<json.page.size; i++)
    {
        // if event and marker locations are the same, adds event to popup window
        var eventlatlon = json._embedded.events[i]._embedded.venues[0].location.latitude + ","
        + json._embedded.events[i]._embedded.venues[0].location.longitude;
        if (markerlatlon == eventlatlon)
        {
            div += "<p><a href=" + json._embedded.events[i].url+ ">"+json._embedded.events[i].name + "</a></p>";
            exists += 1;
        }
    }

    // End div
    div += "</div>";

    // if no event details are available, no popup is produced
    if (exists !== 0)
    {
        let info = new google.maps.InfoWindow();
        // Set info window's content
        info.setContent(div);
        // Open info window (if not already open)
        info.open(map, marker);
    }
}
