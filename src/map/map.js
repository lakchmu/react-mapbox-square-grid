import React from 'react';
import ReactMapboxGl from 'react-mapbox-gl';

import heatmap from '../services/heatmap';
import points from '../statics/mock_points_2k.json';

const omCoords = { long: 73.36859, lat: 54.99244 }; // Omsk Coordinates
const zoom = 14;

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoibGFrY2htdSIsImEiOiJjazBleXA5dncwN2xsM2ltb2s5ejg4bDhnIn0.dAyHlJt5lrhHfCQjUA-gzQ'
});

function onStyleLoad(map, loadEvent) {
  heatmap(map, points);
}

export default function MyMap(props) {
  return <Map
    style="mapbox://styles/mapbox/streets-v9"
    center={[omCoords.long, omCoords.lat]}
    zoom={[zoom]}
    containerStyle={{
      height: '100vh',
      width: '75vw'
    }}
    onStyleLoad={onStyleLoad}
  >
  </Map>;
}
