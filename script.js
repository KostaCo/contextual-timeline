var timeline;

window.onload = function () {
    var container = document.getElementById("visualization");

    var groups = new vis.DataSet(timelineGroups);
    var items = new vis.DataSet(timelineItems);

    var options = {
        height: '800px',
        stack: true,
        start: '1850-01-01',
        end: '1930-01-01',
        zoomSpeed: 0.5
    };

    timeline = new vis.Timeline(container, items, groups, options);
};

function fitTimeline() {
    timeline.fit();
}