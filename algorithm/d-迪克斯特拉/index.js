const graph = {
  music: {
    poster: 0,
    record: 5
  },
  poster: {
    guitar: 30,
    drum: 35
  },
  record: {
    guitar: 15,
    drum: 20
  },
  guitar: {
    piano: 20
  },
  drum: {
    piano: 10
  }
};


const START = 'music';
const END = 'piano';

function findLowestCostNode(cost) {
  const lowestCost = Infinity;

  for(let begin of Object.keys(graph)) {

  }
}

function main() {
  let cost = { [START]: graph[START] };
  let path = [];

  const lowestCostNode = findLowestCostNode(cost);
}

