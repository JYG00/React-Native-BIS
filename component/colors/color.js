let colorArr = [];

export const setColors = (Color) => {
  colorArr = [];
  // [배경색,임의,네비테두리색,도착시간색,그라데이션1,그라데이션2,그라데이션3,테마변경드롭다운색]
  switch (Color) {
    case 'Pink':
      colorArr.push(['#fff0f0', '#ffcccc', '#ffe5cc', '#ff0028', '#ffecd2', '#fcb69f', '#ffecd2', '#fbcce7']);
      break;
    case 'Gray':
      colorArr.push(['#dcdcdc', '#778899', '#c9c0bb', '#000', '#c0c0c0', '#696969', '#778899', '#dcdcdc']);
      break;
    case 'Green':
      colorArr.push(['#a8e4a0', '#a3c1ad', '#a8e4a0', '#000', '#0bda51', '#7fff00', '#e9ffdb', '#a8e4a0']);
      break;
    case 'Blue':
      colorArr.push(['#87cefa', '#a3c1ad', '#87ceeb', '#000', '#ace5ee', '#0fc0fc', '#318ce7', '#87cefa']);
      break;
    default:
      break;
  }
};

export const getColors = () => {
  return colorArr;
};
