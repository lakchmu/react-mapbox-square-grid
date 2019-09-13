const gradientHeight = 13;
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

export default function getColor(index) {
  const gradientIndex = (index > gradientHeight - 1) ? div(index, gradientHeight) : 0;
  return gradient[gradientIndex];
}