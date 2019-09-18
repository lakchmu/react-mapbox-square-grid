import { getColor2 } from './gradient';
import addIcon from './icon';

const heatMapSquares = {};
let indexOfSquareWithMostPoints = null;
let origin = null;
let cellWidth = null;
let cellHeight = null;
let gridHeight = null;

function getJsonLayer(id, coordinates, fillColor) {
  const fillOpacity = .8;
  const fillOutlineColor= '#fff';

  return {
    'id': `${id}`,
    'type': 'fill',
    'source': {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': coordinates
        }
      }
    },
    'layout': {},
    'paint': {
      'fill-outline-color': fillOutlineColor,
      'fill-color': fillColor,
      'fill-opacity': fillOpacity
    }
  }
}

function addSquareToMap(map, index, square) {
  const { coordinates } = square.geometry;
  const fillColor = getColor2(heatMapSquares[indexOfSquareWithMostPoints], heatMapSquares[index]);

  map.addLayer(getJsonLayer(index, coordinates, fillColor));
}

function addToHeatMapSquares(indexSquare) {
  heatMapSquares[indexSquare] = (Object.hasOwnProperty.call(heatMapSquares, indexSquare))
    ? heatMapSquares[indexSquare] + 1
    : 1;
  
  if (indexOfSquareWithMostPoints === null || heatMapSquares[indexSquare] > heatMapSquares[indexOfSquareWithMostPoints]) {
    indexOfSquareWithMostPoints = indexSquare;
  }
}

function getGridHeight(squareGrid) {
  const origin = squareGrid.features[0].geometry.coordinates;
  let height = null;

  squareGrid.features.find((feature, index) => {
    const coords = feature.geometry.coordinates;
    height = index;

    return coords[0][0][0] !== origin[0][0][0];
  });

  return height;
}

function findSquare(coords) {
  const row = Math.floor(Math.abs(origin[0][0] - coords.long) / cellWidth);
  const col = Math.floor(Math.abs(origin[0][1] - coords.lat) / cellHeight);

  // Converting the index of a two-dimensional array into the index of a one-dimensional array
  return (row) * gridHeight + col;
}

function processPoints(map, squareGrid, points) {
  points.forEach((point, index) => {
    const indexSquare = findSquare(point.coordinates);

    addToHeatMapSquares(indexSquare);
    addIcon(map, point.coordinates, index);
  });
}

export default function addHeatmap(map, squareGrid, points) {
  // first square of grid (upper right)
  origin = squareGrid.features[0].geometry.coordinates[0];
  cellWidth = origin[0][0] - origin[2][0];
  cellHeight = origin[0][1] - origin[2][1];
  gridHeight = getGridHeight(squareGrid);

  processPoints(map, squareGrid, points);

  let squareIndex = null;
  for (squareIndex in heatMapSquares) { //!!!
    if (Object.hasOwnProperty.call(heatMapSquares, squareIndex)) {
      addSquareToMap(map, squareIndex, squareGrid.features[squareIndex]);
    }
  }

  map.on('click', (event) => {
    const { lat, lng: long } = event.lngLat
    const squareIndex = findSquare({ lat, long });
    const countOfPoints = heatMapSquares[squareIndex] || 0;

    console.log(squareIndex);
    console.log(countOfPoints);
  });
}