var timeline;

// Initialize the timeline when the page loads
window.onload = function () {
    var container = document.getElementById("visualization"); // Get the container element for the timeline from the HTML

    // Convert the groups and items from data.js into vis.js DataSet format
    var groups = new vis.DataSet(timelineGroups);
    var items = new vis.DataSet(timelineItems);

    var options = {
        height: '800px',
        stack: true, // Stack items on top of each other when they overlap
        margin: { 
            item: 2
        },
        start: '1850-01-01', // Set the initial zoom level
        end: '1930-01-01',
        zoomSpeed: 0.5
    };

    // Create the timeline with the specified container, items, groups, and options
    timeline = new vis.Timeline(container, items, groups, options);
};

// Function to fit the timeline to show all items when the button is clicked
function fitTimeline() {
    timeline.fit();
}