let colorArr = ['#fff0f0', '#ffcccc', '#ffe5cc', '#ff0028', '#ffecd2', '#fcb69f', '#ffecd2', '#fbcce7'];

export const setColors = (Color) => {
  colorArr = [];
  // [배경색,임의,네비테두리색,도착시간색,그라데이션1,그라데이션2,그라데이션3,테마변경드롭다운색]
  switch (Color) {
    case 'Red':
      colorArr.push(['#ffa07a', '#ffcccc', '#ff6347', '#000', '#fa8072', '#bf132b', '#860111', '#ff4040']);
      break;
    case 'Pink':
      colorArr.push(['#fff0f0', '#ffcccc', '#ffe5cc', '#ff0028', '#ffecd2', '#fcb69f', '#ffecd2', '#fbcce7']);
      break;
    case 'Grey':
      colorArr.push(['#dcdcdc', '#778899', '#c9c0bb', '#000', '#c0c0c0', '#696969', '#778899', '#dcdcdc']);
      break;
    case 'Green':
      colorArr.push(['#e9ffdb', '#a3c1ad', '#a8e4a0', '#000', '#e9ffdb', '#0bda51', '#7fff00', '#a8e4a0']);
      break;
    case 'Blue':
      colorArr.push(['#add8e6', '#a3c1ad', '#87ceeb', '#000', '#ace5ee', '#0fc0fc', '#318ce7', '#87cefa']);
      break;
    default:
      break;
  }
};

export const getColors = () => {
  return colorArr;
};
