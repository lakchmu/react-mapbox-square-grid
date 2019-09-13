import React from 'react';
import ReactMapboxGl from 'react-mapbox-gl';

import addGrid from './grid';
import addIcon from './icon';

const omCoords = { long: 73.36859, lat: 54.99244 }; // Omsk Coordinates
const zoom = 14;

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoibGFrY2htdSIsImEiOiJjazBleXA5dncwN2xsM2ltb2s5ejg4bDhnIn0.dAyHlJt5lrhHfCQjUA-gzQ'
});

function getPoints(radius) {
  const upperRight = [omCoords.long + radius*2, omCoords.lat + radius];
  const bottomLeft = [omCoords.long - radius*2, omCoords.lat - radius];

  return { upperRight, bottomLeft };
}

function onStyleLoad(map, loadEvent) {
  const radius = 0.005;
  const cellSide = 0.05;
  const { upperRight, bottomLeft } = getPoints(radius);
  
  addGrid(map, upperRight, bottomLeft, cellSide);
  addIcon(map, omCoords);
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
