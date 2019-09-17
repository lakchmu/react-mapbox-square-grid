const gradientHeight = 13;
const gradient = [
  "#FFDDE1", "#FED9DD", "#FDD5DA",
  "#FCD2D7", "#FBCED4", "#FACAD0",
  "#F9C7CD", "#F8C3CA", "#F7C0C7",
  "#F6BCC4", "#F5B8C0", "#F4B5BD",
  "#F3B1BA", "#F2AEB7", "#F1AAB3",
  "#F0A6B0", "#EFA3AD", "#EE9FAA"
]

function div(val, by){
  return (val - val % by) / by;
}

function getColorStep(maxCountPointsInSquare) {
  return gradient.length / maxCountPointsInSquare;
}

export default function getColor(index) {
  const gradientIndex = (index > gradientHeight - 1) ? div(index, gradientHeight) : 0;
  return gradient[gradientIndex];
}

export function getColor2(maxCountPointsInSquare, countPointsInSquare) {
  const colorStep = getColorStep(maxCountPointsInSquare);
  const indexColor = Math.floor(colorStep * countPointsInSquare) - 1;

  return gradient[indexColor];
}