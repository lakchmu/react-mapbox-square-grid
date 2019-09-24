import { squareGrid } from '@turf/turf';

export default function addGrid(map, bbox, cellSide) {
  const options = { units: 'miles' };
  const id = `grid`;

  const sg = squareGrid(bbox, cellSide, options);
  const source = map.getSource(id);

  if (source) {
    source.setData(sg);
    return sg;
  }

  map.addSource(
    id,
    {
      "type": "geojson",
      "data": sg
    }
  );

  map.addLayer({
    "id": id,
    "type": "fill",
    "source": id,
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

  return sg;
}