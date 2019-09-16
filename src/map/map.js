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

function getGridBounds(map) {
  const indent = 0.0005;
  const { _ne, _sw } = map.getBounds();
  const upperRight = { lng: _ne.lng + indent, lat: _ne.lat + indent };
  const bottomLeft = { lng: _sw.lng - indent, lat: _sw.lat - indent };

  return { upperRight, bottomLeft };
}

function onStyleLoad(map, loadEvent) {
  const cellSide = 0.05;
  const { upperRight, bottomLeft } = getGridBounds(map);

  addGrid(map, upperRight, bottomLeft, cellSide);
  addIcon(map, omCoords);

  map.on('zoom', (event) => {
    console.log('Moveend zoom');
    console.log(event);
  });

  map.on('moveend', (event) => {
    console.log('Moveend event');
    console.log(event);
  });
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
