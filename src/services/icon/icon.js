import PulsingDot from './pulsingDot';

export default function addIcon(map, coords, index) {
  map.addImage(`pulsing-dot-${index}`, new PulsingDot(map), { pixelRatio: 2 });
  
  map.addLayer({
    "id": `${index}`,
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
        "icon-image": `pulsing-dot-${index}`
      }
    }
  );
}