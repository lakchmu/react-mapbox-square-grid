import { squareGrid } from '@turf/turf';

import getColor from './gradient';

export default function addGrid(map, upperRight, bottomLeft, cellSide) {
  const bbox = [...Object.values(upperRight), ...Object.values(bottomLeft)];
  const options = { units: 'miles' };
  const sg = squareGrid(bbox, cellSide, options);

  map.addSource("grid", {
    "type": "geojson",
    "data": sg
  });

  map.addLayer({
    "id": "grid",
    "type": "fill",
    "source": "grid",
    "paint": {
      'fill-outline-color': '#fff',
      'fill-color': 'transparent',
      'fill-opacity': 0.8
    },
    "filter": ["==", "$type", "Polygon"]
  });

  // sg.features.forEach((feature, index) => {
  //   map.addLayer({
  //     'id': `${index}`,
  //     'type': 'fill',
  //     'source': {
  //       'type': 'geojson',
  //       'data': {
  //         'type': 'Feature',
  //         'geometry': {
  //           'type': 'Polygon',
  //           'coordinates': feature.geometry.coordinates
  //         }
  //       }
  //     },
  //     'layout': {},
  //     'paint': {
  //       'fill-outline-color': '#fff',
  //       // 'fill-color': `${getColor(index)}`,
  //       'fill-color': 'transparent',
  //       'fill-opacity': 0.8
  //     }
  //   });
  // });
}