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
        zoomSpeed: 0.5,
        format: {
    minorLabels: function(date, scale, step) {
        if (scale === 'year') {
            let year = date.get('year');
            // If year is 0, return "0". Otherwise, return number as string.
            // This naturally removes leading zeros and handles negative signs.
            return year === 0 ? "0" : year.toString();
        }
        return date.format();
    },
    majorLabels: function(date, scale, step) {
        if (scale === 'year') {
            let year = date.get('year');
            return year === 0 ? "0" : year.toString();
        }
        return date.format();
    }
}
    };

    // Create the timeline with the specified container, items, groups, and options
    timeline = new vis.Timeline(container, items, groups, options);
    timeline.on('click', function (properties) {
    if (properties.item) {
        // Get the clicked item using its ID
        var item = items.get(properties.item);

        // CASE 1: Item belongs to the "history" group
        if (item.group === "history" && item.end) {
            // Focus the timeline on the clicked historical period with a smooth animation
            timeline.setWindow(item.start, item.end, {
                animation: {
                    duration: 1000, // Animation duration in milliseconds
                    easingFunction: 'easeInOutQuad'
                }
            });
        }
        // CASE 2: Item belongs to the "books" group
        else if (item.group === "books") {
            if (item.end) {
                // Case for books with a range (series)
                var start = new Date(item.start).getTime();
                var end = new Date(item.end).getTime();
                var duration = end - start;
                var margin = duration * 0.1; 
            
                timeline.setWindow(start - margin, end + margin, {
                    animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
                });
            } else {
                // Case for single-date books (e.g., The Art of War)
                var yearInt;

                // Check if it's a BC date by looking for the leading minus sign
                if (item.start.startsWith('-')) {
                    // Remove the leading minus, take the year part, and convert to integer
                    // Example: "-000450-01-01" -> "000450" -> 450
                    var parts = item.start.split('-');
                    yearInt = parseInt(parts[1], 10) * -1;
                } else {
                    // Standard extraction for AD years
                    yearInt = new Date(item.start).getFullYear();
                }
            
                var windowStart, windowEnd;
            
                if (yearInt < 0) {
                    // For BC dates, Vis.js needs the "-000XXX" 6-digit format
                    // We take the absolute value, pad it to 6 digits, and add the minus back
                    var absStart = Math.abs(yearInt - 10).toString().padStart(6, '0');
                    var absEnd = Math.abs(yearInt + 10).toString().padStart(6, '0');

                    windowStart = '-' + absStart + '-01-01';
                    windowEnd = '-' + absEnd + '-01-01';
                } else {
                    // For AD dates, use the standard 4-digit padding
                    windowStart = (yearInt - 10).toString().padStart(4, '0') + '-01-01';
                    windowEnd = (yearInt + 10).toString().padStart(4, '0') + '-01-01';
                }
            
                timeline.setWindow(windowStart, windowEnd, {
                    animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
                });
            }
        }
    }
});
};

// Function to fit the timeline to show all items when the button is clicked
function fitTimeline() {
    timeline.fit();
}