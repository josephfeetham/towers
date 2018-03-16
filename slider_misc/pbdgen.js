// This Stack is written using the pseudoclassical pattern

// Creates the queue
const Queue = function () {
  this.storage = {};
  this.count = 0;
  this.lowestCount = 0;
};

// Adds a value to the end of the chain
Queue.prototype.enqueue = function (value) {
  // Check to see if value is defined
  if (value) {
    this.storage[this.count] = value;
    this.count++;
  }
};

// Removes a value from the beginning of the chain
Queue.prototype.dequeue = function () {
  // Check to see if queue is empty
  if (this.count - this.lowestCount === 0) {
    return undefined;
  }

  let result = this.storage[this.lowestCount];
  delete this.storage[this.lowestCount];
  this.lowestCount++;
  return result;
};

// Returns the length of the queue
Queue.prototype.size = function () {
  return this.count - this.lowestCount;
};

var fs = require('fs');

function generatePDB(locations) {
  let states = {};
  for (let i = 0; i < 25; ++i) {
    for (let j = 0; j < 25; ++j) {
      if (j === i) continue;
      for (let k = 0; k < 25; ++k) {
        if (k === j || k === i) continue;
        for (let l = 0; l < 25; ++l) {
          if (l === k || l === j || l === i) continue;
          states[`${i},${j},${k},${l}`] = {};
          for (let m = 0; m < 25; ++m) {
            if (m === l || m === k || m === j || m === i) continue;
            states[`${i},${j},${k},${l}`][m] = -1;
          }
        }
      }
    }
  }

  let queue = new Queue();
  queue.enqueue({m: 24, cost: 0, locations});
  let node = null;
  while (node = queue.dequeue()) {
    const m = node.m;
    let cost = node.cost;
    if (states[node.locations.join(",")][m] !== -1) continue;
    states[node.locations.join(",")][m] = cost;
    [m + 1, m - 1, m + 5, m - 5].filter(n => {
      return !(Math.abs(m % 5 - n % 5) === 4 || n % 25 !== n || n < 0)
    }).forEach(n => {
      let locations = node.locations;
      const swapIdx = locations.indexOf(n);
      if (swapIdx > -1) {
        locations = locations.slice();
        locations[swapIdx] = m;
        ++cost;
      }
      queue.enqueue({
        locations, cost, m: n
      });
    });
  }

  let pdb = {};
  Object.keys(states).forEach(k => {
    let locations = k.split(",").map(e => parseInt(e));
    pdb[locations[0] + locations[1] * 25 + locations[2] * 25 ** 2 + locations[3] * 25 ** 3] = Math.min(...Object.values(states[k]));
  });
  fs.writeFileSync(`pdb${locations.join("")}.json`, JSON.stringify(pdb), 'utf8');
  console.log(`finished writing pdb${locations.join("")}.json`);
}


//11116
//22226
//33336
//44446
//5555
generatePDB([0, 1, 2, 3]);
generatePDB([5, 6, 7, 8]);
generatePDB([10, 11, 12, 13]);
generatePDB([15, 16, 17, 18]);
generatePDB([20, 21, 22, 23]);
generatePDB([4, 9, 14, 19]);

//11166
//12226
//33326
//35444
//5554
generatePDB([0, 1, 2, 5]);
generatePDB([6, 7, 8, 13]);
generatePDB([10, 11, 12, 15]);
generatePDB([17, 18, 19, 23]);
generatePDB([16, 20, 21, 22]);
generatePDB([3, 4, 9, 14]);

//11226
//11226
//33366
//35544
//5544
generatePDB([0, 1, 5, 6]);
generatePDB([2, 3, 7, 8]);
generatePDB([10, 11, 12, 15]);
generatePDB([18, 19, 22, 23]);
generatePDB([16, 17, 20, 21]);
generatePDB([4, 9, 13, 14]);

//11266
//13266
//13224
//33544
//5554
generatePDB([0, 1, 5, 10]);
generatePDB([2, 7, 12, 13]);
generatePDB([6, 11, 15, 16]);
generatePDB([14, 18, 19, 23]);
generatePDB([17, 20, 21, 22]);
generatePDB([3, 4, 8, 9]);
