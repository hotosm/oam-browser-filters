# oam-browser-filters
The grid filters used by the oam-browser front end

## Usage

```
var filters = require('oam-browser-filters')

var combo1 = filter.getCombination('all', 'all', 'all')
var combo2 = filter.getCombination('week', 'medium', 'service')

console.log(combo2.key) // the key used in the vector tile grid data
console.log(combo2.searchParams) // the oam-catalog search parameters associated w this combination of filters.

console.log(filters.getAllCombinations()) // all the possible filter combinations
```
