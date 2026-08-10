let timeline;
let items;
const MAX_VISIBLE_ROWS = 4;
const CARD_WIDTH_PX = 20;

function dateToDecimalYear(dateVal) {
  if (!dateVal) return 0;
  if (dateVal instanceof Date) {
    let year = dateVal.getFullYear();
    let month = dateVal.getMonth();
    let day = dateVal.getDate();
    return year + (month + (day - 1) / 30) / 12;
  }
  if (typeof dateVal === 'string') {
    let isBC = dateVal.startsWith('-');
    let cleanStr = isBC ? dateVal.substring(1) : dateVal;
    let parts = cleanStr.split('-');
    let year = parseInt(parts[0], 10);
    let month = parts[1] ? parseInt(parts[1], 10) : 1;
    let day = parts[2] ? parseInt(parts[2], 10) : 1;
    let decimal = year + (month - 1 + (day - 1) / 30) / 12;
    return isBC ? -decimal : decimal;
  }
  return 0;
}

function decimalYearToDateString(decimalYear) {
  let isBC = decimalYear < 0;
  let absYear = Math.abs(decimalYear);
  let year = Math.floor(absYear);
  let remainder = absYear - year;
  let month = Math.floor(remainder * 12) + 1;
  let day = Math.floor((remainder * 12 - (month - 1)) * 30) + 1;
  if (month > 12) month = 12;
  if (day > 30) day = 30;
  let yearStr = year.toString();
  if (isBC) {
    yearStr = yearStr.padStart(6, '0');
    return `-${yearStr}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  } else {
    yearStr = yearStr.padStart(4, '0');
    return `${yearStr}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
}

function clusterByHeight(groupItems, maxRows, cardWidthPx) {
  if (groupItems.length === 0) return [];
  if (!timeline) return groupItems;

  const range = timeline.getWindow();
  const startYear = dateToDecimalYear(range.start);
  const endYear = dateToDecimalYear(range.end);
  const windowDuration = endYear - startYear || 1;

  const containerWidth = document.getElementById("visualization").clientWidth || window.innerWidth;
  const yearsPerPixel = windowDuration / containerWidth;
  const cardSpanYears = cardWidthPx * yearsPerPixel;

  let itemsWithSpans = groupItems.map(item => {
    let s = dateToDecimalYear(item.start);
    let e = item.end ? dateToDecimalYear(item.end) : s;
    let visualEnd = Math.max(e, s + cardSpanYears);
    return { original: item, start: s, end: visualEnd };
  });

  itemsWithSpans.sort((a, b) => a.start - b.start);

  let activeSlots = [];
  let visibleItems = [];
  let excessItems = [];

  itemsWithSpans.forEach(item => {
    let assignedSlot = -1;
    for (let i = 0; i < activeSlots.length; i++) {
      if (activeSlots[i] <= item.start) {
        assignedSlot = i;
        activeSlots[i] = item.end;
        break;
      }
    }
    if (assignedSlot === -1) {
      activeSlots.push(item.end);
      assignedSlot = activeSlots.length - 1;
    }
    if (assignedSlot >= maxRows) {
      excessItems.push(item);
    } else {
      visibleItems.push(item.original);
    }
  });

  if (excessItems.length === 0) {
    return visibleItems;
  }

  let clusters = [];
  let currentCluster = null;
  excessItems.forEach(item => {
    if (!currentCluster) {
      currentCluster = [item];
    } else {
      let lastItemInCluster = currentCluster[currentCluster.length - 1];
      if (item.start - lastItemInCluster.end < cardSpanYears * 0.1) {
        currentCluster.push(item);
      } else {
        clusters.push(currentCluster);
        currentCluster = [item];
      }
    }
  });
  if (currentCluster) clusters.push(currentCluster);

  let clusterNodes = clusters.map((cList, index) => {
    let count = cList.length;
    let sample = cList[0].original;
    return {
      id: `cluster_${sample.group}_${index}`,
      group: sample.group,
      content: `<div class="cluster-item">+${count}</div>`,
      start: sample.start,
      className: `cluster-node ${sample.group}`,
      isCluster: true,
      clusterItems: cList.map(item => item.original)
    };
  });

  return [...visibleItems, ...clusterNodes];
}


function updateTimelineItems() {
  if (!timeline) return;

  let processedItems = [];
  let groupsData = {
    books: [],
    history: [],
    people: [],
    background: []
  };

  timelineItems.forEach(item => {
    if (item.type === 'background') {
      groupsData.background.push(item);
    } else if (groupsData[item.group]) {
      groupsData[item.group].push(item);
    } else {
      processedItems.push(item);
    }
  });

  let clusteredBooks = clusterByHeight(groupsData.books, MAX_VISIBLE_ROWS, CARD_WIDTH_PX);
  let clusteredHistory = clusterByHeight(groupsData.history, MAX_VISIBLE_ROWS, CARD_WIDTH_PX);
  let clusteredPeople = clusterByHeight(groupsData.people, MAX_VISIBLE_ROWS, CARD_WIDTH_PX);

  processedItems = [
    ...groupsData.background,
    ...clusteredBooks,
    ...clusteredHistory,
    ...clusteredPeople,
    ...processedItems
  ];

  items.clear();
  items.add(processedItems);

  setTimeout(handleStickyLabels, 10);
}

function calculateEraLevels(eras) {
  const withDecimal = eras.map(e => ({
    ...e,
    _start: dateToDecimalYear(e.start),
    _end: dateToDecimalYear(e.end)
  }));

  const sorted = [...withDecimal].sort((a, b) => {
    if (a._start !== b._start) return a._start - b._start;
    return b._end - a._end;
  });

  const slots = [];
  return sorted.map(era => {
    let slot = 0;
    while (slots[slot] !== undefined && slots[slot] > era._start) {
      slot++;
    }
    slots[slot] = era._end;
    const original = eras.find(e => e.id === era.id);
    if (original) {
      original.level = slot;
      return original;
    }
    return era;
  });
}

let ticking = false;

function handleStickyLabels() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const timelineContainer = document.getElementById('visualization');
      const centerPanel = document.querySelector('.vis-panel.vis-center');
      if (!timelineContainer || !centerPanel) {
        ticking = false;
        return;
      }
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
      ticking = false;
    });
    ticking = true;
  }
}

function fitTimeline() {
  if (timeline) {
    timeline.fit();
  } else {
    console.warn('Timeline not initialized yet');
  }
}

let timelineItems = [...books, ...historicalEvents, ...calculateEraLevels(eras), ...people];

window.onload = function() {
  var container = document.getElementById("visualization");
  var groups = new vis.DataSet(timelineGroups);
  items = new vis.DataSet();

  var options = {
    height: '80vh',
    stack: true,
    margin: { item: 2 },
    format: {
      minorLabels: function(date, scale, step) {
        let year = date.get('year');
        let yearStr = year === 0 ? "0" : year.toString();
        if (scale === 'year') return yearStr;
        if (scale === 'month') return date.format('MMM') + ' ' + yearStr;
        if (scale === 'day' || scale === 'weekday') return date.format('DD MMM') + ' ' + yearStr;
        return date.format('HH:mm');
      },
      majorLabels: function(date, scale, step) {
        return date.get('year').toString();
      }
    },
    hiddenDates: [
      { start: "0000-01-01 00:00:00", end: "0001-01-01 00:00:00" },
    ],
    template: function(item) {
      if (item.type === 'background') {
        const level = item.level || 0;
        const levelOffset = level * 35;
        return `<div class="custom-era-label" data-era-id="${item.id}" data-level="${level}" style="transform: translateY(${levelOffset}px);pointer-events: auto !important; cursor: pointer;">${item.content}</div>`;
      }
      return item.content;
    }
  };

  timeline = new vis.Timeline(container, items, groups, options);

  updateTimelineItems();

  document.addEventListener('scroll', handleStickyLabels, true);

  timeline.on('rangechanged', updateTimelineItems);
  timeline.on('changed', () => setTimeout(handleStickyLabels, 10));

  handleStickyLabels();

  container.addEventListener('click', function(e) {
    const label = e.target.closest('.custom-era-label');
    if (label) {
      const eraId = label.dataset.eraId;
      if (eraId) {
        const item = items.get(eraId);
        if (item && item.type === 'background' && item.end) {
          timeline.setWindow(item.start, item.end, {
            animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
          });
          e.stopPropagation();
        }
      }
    }
  });

  timeline.on('click', function(properties) {
    let itemId = properties.item;
    if (!itemId) return;

    let item = items.get(itemId);
    if (!item) return;

    if (item.isCluster) {
      let years = item.clusterItems.map(i => dateToDecimalYear(i.start));
      item.clusterItems.forEach(i => {
        if (i.end) years.push(dateToDecimalYear(i.end));
      });
      let minYear = Math.min(...years);
      let maxYear = Math.max(...years);
      let duration = maxYear - minYear;
      let margin = duration > 0 ? duration * 0.15 : 5;
      timeline.setWindow(
        decimalYearToDateString(minYear - margin),
        decimalYearToDateString(maxYear + margin), {
          animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
        }
      );
      return;
    }

    if (item.type === 'background' && item.end) {
      timeline.setWindow(item.start, item.end, {
        animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
      });
      return;
    }

    if (item.group === "books" || item.group === "history" || item.group === "people") {
      if (item.end) {
        let startYear = dateToDecimalYear(item.start);
        let endYear = dateToDecimalYear(item.end);
        let duration = endYear - startYear;
        let margin = duration > 0 ? duration * 0.1 : 5;
        timeline.setWindow(
          decimalYearToDateString(startYear - margin),
          decimalYearToDateString(endYear + margin), {
            animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
          }
        );
      } else {
        let yearVal = dateToDecimalYear(item.start);
        timeline.setWindow(
          decimalYearToDateString(yearVal - 10),
          decimalYearToDateString(yearVal + 10), {
            animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
          }
        );
      }
    }
  });
};