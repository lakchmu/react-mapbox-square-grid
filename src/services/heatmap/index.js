import addGrid from './grid';
import addHeatmap from './heatmap';

const DELAY = 1000;

function getBounds(map) {
  const indent = 0.0005;
  const { _ne, _sw } = map.getBounds();
  const upperRight = { long: _ne.lng + indent, lat: _ne.lat + indent };
  const bottomLeft = { long: _sw.lng - indent, lat: _sw.lat - indent };

  return { upperRight, bottomLeft };
}

function getGridBounds({ upperRight, bottomLeft }) {
  const height = upperRight.lat - bottomLeft.lat;
  const width = upperRight.long - bottomLeft.long;

  return [
    upperRight.long + width,
    upperRight.lat + height,
    bottomLeft.long - width,
    bottomLeft.lat - height
  ];
}

function debounce(f, ms) {
  let isCooldown = false;

  return function() {
    if (isCooldown) return;

    f.apply(this, arguments);
    isCooldown = true;
    setTimeout(() => isCooldown = false, ms);
  };
}

function init(map, points) {
  const cellSide = 0.05;
  const { upperRight, bottomLeft } = getBounds(map);
  const bbox = getGridBounds({ upperRight, bottomLeft });
  const squareGrid = addGrid(map, bbox, cellSide);

  addHeatmap(map, squareGrid, points);

  return bbox;
}

function areBoundsInsideBbox(bbox, bounds) {
  const { _ne, _sw } = bounds;

  return _ne.lng < bbox[0] &&
  _ne.lat < bbox[1] &&
  _sw.lng > bbox[2] &&
  _sw.lat > bbox[3];
}

export default function index(map, points) {
  let bbox = init(map, points);

  map.on('moveend', debounce(() => {
    if (!areBoundsInsideBbox(bbox, map.getBounds())) {
      bbox = init(map, points);
    }
  }, DELAY));
}