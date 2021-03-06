var assert = require('assert')

var { source } = require('./')

assertFull([1,2,3,4,5,6], 'CONCAT')(source.concat(values([1,2,3]), values([4,5,6])))

assertFull(['a','b','c'], 'CONCAT left id')(source.concat(source.empty(), values(['a', 'b', 'c'])))

assertFull(['a','b','c'], 'CONCAT right id')(source.concat(values(['a', 'b', 'c']), source.empty()))

assertFull([2,3,4], 'MAP')(source.map(x => x + 1, values([1,2,3])))

assertFull([2,4,4], 'AP')(source.ap(values([x => x + 1, x => x +2, x => x + 3 ]), values([1, 2, 1, 9])))

function assertFull(array, message) {
  return toArray(x => assert.deepEqual(x, array, message))
}

function values(array) {
  var i = 0
  return function (abort, cb) {
    if(abort) return cb(abort)
    return cb(i >= array.length ? true : null, array[i++])
  }
}

function toArray (cb) {
  var result = []
  return function (read) {
    read(null, function next (end, data) {
      if(end == true) return cb(result)
      else if(end) throw end //error
      result.push(data)
      read(null, next) //loop again.
    })
  }
}