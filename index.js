var xtend = require('xtend');

var date = [
  {
    key: 'all',
    title: 'All'
  },
  {
    key: 'week',
    title: 'Last week'
  },
  {
    key: 'month',
    title: 'Last month'
  },
  {
    key: 'year',
    title: 'Last year'
  }
];

var resolution = [
  {
    key: 'all',
    title: 'All'
  },
  {
    key: 'low',
    title: 'Low'
  },
  {
    key: 'medium',
    title: 'Medium'
  },
  {
    key: 'high',
    title: 'High'
  }
];

var dataType = [
  {
    key: 'all',
    title: 'All Images'
  },
  {
    key: 'service',
    title: 'Image + Map Layer'
  }
];

/**
 * Get the combination of the given dateFilter, resolutionFilter,
 * dataTypeFilter combination.
 */
function getCombination (dateFilter, resolutionFilter, dataTypeFilter) {
  var c = {
    date: getFilter(date, dateFilter),
    resolution: getFilter(resolution, resolutionFilter),
    dataType: getFilter(dataType, dataTypeFilter),
    searchParameters: getSearchParameters(dateFilter, resolutionFilter, dataTypeFilter)
  };
  c.key = [c.date.key, c.resolution.key, c.dataType.key].join('_');

  return c;
}

function getSearchParameters (dateFilter, resolutionFilter, dataTypeFilter) {
  var resolutionParam = {
    'all': {},
    'low': {gsd_from: 5}, // 5 +
    'medium': {gsd_from: 1, gsd_to: 5}, // 1 - 5
    'high': {gsd_to: 1} // 1
  }[resolutionFilter.key];

  var d = new Date();
  if (dateFilter.key === 'week') {
    d.setDate(d.getDate() - 7);
  } else if (dateFilter.key === 'month') {
    d.setMonth(d.getMonth() - 1);
  } else if (dateFilter.key === 'year') {
    d.setFullYear(d.getFullYear() - 1);
  }

  var dateParam = dateFilter.key === 'all' ? {} : {
    acquisition_from: [
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate()
    ].join('-')
  };

  var typeParam = dataTypeFilter.key === 'all' ? {} : { has_tiled: true };

  return xtend(resolutionParam, dateParam, typeParam);
}

/**
 * Get an array of all possible filter combinations.
 */
function getAllCombinations () {
  var combinations = [];
  date.forEach(function (tf) {
    resolution.forEach(function (rf) {
      dataType.forEach(function (sf) {
        combinations.push(getCombination(tf, rf, sf));
      });
    });
  });

  return combinations;
}

/**
 * @private
 * Get the desired filter object from the given list, using either its
 * 0-based index or its string key.  If `filter` is falsy, then the first
 * filter is returned, under the assumption that the 'all' filter always
 * comes first.
 */
function getFilter (list, filter) {
  if (!filter) { return list[0]; }
  if (typeof filter === 'number') { return list[filter]; }
  if (typeof filter === 'string') {
    for (var i = 0; i < list.length; i++) {
      if (list[i].key === filter) { return list[i]; }
    }
  }
  if (typeof filter === 'object' && list.indexOf(filter) >= 0) { return filter; }

  return null;
}

module.exports = {
  getCombination: getCombination,
  getAllCombinations: getAllCombinations,
  getSearchParameters: getSearchParameters,
  filters: {
    date: date,
    resolution: resolution,
    dataType: dataType
  }
};

if (require.main === module) {
  console.log(JSON.stringify(getAllCombinations()));
}
