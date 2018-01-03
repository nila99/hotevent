We have 3 html pages: one for the home-page, one for the ‘all events’ page, and one for the ‘events by date’ page.
The allevents.html sources the scriptsall.js file while the dataevents.html sources the scripts.js file.
We also have the applications.py file that ties it all together.

To begin, the applications.py file contains three routes. The first of which is the home page of our website which contains links to
two different web pages (the ‘all events’ page, and the ‘events by date’ page). The second route is the allevents route which leads
to a page the displays all of the events. The final route is the dateevents route which leads to a page to allow users to filter event results by date.
We chose to do it this way because it would be simple while still useful to our purpose.

Starting with the ‘all events’ web page, we have in our html file a space for a map and a table below to display the name and URL of
the actual events with their dates. We start by calling the getLocation function which geo-caches the user’s current location,
and then calls the showPosition function. This initializes the map and calls the function to show events, as well as calling the ticketmaster
API to retrieve the events. The two functions called by the showPosition function are initMap and showEvent.

initMap just initializes the map based on the user’s current position, and zooms out to the point where the results are conclusive,
while still being relevant. This function also calls addMarker. showEvent uses HTML and JQuery to add a new line for each new event.
addMarker simply adds a marker at the location of each event’s venue. Oftentimes, there will be markers added on top of each other when
events are held in the same location; to the user, it will only appear as one marker. We then added an eventlistener using the Google Maps API
that allows users to click each marker and discover the name of the events in that location if the details are available.
This calls the showInfo function which opens a popup box and uses html to format all of the events in that marker while adding a link to each event.
There is also a showError function that uses a switch statement to display various error messages in different cases
(mostly errors with retrieving the location).

Our final route is very similar to the one above; however, this route allows users to filteupdate50r their events by date.
First, in showEvent, it makes sure that any event shown matches the date entered by the user. If the user has not entered a date yet,
it will not show anything. In initMap, it checks to see if each event matches the date entered by user before adding it to the map.
Also, when creating the popup box, the program has to make sure that both the date and the location matches the desired one.
If there are no event matches, our program prints a message stating that there are no events. In order to do this, we have to check to make
sure there are no date matches, but also that getLocation has been called more than once, otherwise the error message will print before the
user has entered any date!
