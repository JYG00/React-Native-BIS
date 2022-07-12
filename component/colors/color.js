let colorArr = [];

export const setColors = (Color) => {
  colorArr = [];
  switch (Color) {
    case 'pink':
      colorArr.push(['#fff0f0', '#ffcccc', '#ffe5cc', '#fff', '#ffecd2', '#fcb69f', '#ffecd2']);
      break;
    case 'black':
      break;
    default:
      break;
  }
};

export const getColors = () => {
  return colorArr;
};
