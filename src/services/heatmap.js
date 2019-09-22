const options = {};

function initOption({ map, squareGrid }) {
  const { coordinates } = squareGrid.features[0].geometry;

  options['map'] = map;
  options['squareGrid'] = squareGrid
  options['origin'] = coordinates[0] // first square of grid (upper right)
  options['cellWidth'] = coordinates[0][0][0] - coordinates[0][2][0]
  options['cellHeight'] = coordinates[0][0][1] - coordinates[0][2][1]
  options['gridHeight'] = getGridHeight(squareGrid)
  options['heatMapSquares'] = {}

  return options;
}

function getGridHeight(squareGrid) {
  const { features } = squareGrid;
  const origin = features[0].geometry.coordinates;
  let height = null;

  features.find((feature, index) => {
    const coords = feature.geometry.coordinates;
    height = index;

    return coords[0][0][0] !== origin[0][0][0];
  });

  return height;
}

function addToHeatMapSquares(squareIndex) {
  const { heatMapSquares } = options;
  heatMapSquares[squareIndex] = (Object.hasOwnProperty.call(heatMapSquares, squareIndex))
    ? heatMapSquares[squareIndex] + 1
    : 1;
}

function findSquare(coords) {
  const { cellWidth, cellHeight, gridHeight, origin } = options;
  const row = Math.floor(Math.abs(origin[0][0] - coords.long) / cellWidth);
  const col = Math.floor(Math.abs(origin[0][1] - coords.lat) / cellHeight);

  // Converting the index of a two-dimensional array into the index of a one-dimensional array
  return (row) * gridHeight + col;
}

function checkPoint(point) {
  const { origin } = options;
  const { features } = options.squareGrid;
  const lastIndex = features.length - 1;
  const lastSquare = features[lastIndex].geometry.coordinates[0];

  return point.coordinates.long > lastSquare[2][0] &&
    point.coordinates.lat > lastSquare[2][1] &&
    point.coordinates.long < origin[0][0] &&
    point.coordinates.lat < origin[0][1];
}

function processPoints(points) {
  let pointsNumber = 0;

  points.forEach((point) => {
    if (checkPoint(point)) {
      const squareIndex = findSquare(point.coordinates);

      addToHeatMapSquares(squareIndex);
      pointsNumber += 1;
    }
  });

  return pointsNumber;
}

function getHeatMapJson() {
  const { squareGrid, heatMapSquares } = options;
  const heatMapJson = {
    "type": "FeatureCollection",
    "features": []
  };
  let key = null;

  for (key in heatMapSquares) {
    const length = heatMapJson["features"].push(squareGrid.features[key]);
    heatMapJson["features"][length - 1]["properties"] = { "points": heatMapSquares[key] }
  }

  return heatMapJson;
}

function addHeatmapLayer(geojson) {
  const { map } = options;
  map.addSource(
    "heatmap",
    {
      "type": "geojson",
      "data": geojson
    }
  );

  map.addLayer({
    "id": "heatmap",
    "type": "fill",
    "source": "heatmap",
    'paint': {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'points'],
        0, '#FFDDE1',
        4, '#EE9FAA',
      ],
      'fill-opacity': .75
    },
    "filter": ["==", "$type", "Polygon"]
  });
}

function onClick(event) {
  const { heatMapSquares } = options;
  const { lat, lng: long } = event.lngLat;
  const squareIndex = findSquare({ lat, long });
  const countOfPoints = heatMapSquares[squareIndex] || 0;

  console.log(squareIndex);
  console.log(countOfPoints);
}

function addEventsListeners() {
  const { map } = options;

  map.on('click', onClick);
}

export default function addHeatmap(map, squareGrid, points) {
  initOption({ map, squareGrid });
  processPoints(points);
  addHeatmapLayer(getHeatMapJson());
  addEventsListeners();
}

export {
  options,
  initOption,
  getGridHeight,
  addToHeatMapSquares,
  findSquare,
  checkPoint,
  processPoints,
  getHeatMapJson,
  addHeatmapLayer,
  addEventsListeners,
  onClick,
}