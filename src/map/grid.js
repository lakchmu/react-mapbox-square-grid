import { squareGrid } from '@turf/turf';

import getColor from './gradient';

export default function addGrid(map, upperRight, bottomLeft, cellSide) {
  const bbox = [...upperRight, ...bottomLeft];
  const options = { units: 'miles' };

  const sg = squareGrid(bbox, cellSide, options);

  sg.features.forEach((feature, index) => {
    map.addLayer({
      'id': `${index}`,
      'type': 'fill',
      'source': {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': feature.geometry.coordinates
          }
        }
      },
      'layout': {},
      'paint': {
        'fill-color': `${getColor(index)}`,
        'fill-opacity': 0.8
      }
    });
  });
}