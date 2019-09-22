const {
  options,
  initOption,
  getGridHeight,
  addToHeatMapSquares,
  findSquare,
  checkPoint,
  getHeatMapJson,
  addHeatmapLayer,
  addEventsListeners,
  onClick,
} = require('../services/heatmap');

const squareGrid = require('./__mocks__/squareGrid.json');
const point = require('./__mocks__/point.json');

describe('Heatmap testing', () => {
  test('Test 1', async () => {
    expect(options).toEqual(expect.objectContaining({}));
    initOption({ map: {}, squareGrid });
    expect(options).toEqual(expect.objectContaining({
      map: expect.any(Object),
      squareGrid: expect.any(Object),
      origin: expect.any(Array), // first square of grid (upper right)
      cellWidth: expect.any(Number),
      cellHeight: expect.any(Number),
      gridHeight: expect.any(Number),
      heatMapSquares: {},
    }),);
  });

  test('Test 2', async () => {
    const res = getGridHeight(squareGrid);
    expect(res).toBe(33);
  });

  test('Test 3', async () => {
    initOption({ map: {}, squareGrid });
    expect(options.heatMapSquares).not.toHaveProperty('3');
    addToHeatMapSquares(3);
    expect(options.heatMapSquares).toHaveProperty('3');
  });

  test('Test 4', async () => {
    initOption({ map: {}, squareGrid });
    expect(findSquare(point.coordinates)).toBe(69);
  });

  test('Test 5', async () => {
    initOption({ map: {}, squareGrid });
    expect(checkPoint(point)).toBeTruthy();
  });

  test('Test 6', async () => {
    initOption({ map: {}, squareGrid });
    options['heatMapSquares'][3] = 1;
    const json = getHeatMapJson();
    const sample = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { points: 1 },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [73.38751706621491, 55.00220768149592],
                [73.38751706621491, 55.0014840235802],
                [73.38625526180051, 55.0014840235802],
                [73.38625526180051, 55.00220768149592],
                [73.38751706621491, 55.00220768149592]
              ]
            ]
          }
        }
      ]
    };

    expect(json).toStrictEqual(sample);
  });

  test('Test 7', async () => {
    const map = {
      addSource: jest.fn(),
      addLayer: jest.fn()
    }
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { points: 1 },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [73.38751706621491, 55.00220768149592],
                [73.38751706621491, 55.0014840235802],
                [73.38625526180051, 55.0014840235802],
                [73.38625526180051, 55.00220768149592],
                [73.38751706621491, 55.00220768149592]
              ]
            ]
          }
        }
      ]
    };

    initOption({ map, squareGrid });
    addHeatmapLayer(geojson);

    expect(map.addSource).toHaveBeenLastCalledWith(
      "heatmap",
      {
        data: geojson,
        type: "geojson"
      });

    expect(map.addLayer).toHaveBeenCalled();
  });

  test('Test 8', async () => {
    const map = {
      addSource: jest.fn(),
      addLayer: jest.fn(),
      on: jest.fn()
    }

    initOption({ map, squareGrid });
    addEventsListeners();

    expect(map.on).toHaveBeenLastCalledWith( 'click', onClick );
  });
});