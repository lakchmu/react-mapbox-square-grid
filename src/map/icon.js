import PulsingDot from './pulsingDot';

export default function addIcon(map, coords) {
  map.addImage('pulsing-dot', new PulsingDot(map), { pixelRatio: 2 });
  
  map.addLayer({
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
                "coordinates": [coords.long, coords.lat]
              }
            }]
          }
        },
        "layout": {
        "icon-image": "pulsing-dot"
      }
    }
  );
}