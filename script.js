let timeline;

// Initialize the timeline when the page loads
window.onload = function () {
    var container = document.getElementById("visualization"); // Get the container element for the timeline from the HTML

    // Convert the groups and items from data.js into vis.js DataSet format
    var groups = new vis.DataSet(timelineGroups);
    var items = new vis.DataSet(timelineItems);
    
    var options = {
        height: '80vh',
        stack: true, // Stack items on top of each other when they overlap
        margin: { 
            item: 2
        },
        format: {
            minorLabels: function(date, scale, step) {
                let year = date.get('year');
                let yearStr = year === 0 ? "0" : year.toString();
            
                // If we are looking at years or decades
                if (scale === 'year') {
                    return yearStr;
                }
                // If we zoom in to months/days, show "Month Year" or "Day Month Year"
                if (scale === 'month') {
                    return date.format('MMM') + ' ' + yearStr;
                }
                if (scale === 'day' || scale === 'weekday') {
                    return date.format('DD MMM') + ' ' + yearStr;
                }
                // Fallback for extremely deep zooms (hours/minutes)
                return date.format('HH:mm');
            },
            majorLabels: function(date, scale, step) {
                let year = date.get('year');
                let yearStr = year === 0 ? "0" : year.toString();
            
                if (scale === 'year') {
                    return yearStr;
                }
                // If minor is 'month', major shows the Year
                return yearStr;
            }
        },
        hiddenDates: [
            { start: "0000-01-01 00:00:00", 
                end: "0001-01-01 00:00:00" },
        ],
        //Template for era labels
        template: function (item) {
            if (item.type === 'background') {
                const level = item.level || 0;
                const levelOffset = level * 35;
                                return `<div class="custom-era-label" 
                            data-level="${level}" 
                            style="transform: translateY(${levelOffset}px);pointer-events: auto !important;">
                            ${item.content}
                        </div>`;
            }
            return item.content;
        }
    };

    // Create the timeline with the specified container, items, groups, and options
    timeline = new vis.Timeline(container, items, groups, options);

    document.addEventListener('scroll', handleStickyLabels, true);
    timeline.on('rangechange', handleStickyLabels);
    timeline.on('changed', () => setTimeout(handleStickyLabels, 10));

    handleStickyLabels();

    timeline.on('click', function (properties) {
        let itemId = properties.item;

    if (!itemId && properties.event) {
        let target = properties.event.target.closest('.custom-era-label');
        if (target) {
            let clickedTime = properties.time;
            itemId = items.get({
                filter: function (item) {
                    return item.type === 'background' && 
                           clickedTime >= new Date(item.start) && 
                           clickedTime <= new Date(item.end);
                }
            })[0]?.id;
        }
    }

    if (itemId) {
        let item = items.get(itemId);
        
        // Sada se ovaj deo izvršava samo ako je itemId preživeo gornju proveru (klik na label)
        if (item.type && item.type === "background" && item.end) {
            timeline.setWindow(item.start, item.end, {
                animation: {
                    duration: 1000,
                    easingFunction: 'easeInOutQuad'
                }
            });
        }
        // CASE 2: Item belongs to the "books" group
        else if (item.group === "books" || item.group === "history") {
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

// Function for making era labels allways visible if user is looking at that era on timeline
function handleStickyLabels() {
    const timelineContainer = document.getElementById('visualization');
    const centerPanel = document.querySelector('.vis-panel.vis-center');
    if (!timelineContainer || !centerPanel || !timeline) return;

    const containerRect = timelineContainer.getBoundingClientRect();
    const labels = document.querySelectorAll('.custom-era-label');

    labels.forEach(label => {
        const itemElement = label.closest('.vis-item.vis-background');
        if (!itemElement) return;

        const eraRect = itemElement.getBoundingClientRect();
        
        const level = parseInt(label.getAttribute('data-level')) || 0;
        const levelOffset = level * 35;
        
        let verticalDrift = containerRect.top - eraRect.top;
        
        let finalY = Math.max(0, verticalDrift) + levelOffset + 10;
        let finalX = 10; 

        label.style.transform = `translate(${finalX}px, ${finalY}px)`;
    });
}