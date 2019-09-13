import React from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import { squareGrid } from '@turf/turf';

import PulsingDot from './icon';

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoibGFrY2htdSIsImEiOiJjazBleXA5dncwN2xsM2ltb2s5ejg4bDhnIn0.dAyHlJt5lrhHfCQjUA-gzQ'
});

function onStyleLoad(map, loadEvent) {
  const bbox = [73.384579, 54.994916, 73.360546, 54.983510];
  const cellSide = 0.05;
  const options = {units: 'miles'};

  const sg = squareGrid(bbox, cellSide, options);

  const gradientHeight = 15; // 0,0007604

  const gradient = [
    "#EE9CA7", "#EE9FAA", "#EFA3AD",
    "#F0A6B0", "#F1AAB3", "#F2AEB7",
    "#F3B1BA", "#F4B5BD", "#F5B8C0",
    "#F6BCC4", "#F7C0C7", "#F8C3CA",
    "#F9C7CD", "#FACAD0", "#FBCED4",
    "#FCD2D7", "#FDD5DA", "#FED9DD",
    "#FFDDE1"
  ];

  function div(val, by){
    return (val - val % by) / by;
  }

  function getColor(index) {
    const gradientIndex = (index > gradientHeight - 1) ? div(index, gradientHeight) : 0;
    return gradient[gradientIndex];
  }

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

  map.addImage('pulsing-dot', new PulsingDot(map), { pixelRatio: 2 });
  
  map.addLayer(
    {
    "id": "points",
    "type": "symbol",
      "source": {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": [{
            "type": "Feature",
            "geometry":
              {
                "type": "Point",
                "coordinates": [73.36859, 54.99244]
              }
            }]
          }
        },
        "layout": {
        "icon-image": "pulsing-dot"
      }
  });
}

export default function MyMap(props) {
  return <Map
    style="mapbox://styles/mapbox/streets-v9"
    center={[73.36859, 54.99244]}
    zoom={[10]}
    containerStyle={{
      height: '100vh',
      width: '75vw'
    }}
    onStyleLoad={onStyleLoad}
  >
  </Map>;
}
